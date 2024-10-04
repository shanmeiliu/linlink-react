import React from 'react';

function ControlPanel({ countdown, round, startGame }) {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="control-panel">
      <h1>Round: {round}</h1>
      <div className="timer">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
      <button onClick={startGame}>Start Game</button>
      <div className="instructions">
        <h2>How to Play</h2>
        <p>Connect 2 similar images with up to 3 straight lines.</p>
        <p>Each level limits time. Game over when time runs out.</p>
      </div>
    </div>
  );
}

export default ControlPanel;
