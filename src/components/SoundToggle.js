import React from 'react';

function SoundToggle({ soundEnabled, setSoundEnabled }) {
  return (
    <button 
      id="toggleSound" 
      style={{ position: 'absolute', top: '10px', left: '10px' }}
      onClick={() => setSoundEnabled(!soundEnabled)}
    >
      {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
    </button>
  );
}

export default SoundToggle;