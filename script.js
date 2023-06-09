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

    function playMove(row, column) {
        if (!board[row][column]) {
            board[row][column] = activePlayer.mark;
            switchPlayers();
        }

        return board;
    }

    return {
        playMove,
    }
})();

function ScreenController() {
    const root = document.querySelector("#board")

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
    }

    function clickHandlerBoard(e) {
        const index = e.target.dataset.index;
        const [row, column] = index.split(",");

        gameboard = GameController.playMove(row, column);
        console.log(gameboard);
        renderBoard(root);
    }

    renderBoard(root);

    root.addEventListener("click", clickHandlerBoard);
}

ScreenController();
