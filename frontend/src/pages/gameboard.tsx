import React, {ReactNode, useEffect, useState} from 'react';
import svgImage from '../assets/board.svg';

import ChatBox from '../components/chatBox';
import Navbar from '../components/navBar';
import UserCard from '../components/userCard';
import Signal from '../components/signal';
import ActionPanel from '../components/actionPanel';
import InfoActionPanel from '../components/infoActionPanel';

import {ColorPalette} from "../types/ColorPalette";
import {Bid} from "../types/Bid";
import {RoomPlayer} from "../types/RoomPlayer";

import {InitialStore} from "../types/Store";

import "./gameboard.css";
import {colorPaletteList, GameSignals, InfoActionPanelStates} from "../constants";

import globalContext from '../global';
import { useSelector, useDispatch } from 'react-redux';

interface GameboardProps {
  room_id?: string;
}

/* TODO REMOVE COMMAND SET LATER */
const createDummyUsers = (count:number) => {
  const userArray = [];

  for(let i = 0; i < count; i++)
  {
    const randomIndex = Math.floor(Math.random() * colorPaletteList.length);
    const colorPalette:ColorPalette = colorPaletteList[randomIndex];
    const bid:Bid = {
      dice: Math.floor(Math.random() * 5) + 1,
      quality: Math.floor(Math.random() * 10) + 1,
    };

    const newUser:RoomPlayer= {
      username: "random_user_" + i.toString(),
      turnNumber: i,
      colorPalette:colorPalette,
      currendBid: bid,
      isTurn: false,
      isEliminated: false,
      isDisconnected: false,
    }
    userArray.push(newUser);
  }
  return userArray;
};

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

  const isTurn = useSelector((state:InitialStore) => state.isTurn);
  const isUserEliminated = useSelector((state:InitialStore) => state.isUserEliminated);
  const isGameStarted = useSelector((state:InitialStore) => state.isGameStarted);
  const isSelfAdmin = useSelector((state:InitialStore) => state.isSelfAdmin);
  const roomPlayers = useSelector((state:InitialStore) => state.roomPlayers);

  const dispatch = useDispatch();

  const setIsTurn = (value:boolean) => {
    dispatch({ type: 'SET_IS_TURN', payload:value});
  };

  const setIsUserEliminated = (value:boolean) => {
    dispatch({ type: 'SET_IS_ELIMINATED', payload:value});
  };

  const setIsGameStarted = (value:boolean) => {
    dispatch({ type: 'SET_IS_GAME_STARTED', payload:value});
  };

  const setIsSelfAdmin = (value:boolean) => {
    dispatch({ type: 'SET_IS_ADMIN', payload:value});
  };

  const addRoomPlayer = (username:string, player:RoomPlayer) => {
    dispatch({ type: 'ADD_ROOM_PLAYER', payload:{
      username: username,
      player: player,
    }});
  };


  // todo: set room id to global context if room id is valid
  // TODO CREATE WEBSOCKET INSTANCE HERE

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
        break;

      case "set_admin":
        setIsSelfAdmin(param.toLowerCase() === "true");
      break;

      case "connect_users":
        const dummyUsers = createDummyUsers(3);
        dummyUsers.forEach((eachRoomPlayer) => {
          addRoomPlayer(eachRoomPlayer.username, eachRoomPlayer);
        });
      break;
    }
  }

  const userCards = Object.keys(roomPlayers).map(eachUsername => {
    const playerData = roomPlayers[eachUsername];
    return (<UserCard 
        username={playerData.username} 
        colorPalette={playerData.colorPalette} 
        isTurn={playerData.isTurn} 
        isEliminated={playerData.isEliminated}
        isDisconnected={playerData.isDisconnected}
        currentBid={playerData.currendBid} 
      />);
  });
  
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
              {userCards.length > 0 && userCards[0]}
            </div>
            <div className='col-4'>
              {userCards.length > 1 && userCards[1]}
            </div>
            <div className='col-4'>
              {userCards.length > 2 && userCards[2]}
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-4' id="turn_4">
              {userCards.length > 3 && userCards[3]}
            </div>
            <div className='col-4' id="turn_5">
              {userCards.length > 4 && userCards[4]}
            </div>
            <div className='col-4' id="turn_6">
              {userCards.length > 5 && userCards[5]}
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
