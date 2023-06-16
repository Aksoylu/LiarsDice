import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';

import Welcome from './pages/welcome';
import GameBoard from './pages/gameboard';
import About from './pages/about';

// TODO: EN KÜÇÜK OYNANABİLİR BOYUT SINIRI : 900 W 700 H
// TODO:UYARI VER EKRAN UYUMSUZ. CİHAZINI YAN ÇEVİR VEYA PC DE OYNA

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="about" element={<About />} />
        <Route path="join_room/:room_id" element={<WelcomeWithRoomId />} />
        <Route path="gameboard/:room_id" element={<GameboardwithRoomId />} />
        <Route path="gameboard" element={<h1>hata : oda numarası yok</h1>} /> // todo implement error

      </Routes>
    </Router>
  );
};

const WelcomeWithRoomId: React.FC = () => {
  const { room_id } = useParams();
  return <Welcome room_id={room_id} />;
};

const GameboardwithRoomId: React.FC = () => {
  const { room_id } = useParams();

  const auth_hash = localStorage.getItem('auth_hash') ?? null;
  const username = localStorage.getItem('username') ?? null;
  const user_lang = localStorage.getItem('user_lang') ?? "en";
  console.log("room_id >", room_id, username);
  if(!room_id || !username)
  {
    return <h1>siktir</h1>;
  }

  return <GameBoard username={username} auth_hash={auth_hash} room_id={room_id} user_lang={user_lang}/>;
};

export default App;
