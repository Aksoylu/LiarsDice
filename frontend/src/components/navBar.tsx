import React from 'react';
import "./navBar.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleInfo, faDice, faLanguage, faGamepad } from '@fortawesome/free-solid-svg-icons';
import LanguageSelector from "./languageSelector";
import {LanguageSelectorTheme} from "../constants";
import signalIrService from "../services/signalIrService";

const swal = withReactContent(Swal);
const {getTranslationInstance} = require("../translations/translate");

interface NavbarProps {
  isAdmin: boolean;
  isGameStarted: boolean;
};

const Navbar: React.FC<NavbarProps> = ({isAdmin, isGameStarted}) => {
  const storageLang = localStorage.getItem("user_lang") ?? "en";
  
  const showStartGameButton = isAdmin && !isGameStarted;
  const translation = getTranslationInstance(storageLang);

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

  /** 
   * @todo implement
   * @description: show modal first, if applies, broke websocket connection, clear local room storage and navigate to main screen
   */
  const pushLeaveRoomModal = async () => {
    
  }

  const startGameSignal = async () => {
    //signalIrService.sendStartGameSignal();
  };
  
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

                {!isAdmin && 
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
