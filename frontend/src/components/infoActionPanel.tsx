import React from 'react';
import './infoActionPanel.css';
import 'animate.css';

import {InitialStore} from "../types/Store";
import { useSelector } from 'react-redux';


const {InfoActionPanelStates} = require("../constants");
const {getTranslationInstance} = require("../translations/translate");

interface InfoActionPanelProps{
  state: number;
}

const headerEmojis = {
  [InfoActionPanelStates.waitingForGameStart]: "👾",
  [InfoActionPanelStates.userEliminated]:  "🤯",
}

const headerClass = {
  [InfoActionPanelStates.waitingForGameStart]: "waitingForGameStartHeader",
  [InfoActionPanelStates.userEliminated]:  "userEliminatedHeader",
}

const headerTitle = {
  [InfoActionPanelStates.waitingForGameStart]: "info_panel_waiting_for_game_start",
  [InfoActionPanelStates.userEliminated]: "info_panel_eliminated",
}

const headerSubtitle = {
  [InfoActionPanelStates.waitingForGameStart]: "info_panel_subtitle_waiting_for_game_start",
  [InfoActionPanelStates.userEliminated]: "info_panel_subtitle_eliminated",
}

const ribbonClasses = {
  [InfoActionPanelStates.waitingForGameStart]: "waitingRibbon",
  [InfoActionPanelStates.userEliminated]: "eliminatedRibbon",
}

const InfoActionPanel: React.FC<InfoActionPanelProps> = ({state}) => {
  const storageLanguage = useSelector((state:InitialStore) => state.language)
  const translation= getTranslationInstance(storageLanguage);

  const className = ribbonClasses[state] + " animate__animated animate__slideInUp";
  
  return (
    <div className="actionPanel" >
        <div className={className}>
          <div className="card actionCard">
            <div className="row card-row">
              <div className='col-12'>
                  
                  <h1 className={headerClass[state]}>
                    {headerEmojis[state]}
                    &nbsp;
                    {translation.get(headerTitle[state])}
                  </h1>
                  <h4 className="card-content">{translation.get(headerSubtitle[state])}</h4>
              </div>
            </div>
          </div>
      </div>
    </div>

  );
};

export default InfoActionPanel;
