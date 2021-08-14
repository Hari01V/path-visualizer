let time_count = 0;

const weightHexCage = (board, speed, weight, setVisualizing) => {
  // let currWeight = 20;
  // let currWeight_class = "weight-m";
  let { currWeight, currWeight_class } = chooseWeight_Class(weight);

  let no_of_rows = board.length;
  let no_of_cols = board[0].length;

  let wait_time_factor = 60;
  if (speed === "fast") {
    wait_time_factor = 60;
  } else if (speed === "normal") {
    wait_time_factor = 100;
  } else if (speed === "slow") {
    wait_time_factor = 140;
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

  for (let j = 0; j < no_of_cols; j++) {
    let tmp1 = Math.abs((j % 6) - 3);
    if (tmp1 < no_of_rows && !board[tmp1][j].isStart && !board[tmp1][j].isEnd && !board[tmp1][j].isCheckPoint) {
      board[tmp1][j].weight = currWeight;
      setTimeout(() => {
        document.querySelector(`#cell-${tmp1}-${j} .cell`).classList.add(currWeight_class);
      }, time_count * wait_time_factor);
    }

    let tmp2 = Math.abs(7 - tmp1);
    if (tmp2 < no_of_rows && !board[tmp2][j].isStart && !board[tmp2][j].isEnd && !board[tmp2][j].isCheckPoint) {
      board[tmp2][j].weight = currWeight;
      setTimeout(() => {
        document.querySelector(`#cell-${tmp2}-${j} .cell`).classList.add(currWeight_class);
      }, time_count * wait_time_factor);
    }

    let tmp3 = 8 + tmp1;
    if (tmp3 < no_of_rows && !board[tmp3][j].isStart && !board[tmp3][j].isEnd && !board[tmp3][j].isCheckPoint) {
      board[tmp3][j].weight = currWeight;
      setTimeout(() => {
        document.querySelector(`#cell-${tmp3}-${j} .cell`).classList.add(currWeight_class);
      }, time_count * wait_time_factor);
    }

    let tmp4 = Math.abs(15 - tmp1);
    if (tmp4 < no_of_rows && !board[tmp4][j].isStart && !board[tmp4][j].isEnd && !board[tmp4][j].isCheckPoint) {
      board[tmp4][j].weight = currWeight;
      setTimeout(() => {
        document.querySelector(`#cell-${tmp4}-${j} .cell`).classList.add(currWeight_class);
      }, time_count * wait_time_factor);
    }

    let tmp5 = 16 + tmp1;
    if (tmp5 < no_of_rows && !board[tmp5][j].isStart && !board[tmp5][j].isEnd && !board[tmp5][j].isCheckPoint) {
      board[tmp5][j].weight = currWeight;
      setTimeout(() => {
        document.querySelector(`#cell-${tmp5}-${j} .cell`).classList.add(currWeight_class);
      }, time_count * wait_time_factor);
    }

    let tmp6 = Math.abs(23 - tmp1);
    if (tmp6 < no_of_rows && !board[tmp6][j].isStart && !board[tmp6][j].isEnd && !board[tmp6][j].isCheckPoint) {
      board[tmp6][j].weight = currWeight;
      setTimeout(() => {
        document.querySelector(`#cell-${tmp6}-${j} .cell`).classList.add(currWeight_class);
      }, time_count * wait_time_factor);
    }

    time_count++;
  }
  setTimeout(() => {
    setVisualizing(false);
  }, time_count * wait_time_factor);
}

const chooseWeight_Class = (weight) => {
  let currWeight = weight;
  let currWeight_class = "";
  if (weight === 5) {
    currWeight_class = "weight-vl";
  } else if (weight === 10) {
    currWeight_class = "weight-l";
  } else if (weight === 20) {
    currWeight_class = "weight-m";
  } else if (weight === 30) {
    currWeight_class = "weight-h";
  } else if (weight === 50) {
    currWeight_class = "weight-vh";
  }
  return { currWeight, currWeight_class };
}

export default weightHexCage;