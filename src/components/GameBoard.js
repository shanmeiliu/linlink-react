import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Helper functions
const judgeSame_0 = (obj1, obj2, n, board) => {
  // Implement the logic for judgeSame here
  // This is a placeholder implementation
  return obj1.src === obj2.src ? 1 : 0;
};

const isDict = (v) => {
  return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

const judgeSame = (obj1, obj2, n, board, doAlert = true) => {
  if (!isDict(obj1) || !isDict(obj2)) {
    return false
  }

  const row1 = Math.floor(obj1.id / (n + 2));
  const col1 = obj1.id % (n + 2);
  const row2 = Math.floor(obj2.id / (n + 2));
  const col2 = obj2.id % (n + 2);

  // Step 1: Check if the two images are the same
  if (obj1.src !== obj2.src) {
    if (doAlert) 
      alert("Not the same image"); 
    
    return -1  
  };

  // Step 2: Check if they are directly connected (same row or same column)
  const canConnectDirect = (r1, c1, r2, c2, checkSpot2empty) => {    
    if (checkSpot2empty && !board[r2][c2].includes('image.png')) 
      return false;

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
    return (canConnectDirect(r1, c1, r1, c2, true) && canConnectDirect(r2, c2, r1, c2, false)) ||
           (canConnectDirect(r1, c1, r2, c1, true) && canConnectDirect(r2, c2, r2, c1, false));
  };

  // Step 4: Check if they are connected via two bends (Z-shape)
  const canConnectWithTwoBends = (r1, c1, r2, c2) => {
    // Check if they can be connected via some middle point (rm, cm)
    for (let row = 0; row < n + 2; row++) {
      if (canConnectDirect(r1, c1, row, c1, true) && canConnectWithOneBend(row, c1, r2, c2)) {
        return true;
      }
    }
    for (let col = 0; col < n + 2; col++) {
      if (canConnectDirect(r1, c1, r1, col, true) && canConnectWithOneBend(r1, col, r2, c2)) {
        return true;
      }
    }
    return false;
  };

  // Step 5: Check if they are connected directly, with one bend, or with two bends
  if (canConnectDirect(row1, col1, row2, col2, false)) {
    return 1;
  }
  if (canConnectWithOneBend(row1, col1, row2, col2)) {
    return 1;
  }
  if (canConnectWithTwoBends(row1, col1, row2, col2)) {
    return 1;
  }

  // If none of the conditions match, they can't be connected
  return 0;
};


const judgeInProgress = (board, n, imgdir) => {
  // Implement the gameOver logic from judgeHealth here
  // This is a placeholder implementation
  //return board.some(src => !src.includes('image.png'));
  // Loop through the board to check if any tiles are still active
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (!board[i][j].includes('image.png')) {
        return true; // Some tiles are still active
      }
    }
  }
  return false; // No active tiles left, game round is over
};

const shuffleArray = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

const shuffle = (board, gameState, imgSet) => {
  const n = gameState.n

  let candidates = []

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {      
      if (board[i][j] != `${gameState.imgdir}image.png`)
      {
        
        candidates.push([i,j])
        //board[i][j] = imgSet[randomIndex]
      }      
    }
  }

  shuffleArray(candidates)

  let oneValid = false

  while(candidates.length > 0)
  {
    let item1 = candidates.pop()
    let item2 = candidates.pop()

    const randomIndex = Math.floor(Math.random() * imgSet.length);

    let src = imgSet[randomIndex]

    board[item1[0]][item1[1]] = src
    board[item2[0]][item2[1]] = src

   
    if (!oneValid) {
      let tempObj1 = {}
      tempObj1.id = item1[0] * (n + 2) + item1[1]
      tempObj1.src = src 
      let tempObj2 = {}
      tempObj2.id = item2[0] * (n + 2) + item2[1]
      tempObj2.src = src
      if (!judgeSame(tempObj1, tempObj2, gameState.n, board, false))
      {
        candidates.push(item1)
        candidates.concat(item2)
      } else {
        oneValid = true
      }
    } 
  }
};

const handleHealth = (board, gameState, imgSet, setGameState) => {
  // if (board[0][0].replace("image.png","") != gameState.imgdir) {
  //   shuffle(board, gameState, imgSet)
  //   return
  // }
  
  const n = gameState.n

  let healthy = 0
  
  for (let i = 1; i <= n; i++) {
    if (healthy ==1) {
      i = n + 1
      break
    }
    for (let j = 1; j <= n; j++) { 
      let temp1 = board[i][j]

      if (temp1.includes('image.png'))
        continue

      for (let ii = i; ii <= n; ii++)
      {
        for (let jj = 1; jj <= n; jj ++)
        {
          if (ii == i && jj == j)
            continue

          let temp2 = board[ii][jj]

          if (temp2.includes('image.png'))
            continue

          let tobj1 = {}
          tobj1.id = i * (n + 2) + j
          tobj1.src = temp1
          let tobj2 = {}
          tobj2.id = ii * (n + 2) + jj
          tobj2.src = temp2

          if (judgeSame(tobj1, tobj2, n, board, false) == 1) {
            
            setGameState(prev => ({ ...prev, match: "(" + i + "," + j + ") <-> (" + ii + "," + jj + ")" }));
            healthy = 1
            break
          }
        }
      }
    }
  }

  if (healthy == 0)
  {
    shuffle(board, gameState, imgSet)
  }
}

function GameBoard({ gameState, setGameState, soundEnabled, nextRound }) {
  const clickSound = new Audio('llk-sound/678248mouse-click-sound-AudioTrimmer.mp3');

  const imgSet = useMemo(() => {
    const set = [];
    for (let i = 0; i < gameState.img_num; i++) {
      set.push(`${gameState.imgdir}charmaine_${i}${gameState.img_format}`);
    }
    return set;
  }, [gameState]);

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
  }, [gameState.n, gameState.imgdir, imgSet, gameState]);

  const [board, setBoard] = useState(() => generateBoard());

  useEffect(() => {
    setBoard(generateBoard());
  }, [gameState.round]);

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

    if (!judgeInProgress(board, gameState.n, gameState.imgdir)) {
      alert("Congratulations! You've completed this round!");
      nextRound();
      return
    }

    // Check for valid plays (and shuffle till good board if none)
    handleHealth(board, gameState, imgSet, setGameState)

  }, [gameState, setGameState, soundEnabled, clickSound, board, generateBoard, nextRound, imgSet]);

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