import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClover, faWarning, faDice, faSkullCrossbones, faThumbsDown, faHandPeace} from '@fortawesome/free-solid-svg-icons';

import './signal.css';
import 'animate.css';

import {GameSignals} from "../constants";
import {SignalAttributes} from "../types/SignalAttributes";


interface SignalProps {
    type:number;
    text:string;
}

const signalAttributes = {
    [GameSignals.game_started]: {
        "in_animation": "animate__bounceIn",
        "out_animation": "animate__bounceOut",
        "duration": 3000,
        "baseColor": "#ffffff",
        "backgroundColor": "#177fcf",
        "icon": faClover
    },

    [GameSignals.your_turn]: {
        "in_animation": "animate__lightSpeedInLeft",
        "out_animation": "animate__lightSpeedOutRight",
        "duration": 3000,
        "baseColor": "#ffffff",
        "backgroundColor": "#d1eb2d",
        "icon": faDice
    },
    [GameSignals.bluffed]: {
        "in_animation": "animate__zoomIn",
        "out_animation": "animate__zoomOut",
        "duration": 3000,
        "baseColor": "#ffffff",
        "backgroundColor": "#f57d05",
        "icon": faWarning
    },
    [GameSignals.busted]: {
        "in_animation": "animate__rotateIn",
        "out_animation": "animate__rotateOut",
        "duration": 3000,
        "baseColor": "#ffffff",
        "backgroundColor": "#000000",
        "icon": faThumbsDown
    },
    [GameSignals.player_eliminated]: {
        "in_animation": "animate__zoomIn",
        "out_animation": "animate__zoomOut",
        "duration": 4000,
        "baseColor": "#ffffff",
        "backgroundColor": "#cc0030",
        "icon": faSkullCrossbones
    },
    [GameSignals.player_win]: {
        "in_animation": "animate__tada",
        "out_animation": "animate__zoomOut",
        "duration": 0,
        "baseColor": "#ffffff",
        "backgroundColor": "#31f5e1",
        "icon": faHandPeace
    },
    [GameSignals.you_lose]: {
        "in_animation": "animate__zoomIn",
        "out_animation": "animate__zoomOut",
        "duration": 0,
        "baseColor": "#ffffff",
        "backgroundColor": "#cc0030",
        "icon": faSkullCrossbones
    },

}

const defaultStyle = {
    padding: "16px 16px 16px 16px",
    borderRadius : "32px",
}

const signalHook = (attribute:SignalAttributes, text:string, status:boolean) => {
    const signalStyle = {
        ...defaultStyle,
        color: attribute.baseColor,
        backgroundColor: attribute.backgroundColor,
        boxShadow: "0 0 20px " + attribute.backgroundColor,
    };

    const animationClass = status ? attribute.in_animation : attribute.out_animation;
    const className = "signalBox animate__animated " + animationClass;

    return(
        <div className={className} style={signalStyle}>
            <FontAwesomeIcon icon={attribute.icon} />
            {" " + text}
        </div>
    );
}

const Signal: React.FC<SignalProps> = ({type, text}) => {
    const attributes = signalAttributes[type];

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if(attributes.duration > 0)
        {
            setTimeout(()=> {setIsVisible(false)}, attributes.duration );
        }
    }, [isVisible]);

    return (
        <div>
            {isVisible && signalHook(attributes, text, true)}
            {!isVisible && signalHook(attributes, text, false)}
        </div>
    );
};

export default Signal;
