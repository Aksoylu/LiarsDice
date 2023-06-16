import React, {useState, useEffect} from 'react';
import InputSpinner from './inputSpinner'
import './actionPanel.css';
import 'animate.css';

const {getTranslationInstance} = require("../translations/translate");

interface ActionPanelProps{
  username: string;
  isUserEliminated: boolean;
  isActionPanelVisible: boolean;
  userLang: string;
}

const in_animation = "animate__slideInUp";
const out_animation = "animate__slideOutDown";

const ActionPanel: React.FC<ActionPanelProps> = ({username, isUserEliminated, isActionPanelVisible, userLang}) => {
  const translation = getTranslationInstance(userLang);

  const animationClass = isActionPanelVisible ? in_animation : out_animation;
  const className = "animate__animated " + animationClass;


  return (
    <div className="actionPanel " >
        <div className={className + " yourTurnRibbon"}>
          <div className="card actionCard">
            <div className="row card-row">
              <div className='col-4'>
                  <div className='row'>
                    <div className='col-4 '>
                      <h4 className='alignCenter'>{translation.get("title_bet_amount")}</h4>
                      <InputSpinner minimumValue={2}/>
                    </div>

                    <div className='col-4 '></div>

                    <div className='col-4 '>
                    <h4 className='alignCenter'>{translation.get("title_bet_dice")}</h4>
                      <InputSpinner minimumValue={2}/>
                    </div>

                  </div>
              </div>

              <div className='col-4'>
                  
                  <div className='row'>
                    <button className='actionButton'>{translation.get("button_declare_bet")}</button>
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
