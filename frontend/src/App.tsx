import React, {useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import {AllowedPageSize, ErrorPageTypes} from './constants';
import globalContext from './global';

import Welcome from './pages/welcome';
import GameBoard from './pages/gameboard';
import About from './pages/about';
import Error from './pages/error';

import {InitialStore} from "./types/Store";
import { useSelector, useDispatch } from 'react-redux';
import signalIrService from "./services/signalIrService";

const startSignalRConnection = async (authKey:string) => {
  await signalIrService.start();
  await signalIrService.socketAuth(authKey);
}

const App: React.FC = () => {

  const authKey = useSelector((state:InitialStore) => state.authKey);
  const [isScreenSizeCompatible, setIsScreenSizeCompatible] = useState(false);
  
  signalIrService.build(useDispatch());
  startSignalRConnection(authKey);

  const checkPageSize = () => {
    setIsScreenSizeCompatible((window.innerWidth < AllowedPageSize.minimumWidth || window.innerHeight < AllowedPageSize.minimumHeight))
  }

  useEffect(() => {
    window.addEventListener('resize', checkPageSize);
    return () => {
      window.removeEventListener('resize', checkPageSize);
      signalIrService.stop();
    };
  }, []);

  if(isScreenSizeCompatible)
  {
    return (<Error errorType={ErrorPageTypes.screenSizeNotCompatible}/>);
  }

  const isAuth = globalContext.isAuth();
  const localeRoomId = globalContext.getLocaleRoomId() || null;

  return (
    <Router>
      <Routes>
        {!localeRoomId &&  <Route path="/" element={<Welcome />} />}
        {localeRoomId &&  <Route path="/" element={<Welcome show_reconnect_modal={true}/>} />}

        {!isAuth && <Route path="join_room/:room_id" element={<WelcomeWithRoomId />} />}
        {isAuth && <Route path="join_room/:room_id" element={<GameboardwithRoomId />} />}

        {isAuth &&  <Route path="gameboard/:room_id" element={<GameboardwithRoomId />} />}
        {!isAuth &&  <Route path="gameboard/:room_id" element={<WelcomeWithRoomId />} />}

        <Route path="about" element={<About />} />
        <Route path="gameboard" element={<Error errorType={ErrorPageTypes.roomIdIsNotValid}/>} />
      </Routes>
    </Router>
  );
};

const WelcomeWithRoomId: React.FC = () => {
  const { room_id } = useParams();

  if(!room_id)
    return <Error errorType={ErrorPageTypes.roomIdIsNotValid}/>

  return <Welcome room_id={room_id} />;
};

const GameboardwithRoomId: React.FC = () => {
  const { room_id } = useParams();

  if(!room_id)
    return <Error errorType={ErrorPageTypes.roomIdIsNotValid}/>

  return <GameBoard room_id={room_id}/>;
};

export default App;
