const root = document.querySelector("#board")

const Gameboard = (function() {
    const gameboard = [
        ["X", "O", " "],
        ["O", " ", "X"],
        ["O", "X", "O"],
    ];

    function render(board) {
        for (let row = 0; row < gameboard.length; row++) {
            const boardRow = document.createElement("div");

            for (let column = 0; column < gameboard[row].length; column++) {
                const field = document.createElement("div");
                field.textContent = gameboard[row][column];

                boardRow.appendChild(field);
            }
            boardRow.classList.add("row");
            board.appendChild(boardRow);
        }
    }

    return {
        render
    }
})();

Gameboard.render(root);
