let time_count = 0;

const recurDivVertical = (board, speed, weight, setVisualizing) => {
  let no_of_rows = board.length;
  let no_of_cols = board[0].length;

  let wait_time_factor = 20;
  if (speed === "fast") {
    wait_time_factor = 30;
  } else if (speed === "normal") {
    wait_time_factor = 60;
  } else if (speed === "slow") {
    wait_time_factor = 100;
  }

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
      board[i][j].isCheckpoint_visited = false;
      board[i][j].weight = 1;
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited_to_checkpoint");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-vl");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-l");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-m");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-h");
      document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-vh");
    }
  }

  let row_range = { from: 0, to: no_of_rows - 1 };
  let col_range = { from: 0, to: no_of_cols - 1 };
  time_count = 0;

  divideChamber(board, row_range, col_range, 0, wait_time_factor);
  setTimeout(() => {
    setVisualizing(false);
  }, time_count * wait_time_factor);
}

const randomNumber = (from, to, avoid) => {
  if (avoid.length === 0) {
    return Math.floor(from + (Math.random() * (to - from)));
  }
  let arr = [];
  for (let i = from; i <= to; i++) {
    if (!avoid.includes(i)) {
      arr.push(i);
    }
  }
  if (arr.length > 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  } else {
    return -1;
  }
}

//ROW_OR_COL : 0 -> ROW  |  1 -> COL
const divideChamber = (board, row_range, col_range, row_or_col, wait_time_factor) => {
  if (row_range.to - row_range.from < 2 || col_range.to - col_range.from < 2) {
    return;
  }

  let BOARD_ROWS = board.length;
  let BOARD_COLS = board[0].length;

  let random_line = 0;
  let random_cell = 0;

  let doors = {
    top: -1,
    left: -1,
    right: -1,
    bottom: -1
  }
  if ((row_range.from) - 1 >= 0) {
    for (let d = col_range.from; d <= col_range.to; d++) {
      if (!board[row_range.from - 1][d].isWall) {
        doors.top = d;
      }
    }
  }
  if ((row_range.to) + 1 < BOARD_ROWS) {
    for (let d = col_range.from; d <= col_range.to; d++) {
      if (!board[row_range.to + 1][d].isWall) {
        doors.bottom = d;
      }
    }
  }
  if ((col_range.from) - 1 >= 0) {
    for (let d = row_range.from; d <= row_range.to; d++) {
      if (!board[d][col_range.from - 1].isWall) {
        doors.left = d;
      }
    }
  }
  if ((col_range.to) + 1 < BOARD_COLS) {
    for (let d = row_range.from; d <= row_range.to; d++) {
      if (!board[d][col_range.to + 1].isWall) {
        doors.right = d;
      }
    }
  }
  if (Math.random() > 0.25) {
    row_or_col = 1;
  } else {
    row_or_col = 0;
  }
  if (row_or_col === 0) {
    //ROW-WISE
    random_line = randomNumber(row_range.from + 1, row_range.to - 1, [doors.left, doors.right]);
    if (random_line === -1) {
      return;
    }
    random_cell = randomNumber(col_range.from, col_range.to, []);

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

    let row_range1 = {
      from: row_range.from,
      to: random_line - 1
    }
    if (col_range.to - col_range.from > row_range1.to - row_range1.from) {
      divideChamber(board, row_range1, col_range, 1, wait_time_factor);
    } else {
      divideChamber(board, row_range1, col_range, 0, wait_time_factor);
    }
    let row_range2 = {
      from: random_line + 1,
      to: row_range.to
    }
    if (col_range.to - col_range.from > row_range2.to - row_range2.from) {
      divideChamber(board, row_range2, col_range, 1, wait_time_factor);
    } else {
      divideChamber(board, row_range2, col_range, 0, wait_time_factor);
    }
  } else if (row_or_col === 1) {
    //COL-WISE
    random_line = randomNumber(col_range.from + 1, col_range.to - 1, [doors.top, doors.bottom]);
    if (random_line === -1) {
      return;
    }
    random_cell = randomNumber(row_range.from, row_range.to, []);

    for (let i = row_range.from; i <= row_range.to; i++) {
      if (!(board[i][random_line].isStart) && !(board[i][random_line].isEnd)) {
        if (random_cell !== i) {
          board[i][random_line].isWall = true;
          setTimeout(() => {
            document.querySelector(`#cell-${i}-${random_line} .cell`).classList.add("wall");
          }, time_count * wait_time_factor);
          time_count++;
        }
      }
    }

    let col_range1 = {
      from: col_range.from,
      to: random_line - 1
    }
    if (row_range.to - row_range.from > col_range1.to - col_range1.from) {
      divideChamber(board, row_range, col_range1, 0, wait_time_factor);
    } else {
      divideChamber(board, row_range, col_range1, 1, wait_time_factor);
    }
    let col_range2 = {
      from: random_line + 1,
      to: col_range.to
    }
    if (row_range.to - row_range.from > col_range2.to - col_range2.from) {
      divideChamber(board, row_range, col_range2, 0, wait_time_factor);
    } else {
      divideChamber(board, row_range, col_range2, 1, wait_time_factor);
    }
  }
}

export default recurDivVertical;