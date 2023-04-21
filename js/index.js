const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameOver = false;

  const checkForWin = () => {
    // Check rows
    if (board[0] !== '' && board[0] === board[1] && board[1] === board[2]) {
      return true;
    }
    if (board[3] !== '' && board[3] === board[4] && board[4] === board[5]) {
      return true;
    }
    if (board[6] !== '' && board[6] === board[7] && board[7] === board[8]) {
      return true;
    }

    // Check columns
    if (board[0] !== '' && board[0] === board[3] && board[3] === board[6]) {
      return true;
    }
    if (board[1] !== '' && board[1] === board[4] && board[4] === board[7]) {
      return true;
    }
    if (board[2] !== '' && board[2] === board[5] && board[5] === board[8]) {
      return true;
    }

    // Check digonals
    if (board[0] !== '' && board[0] === board[4] && board[4] === board[8]) {
      return true;
    }
    if (board[2] !== '' && board[2] === board[4] && board[4] === board[6]) {
      return true;
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
  const cells = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const resetButton = document.querySelector('#reset');
  const humanButton = document.querySelector('#human');
  const aiButton = document.querySelector('#ai');
  let againstAI = false;

  const init = () => {
    cells.forEach((cell, index) => {
      cell.addEventListener('click', () => {
        if (gameBoard.makeMove(index)) {
          render();
        }
      });
    });

    resetButton.addEventListener('click', reset);

    humanButton.addEventListener('click', () => {
      againstAI = false;
      reset();
    });

    aiButton.addEventListener('click', () => {
      againstAI = true;
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
        message.textContent = `${currentPlayer} wins!`;
      } else {
        message.textContent = 'Tie';
      }
    } else {
      message.textContent = `${currentPlayer} turn`;

      if (againstAI && currentPlayer === 'O') {
        const aiMove = aiPlayer.makeMove();
        if (gameBoard.makeMove(aiMove)) {
          render();
        }
      }
    }
  };

  const reset = () => {
    cells.forEach((cell) => {
      cell.innerHTML = '';
    });
    gameBoard.reset();
    render();
  };

  return {
    init,
  };
})();

const aiPlayer = (() => {
  const makeMove = () => {
    const avialableMoves = gameBoard.getBoard().map((cell, index) => {
      if (cell === '') return index;
      return null;
    }).filter((index) => index !== null);

    return avialableMoves[Math.floor(Math.random() * avialableMoves.length)];
  };

  return {
    makeMove,
  };
})();

gameController.init();
