import React from 'react';
import svgImage from '../assets/board.svg';
import "./gameboard.css";

import ChatBox from '../components/chatBox';
import Navbar from '../components/navBar';
import UserCard from '../components/userCard';

import {ColorPalette} from "../types/ColorPalette";
import {Bid} from "../types/Bid";

import {colorPaletteList} from "../constants";

interface GameboardProps {
  username: string;
  room_id: string;
}

const createRandomPalettes = (count:number) => {
  const paletteList: ColorPalette[] = [];

  while(paletteList.length < count)
  {
    const randomIndex = Math.floor(Math.random() * colorPaletteList.length);
    const randomPalette = colorPaletteList[randomIndex];
    if(paletteList.includes(randomPalette))
      continue;
    
      paletteList.push(randomPalette);
  }

  return paletteList;
}

const GameBoard: React.FC<GameboardProps> = ({ username, room_id}) => {


  const randomPalettes = createRandomPalettes(6);

  console.log(randomPalettes);
  const exampleBid:Bid = {
    dice: 6,
    quality: 3
  };

  return (
    <div>
      <Navbar />
        <img className='backgroundImage' src={svgImage} />
      

      <div className='info-text'>{username} are currently playing on room : {room_id}</div>
      <div className="board-container">
  
          <div className="row">
            <div className='col-4'><UserCard username='veli' colorPalette={randomPalettes[0]} isTurn={true} bid={exampleBid}/></div>
            <div className='col-4'><UserCard username='mehmet' colorPalette={randomPalettes[1]} isTurn={false} bid={exampleBid}/></div>
            <div className='col-4'><UserCard username='murat' colorPalette={randomPalettes[2]} isTurn={false} bid={exampleBid}/></div>
          </div>
          <br/>
          <div className="row">
          <div className='col-4'><UserCard username='beyza' colorPalette={randomPalettes[3]} isTurn={false} bid={exampleBid}/></div>
          <div className='col-4'><UserCard username='elif' colorPalette={randomPalettes[4]} isTurn={false} bid={exampleBid}/></div>
          <div className='col-4'><UserCard username='gamze' colorPalette={randomPalettes[5]} isTurn={false} bid={exampleBid}/></div>
          </div>
          <br/>
      </div>
      <ChatBox />
    </div>
  );
};

export default GameBoard;
