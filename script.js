const Gameboard = (function() {
    function generateBoard() {
        const rows = 3;
        const columns = 3;
        const board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push("");
            }
        }

        return board;
    }


    let gameboard = generateBoard();

    const getBoard = () => gameboard;

    function resetBoard() {
        gameboard = generateBoard();
        return gameboard;
    }

    function setMark(row, column, mark) {
        if (!gameboard[row][column]) {
            gameboard[row][column] = mark;
        }
    }

    return {
        getBoard,
        resetBoard,
        setMark,
    }
})();

const Player = function(mark, type) {
    return {
        mark,
        type,
    };
}

const GameController = (function() {
    let mode = "player";

    const players = {
        first: Player("X", "player"),
    }

    const enablePlayer = () => {
        players.second = Player("O", "player");
        mode = "player";
    }

    const enableAI = () => {
        players.second = Player("O", "bot");
        mode = "bot";
    }

    enablePlayer();

    let activePlayer = players.first;

    const getMode = () => mode;

    const switchPlayers = () => activePlayer = activePlayer === players.first ? players.second : players.first;

    const resetActivePlayer = () => activePlayer = players.first;

    const getActivePlayer = () => activePlayer;

    function checkWin() {
        const board = Gameboard.getBoard();

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

        return false;
    }

    function checkTie() {
        const board = Gameboard.getBoard();
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
        const board = Gameboard.getBoard();
        if (checkWin(board)) {
            return "win";
        }

        if (checkTie(board)) {
            return "tie";
        }

        return "playable";
    }

    function playMove(row, column) {
        let board = Gameboard.getBoard();

        if (board[row][column] != "") return false;

        board[row][column] = activePlayer.mark;
        switchPlayers();

        return true;
    }

    function playAI() {
        let board = Gameboard.getBoard();
        const {row, col} = findBestMove(board);

        switchPlayers();

        board[row][col] = "O";
    }

    function isMovesLeft(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == "") return true;
            }
        }
        return false;
    }

    function evaluate(b) {
        const player = players.first.mark;
        const bot = players.second.mark;

        for (let row = 0; row < 3; row++) {
            if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
                if (b[row][0] === bot) return +10;
                else if (b[row][0] === player)  return -10;
            }
        }

        for (let col = 0; col < 3; col++) {
            if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
                if (b[0][col] === bot) return +10;
                else if (b[0][col] === player)  return -10;
            }
        }

        if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
                if (b[0][0] === bot) return +10;
                else if (b[0][0] === player)  return -10;
        }

        if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
                if (b[0][2] === bot) return +10;
                else if (b[0][2] === player)  return -10;
        }

        return 0;
    }

    function minimax(board, depth, isMaximizingPlayer) {
        const player = players.first.mark;
        const bot = players.second.mark;

        let score = evaluate(board);

        if (score === 10) return score;
        if (score === -10) return score;
        if (!isMovesLeft(board)) return 0;

        if (isMaximizingPlayer) {
            let best = -1000;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == "") {
                        board[i][j] = bot;
                        best = Math.max(best, minimax(board, depth + 1, !isMaximizingPlayer));
                        board[i][j] = "";
                    }
                }
            }
            return best;
        }

        else {
            let best = 1000;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == "") {
                        board[i][j] = player;
                        best = Math.min(best, minimax(board, depth + 1, !isMaximizingPlayer));
                        board[i][j] = "";
                    }
                }
            }
            return best;
        }
    }

    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = {row: -1, col: -1}

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if (board[i][j] == "") {
                    board[i][j] = "O";

                    let moveVal = minimax(board, 0, false);
                    board[i][j] = "";

                    if (moveVal > bestVal) {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return bestMove;
    }

        return {
            playMove,
            getGameStatus,
            getActivePlayer,
            getMode,
            resetActivePlayer,
            enablePlayer,
            enableAI,
            playAI,
        }
    })();

function ScreenController() {
    const root = document.querySelector("#board")
    const statusDisplay = document.querySelector("#statusDisplay");
    const restartBtn = document.querySelector("#restartBtn");
    const restartBtnBot = document.querySelector("#restartBtnBot");

    function resetBoard() {
        Gameboard.resetBoard();
        GameController.resetActivePlayer();

        renderBoard(root);

        if (root.classList.contains("disabled")) {
            root.classList.remove("disabled");
        }
    }

    restartBtn.addEventListener("click", () => {
        GameController.enablePlayer();
        resetBoard();
    });

    restartBtnBot.addEventListener("click", () => {
        GameController.enableAI();
        resetBoard();
    });

    function renderBoard(root) {
        let gameboard = Gameboard.getBoard();
        const playerButton = document.querySelector("#restartBtn"); 
        const botButton = document.querySelector("#restartBtnBot"); 

        root.textContent = "";

        for (let row = 0; row < gameboard.length; row++) {
            for (let column = 0; column < gameboard[row].length; column++) {
                const boardCell = document.createElement("button");

                boardCell.textContent = gameboard[row][column];
                boardCell.classList.add("cell"); 

                boardCell.dataset.index = [row, column];
                root.appendChild(boardCell);
            }
        }

        statusDisplay.textContent = `It's ${GameController.getActivePlayer().mark}'s turn!`;

        if (GameController.getMode() === "player") {
            root.removeEventListener("click", clickHandlerBoardBot);

            root.addEventListener("click", clickHandlerBoardPlayers);

            botButton.classList.remove("chosen");
            playerButton.classList.add("chosen");
        } else {
            root.removeEventListener("click", clickHandlerBoardPlayers);

            root.addEventListener("click", clickHandlerBoardBot);

            playerButton.classList.remove("chosen");
            botButton.classList.add("chosen");
        }
    }

    function determineStatus(currentPlayer) {
        if (GameController.getGameStatus().toLowerCase() === "tie") {
            root.classList.add("disabled");

            statusDisplay.textContent = "It's a TIE!";

            root.removeEventListener("click", clickHandlerBoardPlayers);
            root.removeEventListener("click", clickHandlerBoardBot);
            return "finished";
        } else if (GameController.getGameStatus().toLowerCase() == "win") {
            root.classList.add("disabled");

            statusDisplay.textContent = `The player ${currentPlayer.mark} won!`;

            root.removeEventListener("click", clickHandlerBoardPlayers);
            root.removeEventListener("click", clickHandlerBoardBot);
            return "finished";
        }
    }

    function clickHandlerBoardPlayers(e) {
        const index = e.target.dataset.index;
        const [row, column] = index.split(",");

        const currentPlayer = GameController.getActivePlayer();
        GameController.playMove(row, column);

        renderBoard(root);

        determineStatus(currentPlayer);
    }

    function clickHandlerBoardBot(e) {
        const index = e.target.dataset.index;
        const [row, column] = index.split(",");

        const currentPlayer = GameController.getActivePlayer();
        const played = GameController.playMove(row, column);

        renderBoard(root);

        const status = determineStatus(currentPlayer);

        if (played && status != "finished") {
            root.removeEventListener("click", clickHandlerBoardPlayers);
            root.removeEventListener("click", clickHandlerBoardBot);

            setTimeout(() => {
                const bot = GameController.getActivePlayer();

                GameController.playAI();

                renderBoard(root);

                determineStatus(bot);
            }, 500);
        }
    }

    renderBoard(root);
}

ScreenController();
