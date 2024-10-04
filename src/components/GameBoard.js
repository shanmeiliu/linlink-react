import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Helper functions
const judgeSame_0 = (obj1, obj2, n, board) => {
  // Implement the logic for judgeSame here
  // This is a placeholder implementation
  return obj1.src === obj2.src ? 1 : 0;
};

const judgeSame = (obj1, obj2, n, board) => {
  // Get the positions of the two objects
  const row1 = Math.floor(obj1.id / (n + 2));
  const col1 = obj1.id % (n + 2);
  const row2 = Math.floor(obj2.id / (n + 2));
  const col2 = obj2.id % (n + 2);

  // Step 1: Check if the two images are the same
  if (obj1.src !== obj2.src) return 0;

  // Step 2: Check if they are directly connected (same row or same column)
  const canConnectDirect = (r1, c1, r2, c2) => {
    if (r1 === r2) {
      // Same row, check if all tiles in between are empty
      const minCol = Math.min(c1, c2);
      const maxCol = Math.max(c1, c2);
      for (let col = minCol + 1; col < maxCol; col++) {
        if (!board[r1][col].includes('image.png')) return false;
      }
      return true;
    }
    if (c1 === c2) {
      // Same column, check if all tiles in between are empty
      const minRow = Math.min(r1, r2);
      const maxRow = Math.max(r1, r2);
      for (let row = minRow + 1; row < maxRow; row++) {
        if (!board[row][c1].includes('image.png')) return false;
      }
      return true;
    }
    return false;
  };

  // Step 3: Check if they are connected via one bend (L-shape)
  const canConnectWithOneBend = (r1, c1, r2, c2) => {
    // Check two possible paths: r1 -> c2 or r2 -> c1
    return (canConnectDirect(r1, c1, r1, c2) && canConnectDirect(r1, c2, r2, c2)) ||
           (canConnectDirect(r1, c1, r2, c1) && canConnectDirect(r2, c1, r2, c2));
  };

  // Step 4: Check if they are connected via two bends (Z-shape)
  const canConnectWithTwoBends = (r1, c1, r2, c2) => {
    // Check if they can be connected via some middle point (rm, cm)
    for (let row = 0; row < n + 2; row++) {
      if (canConnectDirect(r1, c1, row, c1) && canConnectWithOneBend(row, c1, r2, c2)) return true;
    }
    for (let col = 0; col < n + 2; col++) {
      if (canConnectDirect(r1, c1, r1, col) && canConnectWithOneBend(r1, col, r2, c2)) return true;
    }
    return false;
  };

  // Step 5: Check if they are connected directly, with one bend, or with two bends
  if (canConnectDirect(row1, col1, row2, col2)) return 1;
  if (canConnectWithOneBend(row1, col1, row2, col2)) return 1;
  if (canConnectWithTwoBends(row1, col1, row2, col2)) return 1;

  // If none of the conditions match, they can't be connected
  return 0;
};


const judgeHealth = (board, n, imgdir) => {
  // Implement the logic for judgeHealth here
  // This is a placeholder implementation
  //return board.some(src => !src.includes('image.png'));
  // Loop through the board to check if any tiles are still active
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (!board[i][j].includes(imgdir)) {
        return true; // Some tiles are still active
      }
    }
  }
  return false; // No active tiles left, game round is over
};

function GameBoard({ gameState, setGameState, soundEnabled, nextRound }) {
  const clickSound = new Audio('llk-sound/678248mouse-click-sound-AudioTrimmer.mp3');

  const imgSet = useMemo(() => {
    const set = [];
    for (let i = 0; i < gameState.img_num; i++) {
      set.push(`${gameState.imgdir}charmaine_${i}${gameState.img_format}`);
    }
    return set;
  }, [gameState.img_num, gameState.imgdir, gameState.img_format]);

  const generateBoard = useCallback(() => {
    const board = [];
    for (let i = 0; i < gameState.n + 2; i++) {
      const row = [];
      for (let j = 0; j < gameState.n + 2; j++) {
        if (i === 0 || j === 0 || i === gameState.n + 1 || j === gameState.n + 1) {
          row.push(`${gameState.imgdir}image.png`);
        } else {
          const randomIndex = Math.floor(Math.random() * imgSet.length);
          row.push(imgSet[randomIndex]);
        }
      }
      board.push(row);
    }
    return board;
  }, [gameState.n, gameState.imgdir, imgSet]);
  const [board, setBoard] = useState(() => generateBoard());

  // ... (keep the handleClick function and other logic)
  const handleClick = useCallback((e) => {
    if (!e.target.matches('img')) {
      setGameState(prev => ({ ...prev, num_cli: 0 }));
      document.querySelectorAll('.img_selected').forEach(el => el.classList.remove('img_selected'));
      return;
    }

    if (soundEnabled) {
      clickSound.play();
    }

    const id = parseInt(e.target.id);
    const row = Math.floor(id / (gameState.n + 2));
    const col = id % (gameState.n + 2);

    if (e.target.src.includes('image.png')) return;

    if (gameState.num_cli === 0) {
      setGameState(prev => ({ ...prev, obj1: e.target, num_cli: 1 }));
      e.target.classList.add('img_selected');
    } else {
      document.querySelectorAll('.img_selected').forEach(el => el.classList.remove('img_selected'));
      setGameState(prev => ({ ...prev, obj2: e.target, num_cli: 0 }));

      if (e.target === gameState.obj1) return;

      const res = judgeSame(gameState.obj1, e.target, gameState.n, board);
      if (res === 0) {
        alert("Sorry they don't match in 3 straight lines.");
      }
      if (res === 1) {
        const newBoard = [...board];
        const row2 = Math.floor(gameState.obj1.id / (gameState.n + 2));
        const col2 = gameState.obj1.id % (gameState.n + 2);
        newBoard[row2][col2] = `${gameState.imgdir}image.png`;
        newBoard[row][col] = `${gameState.imgdir}image.png`;
        setBoard(newBoard);
      }
    }

    if (!judgeHealth(board, gameState.n, gameState.imgdir)) {
      alert("Congratulations! You've completed this round!");
      nextRound();
      setBoard(generateBoard());
    }
  }, [gameState, setGameState, soundEnabled, clickSound, board, generateBoard, nextRound]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);



  return (
    <div id="llk_layout">
      {board.slice(0,8).map((row, i) => (
        <div key={i} className="llk_row">
          {row.map((src, j) => {
            const id = i * (gameState.n + 2) + j;
            const isBorder = i === 0 || j === 0 || i === gameState.n + 1 || j === gameState.n + 1;
            return (
              <img
                key={id}
                id={id}
                src={src}
                className={isBorder ? '' : 'llk_layout_img'}
                style={isBorder ? { width: 0, height: 0, display: 'none' } : {}}
                alt=""
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;