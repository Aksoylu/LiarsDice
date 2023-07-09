import React from 'react';
import './userCard.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChainBroken } from '@fortawesome/free-solid-svg-icons';

import { ColorPalette } from "../types/ColorPalette";
import { Bid } from "../types/Bid";

import Dice1 from '../assets/dice_1.svg';
import Dice2 from '../assets/dice_2.svg';
import Dice3 from '../assets/dice_3.svg';
import Dice4 from '../assets/dice_4.svg';
import Dice5 from '../assets/dice_5.svg';
import Dice6 from '../assets/dice_6.svg';

import {InitialStore} from "../types/Store";
import { useSelector, useDispatch } from 'react-redux';

const { getTranslationInstance } = require("../translations/translate");
const diceSkins = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

interface UserCardProps {
  username: string;
  colorPalette: ColorPalette;
  isTurn: boolean;
  isEliminated: boolean;
  isDisconnected: boolean;
  currentBid: Bid;
}

const UserCard: React.FC<UserCardProps> = ({ username, colorPalette, isTurn, isEliminated, isDisconnected, currentBid }) => {
  const storageLanguage = useSelector((state:InitialStore) => state.language)
  const translation= getTranslationInstance(storageLanguage);

  const firstLetter = username[0].toUpperCase();

  const profileStyle = {
    color: isDisconnected ? "#000000" : colorPalette.foregroundColor,
    backgroundColor:isDisconnected ? "#bfbbbb" : colorPalette.backgroundColor
  }

  const usernameStyle = {
    color: isDisconnected ? "#8f8c8c" : colorPalette.backgroundColor,
    textDecoration: isEliminated ? "line-through" : "none",
  }

  const disconnectedBottomBar = () => {
    return (
      <div>
        <FontAwesomeIcon icon={faChainBroken} />
        <span>&nbsp;Disconnected</span>
      </div>
    );
  }

  const renderUserBid = (bidData: Bid) => {
    return (
      <div>
        <div className="userCardBid row">
          <div className='col-4 offset-3 alignItems'>
            <h4>{translation.get("title_bet_amount")}</h4>
            <h1 className='bidQuality'>{bidData.quality}</h1>
          </div>

          <div className='col-4 offset-3 alignItems'>
            <h4>{translation.get("title_bet_dice")}</h4>
            <span>
              <img className='diceImage' src={diceSkins[bidData.dice - 1]} />
            </span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className={`${isTurn ? 'turnRibbon' : ''} ${isEliminated ? 'eliminatedRibbon' : ''} card`}>
        <div className="row card-row">
          <div className="col-4">
            <div className="profile-circle" style={profileStyle}>
              <span className="letter">{firstLetter}</span>
            </div>
          </div>
          <div className='col'>
            <div className="card-username" style={usernameStyle}>{username} </div>
          </div>
        </div>

        {currentBid != null && renderUserBid(currentBid)}

        {isDisconnected && disconnectedBottomBar()}
      </div>
    </div>
  );
};

export default UserCard;
