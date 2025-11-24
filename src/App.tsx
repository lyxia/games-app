import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GameRouter from './components/GameRouter';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:category/:gameName" element={<GameRouter />} />
      </Routes>
    </HashRouter>
  );
};

export default App;

