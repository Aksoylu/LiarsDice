import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import "./navBar.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleInfo, faDice, faLanguage, faGamepad } from '@fortawesome/free-solid-svg-icons';
import LanguageSelector from "./languageSelector";
import {LanguageSelectorTheme, SignalIrEvents} from "../constants";
import signalIrService from "../services/signalIrService";
import {InitialStore} from "../types/Store";

const swal = withReactContent(Swal);
const {getTranslationInstance} = require("../translations/translate");


const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const storageLanguage = useSelector((state:InitialStore) => state.language);
  const storageUsername = useSelector((state:InitialStore) => state.username);
  const storageAuthKey = useSelector((state:InitialStore) => state.authKey);
  const storageRoomId = useSelector((state:InitialStore) => state.roomId);
  const storageIsAdmin = useSelector((state:InitialStore) => state.isSelfAdmin);
  const storageIsGameStarted = useSelector((state:InitialStore) => state.isGameStarted);

  const showStartGameButton = storageIsAdmin && !storageIsGameStarted;
  const showLeaveRoomButton = !storageIsAdmin;

  const translation = getTranslationInstance(storageLanguage);

  const pushHowToPlayModal = async () => {
    const buttonColor = "#1aa33c";
    const modalWidth = "70%";
    const customClass = {
      actions: 'modal-right-buttons',
    };

    await swal.fire({
      customClass: customClass,
      title: translation.get("modal_how_to_play_title_1"),
      html: translation.get("modal_how_to_play_html_content_1"),
      confirmButtonText: translation.get("button_next"),
      confirmButtonColor: buttonColor,
      width: modalWidth,
    });

    await swal.fire({
      customClass: customClass,
      title: translation.get("modal_how_to_play_title_2"),
      html: translation.get("modal_how_to_play_html_content_2"),
      confirmButtonText: translation.get("button_next"),
      confirmButtonColor: buttonColor,
      width: modalWidth,
    });

    await swal.fire({
      customClass: customClass,
      title: translation.get("modal_how_to_play_title_3"),
      html: translation.get("modal_how_to_play_html_content_3"),
      confirmButtonText: translation.get("button_next"),
      confirmButtonColor: buttonColor,
      width: modalWidth,
    });

    await swal.fire({
      customClass: customClass,
      title: translation.get("modal_how_to_play_title_4"),
      html: translation.get("modal_how_to_play_html_content_4"),
      confirmButtonText: translation.get("button_ok"),
      confirmButtonColor: buttonColor,
      width: modalWidth,
    });
  }

  const pushLeaveRoomModal = async () => {
    const leaveButtonColor = "#ed3f18";
    const stayButtonColor = "#1aa33c";

    const modalWidth = "30%";
    const customClass = {
      actions: 'modal-right-buttons',
    };

    let modalMessage = translation.get("modal_leave_room_subtitle");
    if (storageIsAdmin)
    {
      modalMessage = translation.get("modal_leave_room_for_admin_subtitle");
    }

    const modalResult = await swal.fire({
      customClass: customClass,
      title: translation.get("modal_leave_room_title"),
      html: modalMessage,
      confirmButtonText: translation.get("modal_leave_room_accept_button"),
      confirmButtonColor: leaveButtonColor,
      showCancelButton:true,
      cancelButtonText: translation.get("modal_leave_room_decline_button"),
      cancelButtonColor:stayButtonColor,
      width: modalWidth,
    });

    if(modalResult.isConfirmed)
    {
      leaveRoomOperations();
    }
  }

  const leaveRoomOperations = async () => {
    signalIrService.triggerEvent(SignalIrEvents.LEAVE_ROOM, [storageAuthKey, storageRoomId]);
  }

  const startGameSignal = async () => {

    //signalIrService.sendStartGameSignal();
  };

  signalIrService.listenEvent(SignalIrEvents.LEAVE_ROOM, (data:any) => {
    if(data.event == "leave_room_success")
    {
      signalIrService.stopListenEvent(SignalIrEvents.LEAVE_ROOM);
      dispatch({ type: 'LEAVE_ROOM'});
      window.location.href = "/";
    }
  });

  return (
    <div>
        <nav className="navbar">
          <div className='navbar-left'>
            <div className="navbar-logo"><FontAwesomeIcon icon={faDice} /> Liar's Dice</div>
              <div className={`navbar-menu`}>
                {showStartGameButton && 
                  <li className="navbar-menu-item" onClick={startGameSignal}><FontAwesomeIcon icon={faGamepad} /> {translation.get("start_game_nav")}</li>
                }

                <li className="navbar-menu-item" onClick={pushHowToPlayModal}><FontAwesomeIcon icon={faCircleInfo} /> {translation.get("how_to_play_nav")}</li>

                {showLeaveRoomButton && 
                  <li className="navbar-menu-item" onClick={pushLeaveRoomModal}><FontAwesomeIcon icon={faRightFromBracket} /> {translation.get("exit_room_nav")}</li>
                }
            </div>
          </div>
          <LanguageSelector languageSelectorTheme={LanguageSelectorTheme.DARK}/>
        </nav>
    </div>
  );
};

export default Navbar;
