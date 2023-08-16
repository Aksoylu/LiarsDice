import React, { useEffect, useState } from 'react';
import {InitialStore} from "../types/Store";
import { useSelector, useDispatch } from 'react-redux';

import {LanguageSelectorTheme, SignalIrEvents} from "../constants";

import LanguageSelector from "../components/languageSelector";
import './welcome.css';
import greenBackgroundImage from '../assets/board.svg';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import signalIrService from "../services/signalIrService";
import httpService from '../services/httpService';

const swal = withReactContent(Swal);
const { getTranslationInstance } = require("../translations/translate");

interface WelcomeProps {
  room_id?: string;
}
const WARN_MESSAGE_TYPES = {
  "ERROR": "errorText",
  "INFO": "infoText",
  "WARNING": "warnText",
  "SUCCESS": "successText",
};

const Welcome: React.FC<WelcomeProps> = ({ room_id }) => {
  const dispatch = useDispatch();

  const storageUsername = useSelector((state:InitialStore) => state.username);
  const storageAuthKey = useSelector((state:InitialStore) => state.authKey);
  const storageLanguage = useSelector((state:InitialStore) => state.language);
  const storageRoomId = useSelector((state:InitialStore) => state.roomId);

  const translation = getTranslationInstance(storageLanguage);

  const [username, setUsername] = useState(storageUsername);
  const [roomId, setRoomId] = useState(room_id ?? "");
  const [warnMessageType, setWarnMessageType] = useState(WARN_MESSAGE_TYPES.ERROR);
  const [warnMessage, setWarnMessage] = useState("");

  const isReconnectButtonActive = storageUsername != null && storageAuthKey != null && storageRoomId != null;

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

  const renderRightPanel = () => {

    if(isReconnectButtonActive)
    {
      return (
        <div className="overlay-panel overlay-right">
          <h1>{translation.get("general_title")}</h1>
          <p>
            {translation.get("welcome_title")},
            <b> {username}</b>
            <br />
            { translation.get("reconnect_room_subtitle") }
          </p>
          <button className="ghost" onClick={reconnectRoomAction}>{translation.get("reconnect_room_button")}</button>
          <button className="ghost logout_button" onClick={abaddonRoomAction}>{translation.get("abaddon_room_button_text")}</button>
        </div>
      ); 
    }
    
    return (
      <div className="overlay-panel overlay-right">
        <h1>{translation.get("general_title")}</h1>
        <p>
          {translation.get("welcome_title")},
          <b> {username}</b>
          <br />
          { translation.get("welcome_subtitle")}
        </p>
        <button className="ghost" onClick={panelSwitchToCreateRoom}>{translation.get("create_room_button_text")}</button>
        <button className="ghost logout_button" onClick={logoutAction}>{translation.get("logout_button_text")}</button>
      </div>
    );

  }

  useEffect(() => {
    if (username != storageUsername) {
      setUsername(storageUsername);
    }
  }, [storageUsername]);

  /* ===== RECONNECT ROOM ===== */
  const reconnectRoomAction = () => {
    if(storageAuthKey == null || storageRoomId == null || storageRoomId == null)
      return false;

    signalIrService.triggerEvent(SignalIrEvents.RECONNECT_ROOM, [storageAuthKey, storageRoomId]);
  }

  signalIrService.listenEvent(SignalIrEvents.RECONNECT_ROOM, (data:any) => {
    if(data.event == "room_reconnect_success" && data?.room_name != null)
    {
      signalIrService.stopListenEvent(SignalIrEvents.JOIN_ROOM);
      dispatch({ type: 'SET_ROOM_ID', payload:data.room_name});
      window.location.href = "/gameboard/" + data.room_name;
    }
    else
    {
      setWarnMessageType(WARN_MESSAGE_TYPES.ERROR);
      setWarnMessage(translation.get("error_" + data.event));
    }
  });

    /* ===== ABADDON ROOM ===== */
    const abaddonRoomAction = () => {
      if(storageAuthKey == null || storageRoomId == null || storageRoomId == null)
        return false;
  
      signalIrService.triggerEvent(SignalIrEvents.LEAVE_ROOM, [storageAuthKey, storageRoomId]);
    }
  
    signalIrService.listenEvent(SignalIrEvents.LEAVE_ROOM, (data:any) => {
      if(data.event == "leave_room_success")
      {
        signalIrService.stopListenEvent(SignalIrEvents.LEAVE_ROOM);
        dispatch({ type: 'LEAVE_ROOM'});
        window.location.reload();
      }
      else
      {
        setWarnMessageType(WARN_MESSAGE_TYPES.ERROR);
        setWarnMessage(translation.get("error_" + data.event));
      }
    });
  
  /* ===== JOIN ROOM ===== */
  const joinRoomAction = () => {
    if(storageAuthKey == null || roomId == null)
      return false;

    signalIrService.triggerEvent(SignalIrEvents.JOIN_ROOM, [storageAuthKey, roomId]);
  }

  signalIrService.listenEvent(SignalIrEvents.JOIN_ROOM, (data:any) => {
    if(data.event == "room_join_success" || data.event == "user_already_room_member")
    {
      signalIrService.stopListenEvent(SignalIrEvents.JOIN_ROOM);
      dispatch({ type: 'SET_ROOM_ID', payload:roomId});
      window.location.href = "/gameboard/" + roomId;
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
      window.location.href = "/gameboard/" + roomId;
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
            {renderRightPanel()}
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
