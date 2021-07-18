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
  divideChamber(board, row_range, col_range);
}

const divideChamber = (board, row_range, col_range) => {
  const row_or_col = Math.floor(Math.random() * 2);
  let random_line = 0;
  let random_cell = 0;
  let wait_time_factor = 20;
  let time_count = 0;
  if (row_or_col === 0) {
    //ROW-WISE
    random_line = Math.floor(row_range.from + (Math.random() * (row_range.to - row_range.from)));
    random_cell = Math.floor(col_range.from + (Math.random() * (col_range.to - col_range.from)));

    for (let i = col_range.from; i <= col_range.to; i++) {
      if (!(board[random_line][i].isStart) && !(board[random_line][i].isEnd)) {
        if (random_cell !== i) {
          board[random_line][i].isWall = true;
          setTimeout(() => {
            document.querySelector(`#cell-${random_line}-${i} .cell`).classList.add("wall");
          }, time_count * wait_time_factor);
          time_count++;
        }
      }
    }
  } else if (row_or_col === 1) {
    //COL-WISE
    random_line = Math.floor(col_range.from + (Math.random() * (col_range.to - col_range.from)));
    random_cell = Math.floor(row_range.from + (Math.random() * (row_range.to - row_range.from)));

    for (let i = row_range.from; i <= row_range.to; i++) {
      if (!(board[i][random_line].isStart) && !(board[i][random_line].isEnd)) {
        if (random_cell !== i) {
          board[i][random_line].isWall = random_cell !== i;
          setTimeout(() => {
            document.querySelector(`#cell-${i}-${random_line} .cell`).classList.add("wall");
          }, time_count * wait_time_factor);
          time_count++;
        }
      }
    }
  }
}

export default recursiveDivision;