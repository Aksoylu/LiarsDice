import React from 'react';

import svgImage from '../assets/board.svg';
import "./gameboard.css";

import ChatBox from '../components/chatBox';
import Navbar from '../components/navBar';
import UserCard from '../components/userCard';
import Signal from '../components/signal';

import {ColorPalette} from "../types/ColorPalette";
import {Bid} from "../types/Bid";

import {colorPaletteList, GameSignals} from "../constants";

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

const pushSignal = (username:string) => {
  
  const type = GameSignals.game_started;

  if(type == GameSignals.game_started)
  {
    const signalMessage = "Match Started !";
    return <Signal type={GameSignals.game_started} text={signalMessage}/>;
  }
  else if(type == GameSignals.your_turn)
  {
    const signalMessage = "Its your turn, " + username + " !";
    return <Signal type={GameSignals.your_turn} text={signalMessage}/>;
  }  

  else if(type == GameSignals.bluffed)
  {
    const signalMessage = "Userx, called " + username + " as Bluff !";
    return <Signal type={GameSignals.bluffed} text={signalMessage}/>;
  }

  else if(type == GameSignals.busted)
  {
    const signalMessage = username + " has busted !";
    return <Signal type={GameSignals.busted} text={signalMessage}/>;
  }

  else if(type == GameSignals.player_eliminated)
  {
    const signalMessage = "Player " + username + ", eliminated !";
    return <Signal type={GameSignals.player_eliminated} text={signalMessage}/>;
  }

  else if(type == GameSignals.player_win)
  {
    const signalMessage = "Player " + username + ", win !";
    return <Signal type={GameSignals.player_win} text={signalMessage}/>;
  }

  else if(type == GameSignals.you_lose)
  {
    const signalMessage = "You Lose !";
    return <Signal type={GameSignals.you_lose} text={signalMessage}/>;
  }
      // return <Signal type={GameSignals.your_turn} text={signalMessage}/>;


}

const GameBoard: React.FC<GameboardProps> = ({ username, room_id}) => {

  const randomPalettes = createRandomPalettes(6);

  const exampleBid:Bid = {
    dice: 6,
    quality: 3
  };

  return (
    <div>
      <Navbar />
        <img className='backgroundImage' src={svgImage} />
      
      <div className='signalContainer'>
        {pushSignal(username)}
      </div>
    
      <div className="board-container">
  
          <div className="row">
            <div className='col-4'>
              <UserCard username='veli' colorPalette={randomPalettes[0]} isTurn={true} bid={exampleBid} isEliminated={false}/></div>
            <div className='col-4'>
              <UserCard username='mehmet' colorPalette={randomPalettes[1]} isTurn={false} bid={exampleBid} isEliminated={false}/></div>
            <div className='col-4'>
              <UserCard username='murat' colorPalette={randomPalettes[2]} isTurn={false} bid={exampleBid} isEliminated={false}/></div>
          </div>
          <br/>
          <div className="row">
          <div className='col-4'>
            <UserCard username='beyza' colorPalette={randomPalettes[3]} isTurn={false} bid={exampleBid} isEliminated={false}/></div>
          <div className='col-4'>
            <UserCard username='elif' colorPalette={randomPalettes[4]} isTurn={false} bid={exampleBid} isEliminated={false}/></div>
          <div className='col-4'>
            <UserCard username='gamze' colorPalette={randomPalettes[5]} isTurn={false} bid={exampleBid} isEliminated={true}/></div>
          </div>
          <br/>
      </div>
      <ChatBox />
    </div>
  );
};

export default GameBoard;
