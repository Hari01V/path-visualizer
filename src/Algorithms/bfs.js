const visualize_BFS = (board, setVisualizing) => {
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
    }
  }

  let neighbours = [start_node];
  document.querySelector(`#cell-${start_node.row}-${start_node.col} .cell`).classList.add("visited");
  let isGoalReached = false;
  var count = 0;
  let time_count = 1;
  let wait_time_factor = 20;
  while (!isGoalReached && count < neighbours.length) {
    let neighbour_nodes = find_neighbours(neighbours[count], no_of_rows, no_of_cols, board);
    for (let node of neighbour_nodes) {
      let { row, col, isWall, isVisited, isStart, isEnd } = node;
      if (!isStart) {
        node = {
          ...node, parent: {
            row: neighbours[count].row,
            col: neighbours[count].col
          }
        };
      }
      if (isEnd) {
        neighbours.push(node);
        isGoalReached = true;
        break;
      } else if (!isWall && !isVisited && !isStart) {
        neighbours.push(node);
        board[row][col].isVisited = true;
        setTimeout(() => {
          document.querySelector(`#cell-${row}-${col} .cell`).classList.add("visited");
        }, wait_time_factor * time_count);
        time_count++;
      }
    }
    count++;
  }

  const path = backtrackPath(neighbours);
  for (let i = path.length - 1; i >= 0; i--) {
    let { row, col } = path[i];
    setTimeout(() => {
      document.querySelector(`#cell-${row}-${col} .cell`).classList.add("path");
      if (i == 0) {
        setVisualizing(false);
      }
    }, wait_time_factor * time_count);
    time_count++;
  }
}

const backtrackPath = (neighbours) => {
  let path = [];
  let neighbours_size = neighbours.length;
  let count = neighbours_size - 1;
  if (neighbours[neighbours_size - 1].isEnd) {
    let node = neighbours[count];
    while (!(node.isStart) && count > 0) {
      path.push(node);
      let { row, col } = node.parent;
      //find parent
      while (count > 0 && (neighbours[count].row !== row || neighbours[count].col !== col)) {
        count--;
      }
      node = neighbours[count];
    }
  }
  path.push(neighbours[0]);
  return path;
}

const find_neighbours = (node, rows, cols, board) => {
  let { row, col } = node;
  let arr = [];
  if (col + 1 < cols) {
    arr.push(board[row][col + 1]);
  }
  if (row + 1 < rows) {
    arr.push(board[row + 1][col]);
  }
  if (col - 1 >= 0) {
    arr.push(board[row][col - 1]);
  }
  if (row - 1 >= 0) {
    arr.push(board[row - 1][col]);
  }
  return arr;
}

export default visualize_BFS;