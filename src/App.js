import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Timer from './components/Timer';
import SoundToggle from './components/SoundToggle';
import './App.css';

function App() {
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
      };
    });
  }, []);

  return (
    <div className="App">
      <SoundToggle soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
      <div className="split left">
        <div id="debug_info">
          <h1><Timer key={gameState.round} /></h1>
          <div id="game_info">
            <h3>- Connect 2 similar images with up to 3 straight lines</h3>
            <h3>- Each level will limit time, game over when time runs out</h3>
            <a href="https://www.youtube.com/watch?v=7d5l5o8NzNc">Here is a video on how to play</a>
          </div>
        </div>
      </div>
      <div className="split right">
        <GameBoard 
          gameState={gameState} 
          setGameState={setGameState} 
          soundEnabled={soundEnabled} 
          nextRound={nextRound}
        />
      </div>
    </div>
  );
}

export default App;