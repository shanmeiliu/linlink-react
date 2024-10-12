import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Timer from './components/Timer';
import SoundToggle from './components/SoundToggle';
import './App.css';

function App() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Max zoom is 2x
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom is 0.5x
  };
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState(() => {
    const round = Number(sessionStorage.getItem('round') || 0);
    return {
      num_cli: 0,
      obj1: null,
      obj2: null,
      n: 6,
      img_num: round % 2 === 0 ? 16 : 17,
      imgdir: round % 2 === 0 ? "image-set2/" : "image-set1/",
      img_format: ".jpg",
      round: round,
      match: "",
    };
  });

  useEffect(() => {
    sessionStorage.setItem('round', gameState.round.toString());
  }, [gameState.round]);

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const newRound = prev.round + 1;
      return {
        ...prev,
        round: newRound,
        img_num: newRound % 2 === 0 ? 16 : 17,
        imgdir: newRound % 2 === 0 ? "image-set2/" : "image-set1/",
        num_cli: 0,
        obj1: null,
        obj2: null,
        match: "",
      };
    });
  }, []);

  return (
    <div className="App">
      <SoundToggle soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
      <div className="split left">
      
        <div id="debug_info">
          <h1><Timer key={gameState.round} /></h1>   
          {/* <h2>{gameState.match}</h2>    */}
          <div id="game_info">
            <h3>- Connect 2 similar images with up to 3 straight lines</h3>
            <h3>- Each level will limit time, game over when time runs out</h3>
            <a href="https://www.youtube.com/watch?v=7d5l5o8NzNc">Here is a video on how to play</a>
          </div>
        </div>
        <button className="zoom-btn" onClick={zoomIn}>Zoom In</button>
      <button className="zoom-btn" onClick={zoomOut}>Zoom Out</button>
      </div>
      <div className="split right">
      <div id="llk_layout" style={{ transform: `scale(${zoom})` }}>
        <GameBoard 
          gameState={gameState} 
          setGameState={setGameState} 
          soundEnabled={soundEnabled} 
          nextRound={nextRound}
        />
      </div>
      </div>
    </div>
  );
}

export default App;