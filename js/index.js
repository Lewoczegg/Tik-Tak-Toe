const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameOver = false;

  const checkForWin = () => {
    // Check rows
    if (board[0] !== '' && board[0] === board[1] && board[1] === board[2]) {
      return [0, 1, 2];
    }
    if (board[3] !== '' && board[3] === board[4] && board[4] === board[5]) {
      return [3, 4, 5];
    }
    if (board[6] !== '' && board[6] === board[7] && board[7] === board[8]) {
      return [6, 7, 8];
    }

    // Check columns
    if (board[0] !== '' && board[0] === board[3] && board[3] === board[6]) {
      return [0, 3, 6];
    }
    if (board[1] !== '' && board[1] === board[4] && board[4] === board[7]) {
      return [1, 4, 7];
    }
    if (board[2] !== '' && board[2] === board[5] && board[5] === board[8]) {
      return [2, 5, 8];
    }

    // Check digonals
    if (board[0] !== '' && board[0] === board[4] && board[4] === board[8]) {
      return [0, 4, 8];
    }
    if (board[2] !== '' && board[2] === board[4] && board[4] === board[6]) {
      return [2, 4, 6];
    }

    return false;
  };

  const makeMove = (index) => {
    if (gameOver || board[index] !== '') {
      return false;
    }

    board[index] = currentPlayer;

    if (checkForWin()) {
      gameOver = true;
      return true;
    }

    if (board.every((square) => square !== '')) {
      gameOver = true;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    return true;
  };

  const reset = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
  };

  const getBoard = () => board;
  const getCurrentPlayer = () => currentPlayer;
  const isGameOver = () => gameOver;

  return {
    makeMove, reset, getBoard, getCurrentPlayer, isGameOver, checkForWin,
  };
})();

const gameController = (() => {
  const main = document.querySelector('main');
  const cells = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const resetButton = document.querySelector('#reset');
  const humanButton = document.querySelector('#human');
  const aiButton = document.querySelector('#ai');
  const boardEl = document.querySelector('.board');
  const settingsButton = document.querySelector('.settings');
  const xButton = document.querySelector('#x');
  const oButton = document.querySelector('#o');
  const aiDifficultyEasyButton = document.querySelector('#easy');
  const aiDifficultyMediumButton = document.querySelector('#medium');
  const aiDifficultyHardButton = document.querySelector('#hard');
  const aiSettingsEl = document.querySelector('.ai-settings');
  let againstAI = false;
  let aiDifficulty = 'easy';
  let aiSymbol = 'O';

  const init = () => {
    cells.forEach((cell, index) => {
      cell.addEventListener('click', () => {
        if (gameBoard.makeMove(index)) {
          for (let i = 0; i < 9; i++) {
            if (cells[i].classList.contains('cell-animating')) {
              cells[i].classList.remove('cell-animating');
            }
          }
          cell.classList.add('cell-animating');
          render();
        }
      });

      cell.addEventListener('animationend', () => {
        cell.classList.remove('cell-animating');
        boardEl.classList.remove('running');
      });
    });

    resetButton.addEventListener('click', reset);

    humanButton.addEventListener('click', () => {
      againstAI = false;
      main.classList.add('in-game');
      humanButton.classList.add('active');
      aiButton.classList.remove('active');
      boardEl.style.display = 'grid';
      message.style.display = 'block';
      resetButton.style.display = 'block';
      reset();
    });

    aiButton.addEventListener('click', () => {
      againstAI = true;
      aiButton.classList.add('active');
      humanButton.classList.remove('active');
      main.classList.add('in-game');
      boardEl.style.display = 'grid';
      message.style.display = 'block';
      resetButton.style.display = 'block';
      reset();
    });

    settingsButton.addEventListener('click', () => {
      aiSettingsEl.classList.toggle('toggle');
    });

    aiDifficultyEasyButton.addEventListener('click', () => {
      aiDifficulty = 'easy';
      aiDifficultyEasyButton.classList.add('active');
      aiDifficultyMediumButton.classList.remove('active');
      aiDifficultyHardButton.classList.remove('active');
    });

    aiDifficultyMediumButton.addEventListener('click', () => {
      aiDifficulty = 'medium';
      aiDifficultyEasyButton.classList.remove('active');
      aiDifficultyMediumButton.classList.add('active');
      aiDifficultyHardButton.classList.remove('active');
    });

    aiDifficultyHardButton.addEventListener('click', () => {
      aiDifficulty = 'hard';
      aiDifficultyEasyButton.classList.remove('active');
      aiDifficultyMediumButton.classList.remove('active');
      aiDifficultyHardButton.classList.add('active');
    });

    xButton.addEventListener('click', () => {
      aiSymbol = 'O';
      xButton.classList.add('active');
      oButton.classList.remove('active');
      reset();
    });

    oButton.addEventListener('click', () => {
      aiSymbol = 'X';
      xButton.classList.remove('active');
      oButton.classList.add('active');
      reset();
    });

    render();
  };

  const render = () => {
    const board = gameBoard.getBoard();

    cells.forEach((cell, index) => {
      if (board[index] === 'X') {
        cell.innerHTML = '<img src="img/x.svg" alt="X icon"></img>';
      }
      if (board[index] === 'O') {
        cell.innerHTML = '<img src="img/o.svg" alt="O icon"></img>';
      }
    });

    const currentPlayer = gameBoard.getCurrentPlayer();
    const gameOver = gameBoard.isGameOver();

    if (gameOver) {
      if (gameBoard.checkForWin()) {
        const winningCombination = gameBoard.checkForWin();
        for (let i = 0; i < 9; i++) {
          if (winningCombination.includes(i)) {
            cells[i].classList.add('highlight');
          }
        }
        message.textContent = `${currentPlayer} wins!`;
      } else {
        message.textContent = 'Tie';
      }
    } else {
      message.textContent = `${currentPlayer} turn`;

      if (againstAI && currentPlayer === aiSymbol) {
        const aiMove = aiPlayer.makeMove(aiDifficulty);
        gameBoard.makeMove(aiMove);
        render();
      }
    }
  };

  const reset = () => {
    cells.forEach((cell) => {
      cell.innerHTML = '';
      cell.classList.remove('highlight');
    });
    gameBoard.reset();
    render();
  };

  const getAiSymbol = () => aiSymbol;

  return {
    init,
    getAiSymbol,
  };
})();

const aiPlayer = (() => {
  const minimax = (board, player) => {
    // Check if the game is over and return a score based on the winner
    if (gameBoard.checkForWin()) {
      if (gameBoard.getCurrentPlayer() === player) {
        return { score: 10 };
      }
      return { score: -10 };
    } if (board.every((square) => square !== '')) {
      // If the game is a tie, return a score of 0
      return { score: 0 };
    }

    // Collect scores from each possible move
    const moves = [];
    const opponent = player === 'X' ? 'O' : 'X';
    board.forEach((cell, index) => {
      if (cell === '') {
        const move = {};
        move.index = index;
        board[index] = player;
        const result = minimax(board, opponent);
        move.score = result.score;
        board[index] = '';
        moves.push(move);
      }
    });

    if (player !== gameController.getAiSymbol()) {
      let bestScore = -Infinity;
      let bestMove;
      moves.forEach((move) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      });
      return bestMove;
    }

    let bestScore = Infinity;
    let bestMove;
    moves.forEach((move) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
    return bestMove;
  };

  const makeMove = (difficulty) => {
    if (difficulty === 'easy') {
      const avialableMoves = gameBoard.getBoard().map((cell, index) => {
        if (cell === '') return index;
        return null;
      }).filter((index) => index !== null);

      return avialableMoves[Math.floor(Math.random() * avialableMoves.length)];
    }
    if (difficulty === 'hard') {
      const board = gameBoard.getBoard();
      const move = minimax(board, gameBoard.getCurrentPlayer());
      return move.index;
    }
  };

  return {
    makeMove,
  };
})();

gameController.init();
