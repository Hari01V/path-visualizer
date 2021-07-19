let time_count = 0;

const recursiveDivision = (board) => {
  console.log("RECURSIVE DIVISION");
  let no_of_rows = board.length;
  let no_of_cols = board[0].length;

  let start_node = null;
  let end_node = null;
  for (let i = 0; i < no_of_rows; i++) {
    for (let j = 0; j < no_of_cols; j++) {
      if (board[i][j].isStart) {
        start_node = board[i][j];
      } else if (board[i][j].isEnd) {
        end_node = board[i][j];
      }
      board[i][j].isWall = false;
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("wall");
      board[i][j].isVisited = false;
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
    }
  }

  let row_range = { from: 0, to: no_of_rows - 1 };
  let col_range = { from: 0, to: no_of_cols - 1 };
  time_count = 0;
  divideChamber(board, row_range, col_range, 0);
}

const randomNumber = (from, to) => {
  return Math.floor(from + (Math.random() * (to - from)));
}


//ROW_OR_COL : 0 -> ROW  |  1 -> COL
const divideChamber = (board, row_range, col_range, row_or_col) => {
  if (row_range.to - row_range.from < 2 || col_range.to - col_range.from < 2) {
    return;
  }

  let random_line = 0;
  let random_cell = 0;
  let wait_time_factor = 20;
  if (row_or_col === 0) {
    //ROW-WISE

    random_line = randomNumber(row_range.from + 1, row_range.to - 1);
    random_cell = randomNumber(col_range.from, col_range.to);

    for (let i = col_range.from; i <= col_range.to; i++) {
      if (!(board[random_line][i].isStart) && !(board[random_line][i].isEnd)) {
        // if (random_cell !== i) {
        board[random_line][i].isWall = true;
        setTimeout(() => {
          document.querySelector(`#cell-${random_line}-${i} .cell`).classList.add("wall");
        }, time_count * wait_time_factor);
        time_count++;
        // }
      }
    }

    let row_range1 = {
      from: row_range.from,
      to: random_line - 1
    }
    if (col_range.to - col_range.from > row_range1.to - row_range1.from) {
      divideChamber(board, row_range1, col_range, 1);
    } else {
      divideChamber(board, row_range1, col_range, 0);
    }
    let row_range2 = {
      from: random_line + 1,
      to: row_range.to
    }
    if (col_range.to - col_range.from > row_range2.to - row_range2.from) {
      divideChamber(board, row_range2, col_range, 1);
    } else {
      divideChamber(board, row_range2, col_range, 0);
    }
  } else if (row_or_col === 1) {
    //COL-WISE
    random_line = randomNumber(col_range.from + 1, col_range.to - 1);
    random_cell = randomNumber(row_range.from, row_range.to);

    for (let i = row_range.from; i <= row_range.to; i++) {
      if (!(board[i][random_line].isStart) && !(board[i][random_line].isEnd)) {
        // if (random_cell !== i) {
        board[i][random_line].isWall = true;
        setTimeout(() => {
          document.querySelector(`#cell-${i}-${random_line} .cell`).classList.add("wall");
        }, time_count * wait_time_factor);
        time_count++;
        // }
      }
    }

    let col_range1 = {
      from: col_range.from,
      to: random_line - 1
    }
    if (row_range.to - row_range.from > col_range1.to - col_range1.from) {
      divideChamber(board, row_range, col_range1, 0);
    } else {
      divideChamber(board, row_range, col_range1, 1);
    }
    let col_range2 = {
      from: random_line + 1,
      to: col_range.to
    }
    if (row_range.to - row_range.from > col_range2.to - col_range2.from) {
      divideChamber(board, row_range, col_range2, 0);
    } else {
      divideChamber(board, row_range, col_range2, 1);
    }
  }
}

export default recursiveDivision;