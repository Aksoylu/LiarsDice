import React from 'react';
import InputSpinner from './inputSpinner';
import DicePicker from './dicePicker';
import './actionPanel.css';
import 'animate.css';

import {InitialStore} from "../types/Store";
import { useSelector, useDispatch } from 'react-redux';

const {getTranslationInstance} = require("../translations/translate");

interface ActionPanelProps{
  isActionPanelVisible: boolean;
}

const in_animation = "animate__slideInUp";
const out_animation = "animate__slideOutDown";

const ActionPanel: React.FC<ActionPanelProps> = ({isActionPanelVisible}) => {
  const storageLanguage = useSelector((state:InitialStore) => state.language)
  const translation= getTranslationInstance(storageLanguage);

  const animationClass = isActionPanelVisible ? in_animation : out_animation;
  const className = "yourTurnRibbon animate__animated " + animationClass;

  const bidAmount:number = useSelector((state:InitialStore) => state.quality);
  const bidDice:number = useSelector((state:InitialStore) => state.dice);

  const declareBet = () => {
    // todo implement
    console.log({
      "bidAmount": bidAmount,
      "bidDice": bidDice,
    });
  }

  return (
    <div className="actionPanel" >
        <div className={className}>
          <div className="card actionCard">
            <div className="row card-row">
              <div className='col-4'>
                  <div className='row'>
                    <div className='col-4 offset-2'>
                      <InputSpinner/>
                    </div>

                    <div className='col-4 offset-3'>
                      <DicePicker/>
                    </div>

                  </div>
              </div>

              <div className='col-4'>
                  
                  <div className='row'>
                    <button className='actionButton' onClick={declareBet}>{translation.get("button_declare_bet")}</button>
                  </div>
                  <div className='row'>
                  <button className='actionButton'>{translation.get("button_call_bluff")}</button>
                  </div>

              </div>

              <div className='col-4'>
                  <h3>{translation.get("title_choose_your_bet")}</h3>
                  <p>{translation.get("subtitle_lastest_bet")}</p>
                  <p className="card-content">Panel content goes here.</p>
              </div>
              
            </div>
          </div>
      </div>
    </div>

  );
};

export default ActionPanel;
