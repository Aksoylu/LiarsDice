import React, {useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content'


import {AllowedPageSize, ErrorPageTypes} from './constants';

import Welcome from './pages/welcome';
import GameBoard from './pages/gameboard';
import About from './pages/about';
import Error from './pages/error';

import {InitialStore} from "./types/Store";
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2'

import httpService from './services/httpService';
import signalIrService from "./services/signalIrService";
import greenBackgroundImage from './assets/board.svg';
import loadingGif from './assets/loading.gif';

const swal = withReactContent(Swal);

const { getTranslationInstance } = require("./translations/translate");

const startSignalRConnection = async (authKey:string) => {
  await signalIrService.start(authKey);
}


/* ===== CREATE LOADING MODAL ===== */
const createLoadingModal = (translation:any) => {
  const loadingModal = withReactContent(Swal)
  loadingModal.fire({
    allowOutsideClick:false,
    allowEscapeKey: false,
    timerProgressBar: true,
    showConfirmButton:false,
    backdrop: `
      rgba(0,0,0,0.5)
      center
      repeat
    `,
    title: <center>{translation.get("modal_loading_title")}</center>,
    html: <div className='create-session-modal-body'>
      <img src={loadingGif} width="25%" />
      <br/>
      {translation.get("modal_loading_subtitle")}
    </div>
  });
  return loadingModal;
  
}

/* ===== SERVER STATUS FAILURE MODAL ===== */
const createServerStatusFailureModal = async (translation:any) => {
  return swal.fire({
    allowOutsideClick:false,
    allowEscapeKey: false,
    backdrop: `
        url(${greenBackgroundImage})
        center
        repeat
    `,
    title: <center>{translation.get("modal_server_stastus_failure_title")}</center>,
    html: <div className='create-session-modal-body'>
      {translation.get("modal_server_stastus_failure_subtitle")}
    </div>,
    confirmButtonText: translation.get("modal_server_stastus_failure_retry_button"),
    confirmButtonColor: "#128712",
    preConfirm: () => {
      window.location.reload();
      return false;
    },
  });
}

/* ===== CREATE SESSION MODAL ===== */
const createSessionModal = async (translation:any, dispatch:any) => {
  let usernameInput:HTMLInputElement;

  const modal = swal.fire({
    allowOutsideClick:false,
    allowEscapeKey: false,
    backdrop: `
        url(${greenBackgroundImage})
        center
        repeat
    `,
    title: <center>{translation.get("modal_create_session_title")}</center>,
    html: <div className='create-session-modal-body'>
      {translation.get("modal_create_session_subtitle")}
      <br/>
      <input type="text" id="username" className="swal2-input" placeholder="Enter your username"/>
    </div>,
    confirmButtonText: translation.get("modal_create_session_accept_button"),
    confirmButtonColor: "#128712",
    preConfirm: () => {
      usernameInput = document.getElementById("username") as HTMLInputElement;
      if(!usernameInput.value || usernameInput.value.length < 3)
        return false;
    },
  });

  const modalResult = await modal;

  if(modalResult.isConfirmed)
  {
    usernameInput = document.getElementById("username") as HTMLInputElement;
    const authResponse = await httpService.createAuthentication(usernameInput.value);

    if(!authResponse)
      return window.location.reload();

    dispatch({ type: 'SET_AUTH_KEY', payload:authResponse.auth_token});
    dispatch({ type: 'SET_USERNAME', payload:authResponse.username});
    window.location.reload();
  }
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const storageAuthKey = useSelector((state:InitialStore) => state.authKey);
  const storageUsername = useSelector((state:InitialStore) => state.username);
  const storageLanguage = useSelector((state:InitialStore) => state.language);

  const translation = getTranslationInstance(storageLanguage);
  const loadingModal = createLoadingModal(translation);

  const checkStatus = async () => {
    const status = await httpService.checkStatus();
    loadingModal.close();
    if(!status)
    {
      createServerStatusFailureModal(translation);
    }
    else
    {
      const isAuthenticationValid = storageUsername != null && storageAuthKey != null;  
      if(!isAuthenticationValid)
      {
        createSessionModal(translation, dispatch);
      }
    }
  }

  useEffect(() => { checkStatus() }, []);

  

  const [isScreenSizeCompatible, setIsScreenSizeCompatible] = useState(false);
  
  signalIrService.build(useDispatch());
  startSignalRConnection(storageAuthKey);

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
    return (<Error errorType={ErrorPageTypes.screenSizeNotCompatible}/>);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="join_room/:room_id" element={<WelcomeWithRoomId/>} />
        <Route path="gameboard/:room_id" element={<GameboardwithRoomId/>} />

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
