import React, { useEffect, useState } from 'react';
import {InitialStore} from "../types/Store";
import { useSelector, useDispatch } from 'react-redux';

import {LanguageSelectorTheme, SignalIrEvents} from "../constants";

import LanguageSelector from "../components/languageSelector";
import './welcome.css';
import svgImage from '../assets/board.svg';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import signalIrService from "../services/signalIrService";
import httpService from '../services/httpService';

const swal = withReactContent(Swal);
const { getTranslationInstance } = require("../translations/translate");

interface WelcomeProps {
  room_id?: string;
  show_reconnect_modal?: boolean;
}
const WARN_MESSAGE_TYPES = {
  "ERROR": "errorText",
  "INFO": "infoText",
  "WARNING": "warnText",
  "SUCCESS": "successText",
};

// todo reconnect mechanism fix
const createReconnectModal = async (roomId:string, translation:any, dispatch:any) => {
  if(!roomId)
    return;
  
  const modalResult = await swal.fire({
    backdrop: `
        url(${svgImage})
        center
        repeat
    `,
    title: translation.get("modal_reconnect_title"),
    html: <div>
      <b>{translation.get("modal_reconnect_subtitle")}</b>
      <p>{translation.get("modal_reconnect_content")}</p>
    </div>,
    showCancelButton: true,
    confirmButtonText: translation.get("modal_reconnect_accept_button"),
    cancelButtonText:  translation.get("modal_reconnect_decline_button"),
  });

  if(modalResult.dismiss === Swal.DismissReason.cancel)
  {
    dispatch({ type: 'SET_ROOM_ID', payload:null});
  }
  else if(modalResult.isConfirmed)
  {
    window.location.href = "/gameboard/" + roomId;
  }
}

/* ===== CREATE SESSION ===== */
const createSessionModal = async (translation:any, dispatch:any) => {
  let usernameInput:HTMLInputElement;

  const modal = swal.fire({
    allowOutsideClick:false,
    allowEscapeKey: false,
    backdrop: `
        url(${svgImage})
        center
        repeat
    `,
    title: translation.get("modal_create_session_title"),
    html: <div>
      <p>{translation.get("modal_create_session_subtitle")}</p>
      <input type="text" id="username" className="swal2-input" placeholder="Enter your username"></input>
    </div>,
    confirmButtonText: translation.get("modal_create_session_accept_button"),
    preConfirm: () => {
      usernameInput = document.getElementById("username") as HTMLInputElement;
      if(!usernameInput.value || usernameInput.value.length < 3)
        return false;
    },
  });

  const modalResult = await modal;
  if(modalResult.isConfirmed)
  {
    usernameInput = document.getElementById("username") as HTMLInputElement;
    const authResponse = await httpService.createAuthentication(usernameInput.value);

    if(!authResponse)
      return window.location.reload();

    dispatch({ type: 'SET_AUTH_KEY', payload:authResponse.auth_token});
    dispatch({ type: 'SET_USERNAME', payload:authResponse.username});
    window.location.reload();
  }
}

const Welcome: React.FC<WelcomeProps> = ({ room_id, show_reconnect_modal }) => {
  const dispatch = useDispatch();

  const storageUsername = useSelector((state:InitialStore) => state.username);
  const storageAuthKey = useSelector((state:InitialStore) => state.authKey);
  const storageLanguage = useSelector((state:InitialStore) => state.language)

  const [username, setUsername] = useState(storageUsername);
  const [roomId, setRoomId] = useState(room_id ?? "");
  const [warnMessageType, setWarnMessageType] = useState(WARN_MESSAGE_TYPES.ERROR);
  const [warnMessage, setWarnMessage] = useState("");

  const [isAuthenticationValid, setIsAuthenticationValid] = useState(storageUsername != null && storageAuthKey != null);
  const [isReconnectModalActive, setIsReconnectModalActive] = useState(show_reconnect_modal);

  const translation= getTranslationInstance(storageLanguage);

  if(!isAuthenticationValid)
    createSessionModal(translation, dispatch);

  if(isReconnectModalActive)
    createReconnectModal(roomId, translation, dispatch);

  const panelSwitchToCreateRoom = () => {
    const container = document.getElementById('container');
    if (container)
      container.classList.add("right-panel-active");
      setWarnMessage("");
  }

  const panelSwitchToJoinRoom = () => {
    const container = document.getElementById('container');
    if (container)
      container.classList.remove("right-panel-active");
      setWarnMessage("");
  }

  useEffect(() => {
    if (username != storageUsername) {
      setUsername(storageUsername);
    }
  }, [storageUsername]);

  /* ===== JOIN ROOM ===== */
  const joinRoomAction = () => {
    if(storageAuthKey == null || roomId == null)
        return false;

    signalIrService.triggerEvent(SignalIrEvents.JOIN_ROOM, [storageAuthKey, roomId]);
  }

  signalIrService.listenEvent(SignalIrEvents.JOIN_ROOM, (data:any) => {
    if(data.event == "room_join_success")
    {
      signalIrService.stopListenEvent(SignalIrEvents.JOIN_ROOM);
      dispatch({ type: 'SET_ROOM_ID', payload:roomId});
      window.location.href = "/join_room/" + roomId;
    }
    else if(data.event == "user_already_room_member")
    {
      signalIrService.stopListenEvent(SignalIrEvents.JOIN_ROOM);
      dispatch({ type: 'SET_ROOM_ID', payload:roomId});
      window.location.href = "/join_room/" + roomId;
    }
    else
    {
      setWarnMessageType(WARN_MESSAGE_TYPES.ERROR);
      setWarnMessage(translation.get("error_" + data.event));
    }
  });

  /* ===== CREATE ROOM ===== */

  const createRoomAction = () => {
    if(storageAuthKey == null || roomId == null)
        return false;

    signalIrService.triggerEvent(SignalIrEvents.CREATE_ROOM, [storageAuthKey, roomId]);
  }

  signalIrService.listenEvent(SignalIrEvents.CREATE_ROOM, (data:any) => {
    if(data.event == "create_room_success")
    {
      signalIrService.stopListenEvent(SignalIrEvents.CREATE_ROOM);
      dispatch({ type: 'SET_ROOM_ID', payload:roomId});
      window.location.href = "/join_room/" + roomId;
    }
    else
    {
      setWarnMessageType(WARN_MESSAGE_TYPES.ERROR);
      setWarnMessage(translation.get("error_" + data.event));
    }
  });

  /* ===== LOGOUT ===== */
  const logoutAction = async () => {
    if(storageAuthKey == null)
      return false;

    const logoutResponse = await httpService.invalidateAuthentication(storageAuthKey);
    
    if(logoutResponse)
    {
      dispatch({ type: 'LOGOUT', payload:null});
      setWarnMessageType(WARN_MESSAGE_TYPES.SUCCESS);
      setWarnMessage(translation.get("logout_success_text"));

      signalIrService.stop();
      setTimeout(() => {window.location.reload()}, 1500);
    }
    else
    {
      setWarnMessageType(WARN_MESSAGE_TYPES.ERROR);
      setWarnMessage(translation.get("error_authentication_failed"));
    }
  }

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container secondary-container">
          <form action="#">
            <h1>{translation.get("create_room_title")}</h1>
            <span>{translation.get("create_room_subtitle")}</span>
            <input type="text"
              placeholder={translation.get("room_id_text_place_holder")}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              id="roomId" />
            <button onClick={createRoomAction}>{translation.get("create_room_button")}</button>
            <p className={warnMessageType}>{warnMessage}</p>
          </form>
        </div>
        <div className="form-container primary-container">
          <form action="#">
            <h1>{translation.get("join_room_header")}</h1>
            <span>{translation.get("join_room_subtitle")}</span>
            <input type="text"
              placeholder={translation.get("room_id_text_place_holder")}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              id="roomId" />
            <button onClick={joinRoomAction}>{translation.get("join_room_button")}</button>
            <p className={warnMessageType}>{warnMessage}</p>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>{translation.get("do_you_want_to_join_room")}</h2>
              <p>{translation.get("is_someone_waiting_you")}</p>
              <button className="ghost" onClick={panelSwitchToJoinRoom}>{translation.get("join_room_button")}</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>{translation.get("general_title")}</h1>
              <p>
                {translation.get("welcome_title")},
                &nbsp;<b>{username}</b>
                <br/>
                {translation.get("welcome_subtitle")
              }</p>
              <button className="ghost" onClick={panelSwitchToCreateRoom}>{translation.get("create_room_button_text")}</button>
              {isAuthenticationValid && <button className="ghost logout_button" onClick={logoutAction}>{translation.get("logout_button_text")}</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="languageSelectionContainer">
        <LanguageSelector languageSelectorTheme={LanguageSelectorTheme.LIGHT}/>
      </div>

      <footer>
        <p>
          All rights reserved. &copy; <a className="themeLink" href="https://umitaksoylu.com">Ümit Aksoylu</a>&emsp;
          |&emsp;<a className="themeLink" href="/about">About Liar's Dice</a>&emsp;
          |&emsp;<a className="themeLink" href="https://github.com/Aksoylu/LiarsDice">Get source on Github</a>&emsp;

        </p>
      </footer>
    </div>
  );
};

export default Welcome;
