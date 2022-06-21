// player factory
const Player = (sign) => {
    const getSign = () => {return sign};
    return {getSign}
};

const gameBoard = (() => {
    let gameBoardArr = new Array(9);

    const getVal = (num) => gameBoardArr[num];

    const setVal = (num, player) => {
        let card = document.getElementById(num);
        card.innerHTML = player.getSign();
        gameBoardArr[num] = player.getSign();
    }

    const clear = () => {
        let cards = document.querySelectorAll('.game-card');
        cards.forEach((card) => card.innerHTML = '');
        gameBoardArr.length = 0;
    }

    return {getVal, setVal, clear}
})();

const displayController = (() => {
    const resetBtn = document.querySelector('.reset-btn');
    let cards = document.querySelectorAll('.game-card');

    resetBtn.addEventListener('click', () => {
        if (document.querySelector('.game-grid-copy')) {
            document.querySelector('.container').removeChild(document.querySelector('.game-grid-copy'));
        }
        document.querySelector('.game-grid').classList.remove('inactive');
        gameBoard.clear();
        gameController.resetTurn();
        document.querySelector('.player-one').innerHTML = 'player 1';
        document.querySelector('.player-two').innerHTML = 'player 2';
        if (gameController.currPlayer().getSign() === 'O') {
            gameController.nextTurn();
        }
    })

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            gameController.play(card.id);
        })

        card.addEventListener('mouseover', () => {
            if (!gameBoard.getVal(card.id)) {
                card.innerHTML = gameController.currPlayer().getSign();
            }
        })

        card.addEventListener('mouseout', () => {
            if (!gameBoard.getVal(card.id)) {
                card.innerHTML = '';
            }
        })
    })
    
    const disableGame = () => {
        let gameGrid = document.querySelector('.game-grid');
        let gridCopy = gameGrid.cloneNode(true);
        gridCopy.classList.add('game-grid-copy');
        gridCopy.childNodes.forEach((child) => child.style = 'cursor: default');
        gameGrid.parentNode.insertBefore(gridCopy, gameGrid.nextSibling);
        gameGrid.classList.add('inactive');
    }

    const displayWinner = () => {
        document.querySelector('.turn').innerHTML += ' is the winner!';
    }

    const displayTie = () => {
        document.querySelector('.turn').innerHTML = 'tie!';
    }
    return {disableGame, displayWinner, displayTie}
})();

const gameController = (() => {
    const playerOne = Player('X');
    const playerTwo = Player('O');
    let turn = 0;
    let gameOver = false;


    const play = (index) => {
        if (!gameBoard.getVal(index)) {
            let player = currPlayer();
            gameBoard.setVal(index, player);
            if (!isGameOver(index)) {
                nextTurn();
            }
            
        }
    }

    const currPlayer = () => {
        if (currTurn() === 1) {
            return playerOne;
        } else {
            return playerTwo;
        }
    }

    const currTurn = () => {
        if (document.querySelector('.turn').classList.contains('player-one')) {
            return 1
        } else {
            return 2
        }
    }

    const nextTurn = () => {
        let players = document.querySelector('.players').children;
        if (players[0].classList.contains('turn')) {
            players[0].classList.remove('turn');
            players[0].classList.add('inactive');
            players[1].classList.add('turn');
            players[1].classList.remove('inactive');
        } else {
            players[1].classList.remove('turn');
            players[1].classList.add('inactive');
            players[0].classList.add('turn');
            players[0].classList.remove('inactive');
        }
        turn += 1;
        console.log(turn);
    }

    const isWinner = (index) => {
        const winPossible = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        return winPossible
            .filter((arr) => arr.includes(parseInt(index)))
            .some((possible) => possible.every((index) => gameBoard.getVal(index) === currPlayer().getSign()))
    }

    
    const isGameOver = (index) => {
        if (isWinner(index)) {
            displayController.disableGame();
            displayController.displayWinner();
            return true;
        } else if (turn >= 8) {
            displayController.disableGame();
            displayController.displayTie();
            return true;
        }
        return false;
    }

    const resetTurn = () => {
        turn = 0;
    }

    return {play, currPlayer, currTurn, nextTurn, isGameOver, resetTurn}
})();
