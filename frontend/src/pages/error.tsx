import React from 'react';
import "./error.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faWarning, faXmark} from '@fortawesome/free-solid-svg-icons';

const {ErrorPageTypes} = require("../constants");
const {getTranslationInstance} = require("../translations/translate");

interface ErrorProps {
    errorType: number;
}

const errorMessages = {
    [ErrorPageTypes.screenSizeNotCompatible]: "error_message_screen_size_not_compatible",
    [ErrorPageTypes.roomIdIsNotValid]: "error_message_room_id_is_not_valid"
}

const errorIcons = {
    [ErrorPageTypes.screenSizeNotCompatible] : faWarning,
    [ErrorPageTypes.roomIdIsNotValid] : faXmark
}

const Error: React.FC<ErrorProps> = ({errorType}) => {
    const user_lang = localStorage.getItem('user_lang') ?? "en";
    const translation = getTranslationInstance(user_lang);

    const errorMessage = translation.get(errorMessages[errorType]);
    const errorIcon = errorIcons[errorType];

  return (
    <div className='errorBody'>
        <div className='errorContainer'>
            <h1>
                <FontAwesomeIcon icon={errorIcon} size="4x" className='errorLogo'/> 
                <br/>
                {errorMessage}
            </h1>
        </div>
      
    </div>
  );
};

const getErrorIcon = () => {

}

export default Error;
