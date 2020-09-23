/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const startGame = document.getElementById("startGame");
startGame.addEventListener("submit", beginGame);
let WIDTH = 7;
let HEIGHT = 6;
let player1 = document.getElementById("p1");
let player2 = document.getElementById("p2");

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */


function beginGame(evt){
  evt.preventDefault();
  const widthInput = document.getElementById("boardWidthInput");
  const heightInput = document.getElementById("boardHeightInput");

  WIDTH = widthInput.value;
  HEIGHT = heightInput.value;

  if (!document.getElementById("column-top")){
    makeBoard();
    makeHtmlBoard();
  }
}

function restartGame(e){
  window.location.reload();
}

function makeBoard() {
  for(let y = 0; y < HEIGHT; y++){
    board.push([]);
    for(let x = 0; x < WIDTH; x++){
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");
  // create the top row of the board and listen for clicks on the row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create rows of the board with the number of rows = HEIGHT and the number of columns = WIDTH
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
  const restartBtn = document.createElement("button");
  const gameDiv = document.getElementById("game");
  restartBtn.setAttribute("id", "restartBtn");
  restartBtn.innerText = "Restart";
  restartBtn.addEventListener("click", restartGame);
  gameDiv.append(restartBtn);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(let y = HEIGHT-1; y >= 0; y--){
    if (!board[y][x]){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const cell = document.getElementById(`${y}-${x}`);
  const newDiv = document.createElement('div');
  let player = "";
  if (currPlayer === 1){
    player = "p1";
  } else{
    player = "p2";
  }
  newDiv.className = "piece " + player;
  cell.append(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))){
    return endGame("The game is a tie!");
  };

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  
  if(currPlayer === 1){
    player1.classList.add("currentPlayer");
    player2.classList.remove("currentPlayer");
  }else{
    player2.classList.add("currentPlayer")
    player1.classList.remove("currentPlayer")
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

