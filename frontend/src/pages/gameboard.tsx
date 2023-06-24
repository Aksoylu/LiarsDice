import React, {useEffect, useState} from 'react';
import svgImage from '../assets/board.svg';


import ChatBox from '../components/chatBox';
import Navbar from '../components/navBar';
import UserCard from '../components/userCard';
import Signal from '../components/signal';
import ActionPanel from '../components/actionPanel';
import InfoActionPanel from '../components/infoActionPanel';

import {ColorPalette} from "../types/ColorPalette";
import {Bid} from "../types/Bid";

import "./gameboard.css";
import {colorPaletteList, GameSignals, InfoActionPanelStates} from "../constants";

import { useSelector, useDispatch } from 'react-redux';
import globalContext from '../global';

interface GameboardProps {
  room_id?: string;
}

interface EachUserData {
  username: string;
  turnNumber: number;
  colorPalette: ColorPalette;
  bid: Bid;
  isTurn: boolean;
  isEliminated: boolean;
}

const emptyBid:Bid = {
  dice: 1,
  quality: 1
}

/* TODO REMOVE COMMAND SET LATER */
const createDummyUsers = (count:number) => {
  const userArray = [];

  for(let i = 0; i < count; i++)
  {
    const randomIndex = Math.floor(Math.random() * colorPaletteList.length);
    const colorPalette:ColorPalette = colorPaletteList[randomIndex];
    const bid:Bid = {
      dice: Math.floor(Math.random() * 6),
      quality: Math.floor(Math.random() * 10)
    };

    const newUser:EachUserData = {
      username: "random_user_" + i.toString(),
      turnNumber: i,
      colorPalette:colorPalette,
      bid: bid,
      isTurn: false,
      isEliminated: false,
    }
    userArray.push(newUser);
  }
  return userArray;
};

const renderUser = (userData:EachUserData) => {
  return (<UserCard 
            username={userData.username} 
            colorPalette={userData.colorPalette} 
            isTurn={userData.isTurn} 
            bid={userData.bid} 
            isEliminated={userData.isEliminated}/>
  );
}

const pushSignal = (username:string) => {
  
  const type = null;

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
}

const renderActionPanel = (username:string, isGameStarted:boolean, isUserEliminated:boolean, isActionPanelVisible:boolean) => {
  if(isGameStarted)
  {
    if(isUserEliminated)
    {
      return (<InfoActionPanel state={InfoActionPanelStates.userEliminated}/>);
    }
    else
    {
      return (<ActionPanel isActionPanelVisible={isActionPanelVisible}/>);
    }
  }
  else
  {
    return (<InfoActionPanel state={InfoActionPanelStates.waitingForGameStart}/>);
  }
}

const GameBoard: React.FC<GameboardProps> = ({ room_id }) => {

  const username = globalContext.getUsername();
  const [isTurn, setIsTurn] = useState(false);
  const [isUserEliminated, setIsUserEliminated] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isSelfAdmin, setIsSelfAdmin] = useState(false);
  
  // todo: set room id to global context if room id is valid

  const [userDatalist, setUserDatalist] = useState(createDummyUsers(3));

  /* TODO REMOVE COMMAND SET LATER */
  (window as any).command = function(command:string){
    const parsedCommand = command.split(":");
    const func = parsedCommand[0];
    const param = parsedCommand[1];
    
    switch (func)
    {
      case "set_is_turn":
          setIsTurn(param.toLowerCase() === "true");
        break;
      
      case "set_is_eleminated":
        setIsUserEliminated(param.toLowerCase() === "true");
        break;

      case "set_game_started":
          setIsGameStarted(param.toLowerCase() === "true");
          setIsTurn(false);
        break;

      case "set_user_data":
        const newDataList = [...userDatalist]
        newDataList[0].username = param;
        setUserDatalist(newDataList);
        break;
      
      case "set_admin":
        setIsSelfAdmin(param.toLowerCase() === "true");
      break;
    }
  }

  /* TODO CREATE WEBSOCKET INSTANCE HERE */

  // todo implement redux logic
  // todo create websocket connected usercard-bid hook logic
  // todo add connection state icon to users due to socket data
  // todo create dice input to action panel
  // todo fix action panel design
  // todo implement bid to user card design
  // todo fix users card design

  return (
    <div>
      <Navbar isGameStarted={isGameStarted} isAdmin={isSelfAdmin}/>
        <img className='backgroundImage' src={svgImage} />
      
      <div className='signalContainer'>
        {pushSignal(username)}
      </div>
      <div className="board-container">
          <div className="row">
            <div className='col-4'>
              {userDatalist.length > 0 && renderUser(userDatalist[0])}
            </div>
            <div className='col-4'>
              {userDatalist.length > 1 && renderUser(userDatalist[1])}
            </div>
            <div className='col-4'>
              {userDatalist.length > 2 && renderUser(userDatalist[2])}
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-4' id="turn_4">
              {userDatalist.length > 3 && renderUser(userDatalist[3])}
            </div>
            <div className='col-4' id="turn_5">
              {userDatalist.length > 4 && renderUser(userDatalist[4])}
            </div>
            <div className='col-4' id="turn_6">
              {userDatalist.length > 5 && renderUser(userDatalist[5])}
            </div>
            </div>
            <br/>
            <div className="row">
              <div className='col-12'>
                {renderActionPanel(username, isGameStarted, isUserEliminated, isTurn)}
              </div>
            </div>
      </div>
      <div className="row">
        <div className='col-12'>
          <ChatBox/>
        </div>
      </div>
      
    </div>
  );
};

export default GameBoard;
