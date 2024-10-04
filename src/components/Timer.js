import React, { useState, useEffect } from 'react';

function Timer() {
  const [countdown, setCountdown] = useState(300);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === 0) {
            clearInterval(timer);
            alert("You ran out of time :(");
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started]);

  useEffect(() => {
    const handleStart = () => setStarted(true);
    document.addEventListener('click', handleStart);
    return () => document.removeEventListener('click', handleStart);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <span id="timer">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}

export default Timer;