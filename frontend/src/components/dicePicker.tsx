import React, {useState} from 'react';
import './dicePicker.css';

import { useSelector, useDispatch } from 'react-redux';

import Dice1 from '../assets/dice_1.svg';
import Dice2 from '../assets/dice_2.svg';
import Dice3 from '../assets/dice_3.svg';
import Dice4 from '../assets/dice_4.svg';
import Dice5 from '../assets/dice_5.svg';
import Dice6 from '../assets/dice_6.svg';

import {InitialStore} from "../types/Store";

const {getTranslationInstance} = require("../translations/translate");

const diceSkins = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const DicePicker: React.FC = () => {
  const storageLanguage = useSelector((state:InitialStore) => state.language)
  const translation= getTranslationInstance(storageLanguage);

  const bidDice:number = useSelector((state:InitialStore) => state.dice);

  const dispatch = useDispatch();

  const decraseDice = () => {
    dispatch({ type: 'SET_DICE', payload: bidDice - 1});
  };

  const increaseDice = () => {
    dispatch({ type: 'SET_DICE', payload: bidDice + 1});
  };
  

  return (
    <div className="inputSpinner">
        <div className="num-block skin-1">
            <div className="num-in">
                <h4 className='alignCenter'>{translation.get("title_bet_dice")}</h4>
                <span className="minus dis" onClick={decraseDice}></span>
                <span>
                  <img className='diceImage' src={diceSkins[bidDice - 1]} />
                </span>
                <span className="plus" onClick={increaseDice}></span>
            </div>
        </div>
    </div>
  );
};

export default DicePicker;
