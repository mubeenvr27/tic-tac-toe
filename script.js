const Gameboard = (function() {
    let board = Array(9).fill(null);

    const getBoard = () => [...board];

    const setCell = (index, mark) => {
        if (board[index] === null) {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = Array(9).fill(null);
    };

    return { getBoard, setCell, reset };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const GameController = (function() {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = false;

    const startGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name || "Player 1", "X"),
            Player(player2Name || "Player 2", "O")
        ];
        currentPlayerIndex = 0;
        gameActive = true;
        Gameboard.reset();
        DisplayController.renderBoard();
        document.getElementById("result").textContent = "";
    };

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const checkWin = (board) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6] // Diagonals
        ];
        return winConditions.some(condition =>
            condition.every(index => board[index] && board[index] === board[condition[0]])
        );
    };

    const checkTie = (board) => board.every(cell => cell !== null);

    const playTurn = (index) => {
        if (!gameActive || !Gameboard.setCell(index, players[currentPlayerIndex].mark)) return;

        const currentBoard = Gameboard.getBoard();
        if (checkWin(currentBoard)) {
            gameActive = false;
            DisplayController.renderBoard();
            document.getElementById("result").textContent = `${players[currentPlayerIndex].name} wins!`;
        } else if (checkTie(currentBoard)) {
            gameActive = false;
            DisplayController.renderBoard();
            document.getElementById("result").textContent = "It's a tie!";
        } else {
            switchPlayer();
            DisplayController.renderBoard();
        }
    };

    const resetGame = () => {
        players = [];
        currentPlayerIndex = 0;
        gameActive = false;
        Gameboard.reset();
        DisplayController.renderBoard();
        document.getElementById("result").textContent = "";
    };

    return { startGame, playTurn, resetGame };
})();

const DisplayController = (function() {
    const gameBoardDiv = document.getElementById("game-board");
    const startBtn = document.getElementById("start-btn");

    const renderBoard = () => {
        gameBoardDiv.innerHTML = "";
        const board = Gameboard.getBoard();
        board.forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.textContent = cell || "";
            cellDiv.addEventListener("click", () => GameController.playTurn(index));
            gameBoardDiv.appendChild(cellDiv);
        });
    };

    startBtn.addEventListener("click", () => {
        const player1Input = document.getElementById("player1").value;
        const player2Input = document.getElementById("player2").value;
        GameController.startGame(player1Input, player2Input);
    });

    return { renderBoard };
})();

// Initial render for testing
DisplayController.renderBoard();