import React from 'react';
import './userCard.css';

import {ColorPalette} from "../types/ColorPalette";
import {Bid} from "../types/Bid";

interface UserCardProps{
  username: string;
  colorPalette: ColorPalette;
  isTurn: boolean;
  bid: Bid;
  isEliminated: boolean;
}

const UserCard: React.FC<UserCardProps> = ({username, colorPalette, isTurn, bid, isEliminated}) => {

  const firstLetter = username[0].toUpperCase();

  const profileStyle = {
    color: colorPalette.foregroundColor,
    backgroundColor: colorPalette.backgroundColor
  }

  const usernameStyle = {
    color: colorPalette.backgroundColor,
    textDecoration: isEliminated ? "line-through": "none",
  }

  return (
    <div>
       <div className={`${isTurn ? 'turnRibbon' : ''} ${isEliminated ? 'eliminatedRibbon' : ''} card`}>


       <div className="row card-row">
            <div className='col-4'>
              <div className="profile-circle" style={profileStyle}>
                <span className="letter">{firstLetter}</span>
              </div>
            </div>
            <div className='col'>
              <div className="card-username" style={usernameStyle}>{username} </div>
            </div>
          </div>

            <h2 className="card-title">Card Title</h2>
            <p className="card-content">Card content goes here.</p>
        </div>
    </div>    
  );
};

export default UserCard;
