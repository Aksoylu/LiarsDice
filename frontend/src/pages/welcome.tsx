import React, { useEffect, useState } from 'react';
import { LanguageSelectorTheme } from "../constants";
import LanguageSelector from "../components/languageSelector";
import './welcome.css';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import httpService from '../services/httpService';
import globalContext from '../global';

const swal = withReactContent(Swal);
const { getTranslationInstance } = require("../translations/translate");
interface WelcomeProps {
  room_id?: string;
  show_reconnect_modal?: boolean;
}

const panelSwitchToCreateRoom = () => {
  const container = document.getElementById('container');
  if (container)
    container.classList.add("right-panel-active");
}

const panelSwitchToJoinRoom = () => {
  console.log("panelSwitchToJoinRoom");
  const container = document.getElementById('container');
  if (container)
    container.classList.remove("right-panel-active");
}

const authUser = (username: string) => {
  // todo send request to backend and get auth key & color palette id
  const authKey = "...";
  localStorage.setItem("username", username);
  localStorage.setItem("authKey", authKey);

}

const createRoomAction = () => {
  const usernameElement = document.getElementById("username");
  const roomIdElement = document.getElementById("roomId");

  const username = usernameElement ? usernameElement.getAttribute("value") : null;
  const roomId = roomIdElement ? roomIdElement.getAttribute("value") : null;

  console.log("todo implement: createRoomAction", username, roomId);
}

const joinRoomAction = () => {
  const usernameElement = document.getElementById("username");
  const roomIdElement = document.getElementById("roomId");

  const username = usernameElement ? usernameElement.getAttribute("value") : null;
  const roomId = roomIdElement ? roomIdElement.getAttribute("value") : null;

  console.log("todo implement: joinRoomAction", username, roomId);
}


const getLocaleRoomId = async ()=> {

  const lang = globalContext.getLang();
  const translation = getTranslationInstance(lang);


  const localeRoomId = globalContext.getLocaleRoomId();
  if(!localeRoomId)
    return;

  const roomDetails = await httpService.getRoomDetails(localeRoomId);

  swal.fire({
    title: translation.get("modal_reconnect_title"),
    html: <div>
      <p>{translation.get("modal_reconnect_subtitle")} <br/>{roomDetails}</p>
      <b>{translation.get("modal_reconnect_subtitle_2")}</b>
    </div>,
  
    showCancelButton: true,
    confirmButtonText: translation.get("modal_reconnect_accept_button"),
    cancelButtonText:  translation.get("modal_reconnect_decline_button"),
  }).then((swalModalResult)=>{
    if(swalModalResult.dismiss === Swal.DismissReason.cancel)
    {
      globalContext.clearLocaleRoomId();
    }
    else if(swalModalResult.isConfirmed)
    {
      window.location.href = "/gameboard/" + localeRoomId;
    }
  })
}

const Welcome: React.FC<WelcomeProps> = ({ room_id, show_reconnect_modal }) => {
  
  const lang = globalContext.getLang();
  const storageUsername =  globalContext.getUsername();

  const translation = getTranslationInstance(lang);

  const [username, setUsername] = useState(storageUsername);
  const [roomId, setRoomId] = useState(room_id);

  if(show_reconnect_modal)
  {
    getLocaleRoomId();
  }

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container secondary-container">
          <form action="#">
            <h1>{translation.get("create_room_title")}</h1>
            <span>{translation.get("create_room_subtitle")}</span>
            <input type="text"
              placeholder={translation.get("username_text_place_holder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username" />
            <input type="text"
              placeholder={translation.get("room_id_text_place_holder")}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              id="roomId" />
            <button onClick={createRoomAction}>{translation.get("create_room_button")}</button>
          </form>
        </div>
        <div className="form-container primary-container">
          <form action="#">
            <h1>{translation.get("join_room_header")}</h1>
            <span>{translation.get("join_room_subtitle")}</span>
            <input type="text"
              placeholder={translation.get("username_text_place_holder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username" />
            <input type="text"
              placeholder={translation.get("room_id_text_place_holder")}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              id="roomId" />
            <button onClick={joinRoomAction}>{translation.get("join_room_button")}</button>
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
              <h2>{translation.get("welcome_title")}</h2>
              <p>{translation.get("welcome_subtitle")}</p>
              <button className="ghost" onClick={panelSwitchToCreateRoom}>{translation.get("create_room_button_text")}</button>
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
