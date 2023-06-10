const Gameboard = (function() {
    const rows = 3;
    const columns = 3;

    const gameboard = [];
    const getBoard = () => gameboard;

    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i].push("");
        }
    }

    function setMark(row, column, mark) {
        if (!gameboard[row][column]) {
            gameboard[row][column] = mark;
        }
    }

    return {
        getBoard,
        setMark,
    }
})();

const Player = function(mark) {
    return {
        mark,
    };
}

const GameController = (function() {
    const players = {
        first: Player("X"),
        second: Player("O"),
    }
    const board = Gameboard.getBoard();

    let activePlayer = players.first;

    const switchPlayers = () => activePlayer = activePlayer === players.first ? players.second : players.first;

    const getActivePlayer = () => activePlayer;

    function checkWin(board) {
        const firstDiagonal = board[0][0] + board[1][1] + board[2][2];
        if (firstDiagonal[0] && firstDiagonal[0] === firstDiagonal[1] && firstDiagonal[1] === firstDiagonal[2]) {
            return true;
        }

        const secondDiagonal = board[0][2] + board[1][1] + board[2][0];
        if (secondDiagonal[0] && secondDiagonal[0] === secondDiagonal[1] && secondDiagonal[1] === secondDiagonal[2]) {
            return true;
        }
        
        for (row of board) {
            if (row[0] && row[0] === row[1] && row[1] === row[2]) {
                return true;
            }
        }

        for (let i = 0; i < board.length; i++) {
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return true;
            }
        }
    }

    function checkTie(board) {
        for (let i of board) {
            for (let j of i) {
                if (!j) {
                    return false;
                }
            }
        }
        return true;
    }

    function getGameStatus() {
        if (checkWin(board)) {
            return "win";
        }

        if (checkTie(board)) {
            return "tie";
        }

        return "playable";
    }

    function playMove(row, column) {
        if (!board[row][column]) {
            board[row][column] = activePlayer.mark;
            switchPlayers();
        }
    }

    return {
        playMove,
        getGameStatus,
        getActivePlayer,
    }
})();

function ScreenController() {
    const root = document.querySelector("#board")
    const statusDisplay = document.querySelector("#statusDisplay");

    let gameboard = Gameboard.getBoard();

    function renderBoard(root) {
        root.textContent = "";

        for (let row = 0; row < gameboard.length; row++) {
            const boardRow = document.createElement("div");

            for (let column = 0; column < gameboard[row].length; column++) {
                const boardCell = document.createElement("button");

                boardCell.textContent = gameboard[row][column];
                boardCell.classList.add("cell"); 

                boardCell.dataset.index = [row, column];

                boardRow.appendChild(boardCell);
            }
            boardRow.classList.add("row");
            root.appendChild(boardRow);
        }

        statusDisplay.textContent = `It's ${GameController.getActivePlayer().mark}'s turn!`;
    }

    function clickHandlerBoard(e) {
        const index = e.target.dataset.index;
        const [row, column] = index.split(",");

        const currentPlayer = GameController.getActivePlayer();
        GameController.playMove(row, column);

        const status = GameController.getGameStatus();

        renderBoard(root);

        if (status.toLowerCase() === "tie") {
            root.classList.add("disabled");
            statusDisplay.textContent = "It's a TIE!";
            root.removeEventListener("click", clickHandlerBoard);
        } else if (status.toLowerCase() == "win") {
            root.classList.add("disabled");
            statusDisplay.textContent = `The player ${currentPlayer.mark} won!`;
            root.removeEventListener("click", clickHandlerBoard);
        }
    }

    renderBoard(root);

    root.addEventListener("click", clickHandlerBoard);
}

ScreenController();
