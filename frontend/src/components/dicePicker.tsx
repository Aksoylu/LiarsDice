import React, {useState} from 'react';
import './inputSpinner.css';

import { useSelector, useDispatch } from 'react-redux';

import {Bid} from "../types/Bid";
import {InitialStore} from "../types/Store";

const DicePicker: React.FC = () => {
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
                <span className="minus dis" onClick={decraseDice}></span>
                <input type="text" className="in-num" value={bidDice} onChange={()=>{}}/> 
                <span className="plus" onClick={increaseDice}></span>
            </div>
        </div>
    </div>
  );
};

export default DicePicker;
