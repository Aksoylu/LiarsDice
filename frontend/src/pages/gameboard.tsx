import React from 'react';
import svgImage from '../assets/board.svg';
import "./gameboard.css";

import ChatBox from '../components/chatBox';
import Navbar from '../components/navBar';
import UserCard from '../components/userCard';

interface GameboardProps {
  username: string;
  room_id: string;
}

const GameBoard: React.FC<GameboardProps> = ({ username, room_id}) => {
  return (
    <div>
      <Navbar />
        <img className='backgroundImage' src={svgImage} />
      {username} are currently playing on room : {room_id}

      <div className="container">
        <div className="row">
          <div className="column"><UserCard/></div>
          <div className="column"><UserCard/></div>
          <div className="column"><UserCard/></div>
        </div>
        <div className="row">
          <div className="column"><UserCard/></div>
          <div className="column"><UserCard/></div>
          <div className="column"><UserCard/></div>
        </div>
      </div>




      <ChatBox />
    </div>
  );
};

export default GameBoard;
