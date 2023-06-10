import React from 'react';
import './welcome.css';
const {getTranslationInstance} = require("../translations/translate");

interface WelcomeProps {
  room_id?: string;
}

const panelSwitchToCreateRoom = () => {
  const container = document.getElementById('container');
  if(container)
    container.classList.add("right-panel-active");
}

const panelSwitchToJoinRoom = () => {
  console.log("panelSwitchToJoinRoom");
  const container = document.getElementById('container');
  if(container)
    container.classList.remove("right-panel-active");
}

const createRoomAction = () => {
  console.log("todo implement: createRoomAction");
}

const joinRoomAction = () => {
  console.log("todo implement: joinRoomAction");
}

const Welcome: React.FC<WelcomeProps> = ({room_id }) => {

  const user_lang = localStorage.getItem('user_lang') ?? "en";
  const username = localStorage.getItem('username') ?? "";

  const translation = getTranslationInstance(user_lang);
  console.log("translation >", translation);

  if(room_id != null && room_id.toString().length > 0)
  {
    
  }

  return (
    <div>
        <div className="container" id="container">
      <div className="form-container secondary-container">
        <form action="#">
          <h1>{translation.get("create_room_title")}</h1>
          <span>{translation.get("create_room_subtitle")}</span>
          <input type="text" placeholder={translation.get("username_text_place_holder")} defaultValue={username}/>
          <input type="text" placeholder={translation.get("room_id_text_place_holder")}/>
          <button onClick={createRoomAction}>{translation.get("create_room_button")}</button>
        </form> 
      </div>
      <div className="form-container primary-container">
        <form action="#">
          <h1>{translation.get("join_room_header")}</h1>
          <span>{translation.get("join_room_subtitle")}</span>
          <input type="text" placeholder={translation.get("username_text_place_holder")} defaultValue={username}/>
          <input type="text" placeholder={translation.get("room_id_text_place_holder")} defaultValue={room_id}/>
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
