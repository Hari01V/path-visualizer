let time_count = 0;

const concentricMaze = (board, speed, weight, setVisualizing) => {
  let no_of_rows = board.length;
  let no_of_cols = board[0].length;

  let wait_time_factor = 20;
  if (speed === "fast") {
    wait_time_factor = 10;
  } else if (speed === "normal") {
    wait_time_factor = 30;
  } else if (speed === "slow") {
    wait_time_factor = 60;
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

  let middle_row = row_range.to / 2;
  let middle_col = col_range.to / 2;
  let center = {
    row: randomNumber(middle_row - 5, middle_row + 5),
    col: randomNumber(middle_col - 10, middle_col + 10)
  }
  console.log(center);
  let distance = 1;
  while (distance < col_range.to) {
    let i_from = Math.max(row_range.from, center.row - distance);
    let i_to = Math.min(row_range.to, center.row + distance);
    let i_leave = randomNumber(i_from, i_to);
    let col_leave = randomNumber((center.col - distance) >= 0 ? center.col - distance : 0,
      (center.col + distance) < col_range.to ? center.col + distance : col_range.to);
    for (let i = i_from; i <= i_to; i++) {
      if (i == i_leave) {
        continue;
      }
      let col1 = center.col + Math.abs(distance - Math.abs(center.row - i));
      let col2 = center.col - Math.abs(distance - Math.abs(center.row - i));
      if (col1 == col_leave || col2 == col_leave) {
        continue;
      }
      if (col1 <= col_range.to && col1 >= col_range.from && !board[i][col1].isStart && !board[i][col1].isEnd) {
        board[i][col1].isWall = true;
        setTimeout(() => {
          document.querySelector(`#cell-${i}-${col1} .cell`).classList.add("wall");
        }, time_count * wait_time_factor);
        time_count++;
      }
      if (col2 <= col_range.to && col2 >= col_range.from && !board[i][col2].isStart && !board[i][col2].isEnd) {
        board[i][col2].isWall = true;
        setTimeout(() => {
          document.querySelector(`#cell-${i}-${col2} .cell`).classList.add("wall");
        }, time_count * wait_time_factor);
        time_count++;
      }
    }
    distance = distance + 5;
  }

  setTimeout(() => {
    setVisualizing(false);
  }, time_count * wait_time_factor);
}

const randomNumber = (from, to) => {
  return Math.floor(from + (Math.random() * (to - from)));
}

export default concentricMaze;