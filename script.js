const root = document.querySelector("#board")

const Gameboard = (function() {
    const gameboard = [
        ["X", "O", ""],
        ["O", "", "X"],
        ["O", "X", "O"],
    ];

    function addMark(cell, player) {
        if (!cell.textContent) {
            cell.textContent = player;
        }
    }

    function render(board) {
        for (let row = 0; row < gameboard.length; row++) {
            const boardRow = document.createElement("div");

            for (let column = 0; column < gameboard[row].length; column++) {
                const boardCell = document.createElement("div");

                boardCell.textContent = gameboard[row][column];
                boardCell.classList.add("cell"); 

                const cellIndex = `${row}${column}`;
                boardCell.dataset.index = cellIndex;

                boardCell.addEventListener("click", () => addMark(boardCell, "X"))

                boardRow.appendChild(boardCell);
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
