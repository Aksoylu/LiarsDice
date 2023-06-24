import React, {useState} from 'react';
import './inputSpinner.css';

import { useSelector, useDispatch } from 'react-redux';
import {InitialStore} from "../types/Store";

const InputSpinner: React.FC = () => {
  const bidAmount:number = useSelector((state:InitialStore) => state.quality);

  const dispatch = useDispatch();

  const decraseBidAmount = () => {
    dispatch({ type: 'SET_BID_AMOUNT', payload: bidAmount - 1});
  };

  const increaseBidAmount = () => {
    dispatch({ type: 'SET_BID_AMOUNT', payload: bidAmount + 1});
  };

  return (
    <div className="inputSpinner">
        <div className="num-block skin-1">
            <div className="num-in">
                <span className="minus dis" onClick={decraseBidAmount}></span>
                <input type="text" className="in-num" value={bidAmount} onChange={()=>{}}/> 
                <span className="plus" onClick={increaseBidAmount}></span>
            </div>
        </div>
    </div>
  );
};

export default InputSpinner;
