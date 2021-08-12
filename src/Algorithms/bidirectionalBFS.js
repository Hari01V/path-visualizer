const visualize_biBFS = (board, setVisualizing, speed, setResult) => {
  let result = {
    algorithm: "Bi-Directional Breadth First Search",
    visited_nodes: 0,
    time_taken: 0,
    path_cost: 0
  }

  const t0 = performance.now();
  let no_of_rows = board.length;
  let no_of_cols = board[0].length;
  let CHECKPOINT = null;

  let tmpBoard = [];
  let start_node = null;
  let end_node = null;
  for (let i = 0; i < no_of_rows; i++) {
    let tmpRow = [];
    for (let j = 0; j < no_of_cols; j++) {
      if (board[i][j].isStart) {
        start_node = board[i][j];
      } else if (board[i][j].isEnd) {
        end_node = board[i][j];
      }
      tmpRow.push({ ...board[i][j], visited_from_start: false, visited_from_end: false });
    }
    tmpBoard.push(tmpRow);
  }

  let wait_time_factor = 20;
  if (speed === "fast") {
    wait_time_factor = 30;
  } else if (speed === "normal") {
    wait_time_factor = 60;
  } else if (speed === "slow") {
    wait_time_factor = 200;
  }

  //BIBFS & PATH
  let final_path = null;
  let final_time_count = 1;
  const { queue_from_start, queue_from_end, intersection_node, count_visited_nodes, time_count } = bibfs_algorithm(start_node, end_node, wait_time_factor, board, tmpBoard, no_of_rows, no_of_cols, 1);
  result.visited_nodes = count_visited_nodes;

  const t1 = performance.now();
  result.time_taken = (t1 - t0).toFixed(3);

  final_time_count = time_count;
  final_path = backtrackPath(queue_from_start, queue_from_end, intersection_node);
  result.path_cost = final_path.length;

  // PATH
  for (let i = final_path.length - 1; i >= 0; i--) {
    let { row, col } = final_path[i];
    setTimeout(() => {
      document.querySelector(`#cell-${row}-${col} .cell`).classList.add("path");
      if (i == 0) {
        setVisualizing(false);
        setResult(result);
      }
    }, wait_time_factor * final_time_count);
    final_time_count++;
  }
  // for (let i = 0; i < final_path.length - 1; i++) {
  //   let { row, col } = final_path[i];
  //   setTimeout(() => {
  //     document.querySelector(`#cell-${row}-${col} .cell`).classList.add("path");
  //     if (i == 0) {
  //       setVisualizing(false);
  //       setResult(result);
  //     }
  //   }, wait_time_factor * final_time_count);
  //   final_time_count++;
  // }
}

const bibfs_algorithm = (from_node, end_node, wait_time_factor, board, tmpBoard, no_of_rows, no_of_cols, time_count) => {
  //BIBFS ALGO
  let queue_from_start = [from_node];
  let queue_from_end = [end_node];
  let intersection_node = null;
  let time_count_from_start = time_count;
  let time_count_from_end = time_count;

  setTimeout(() => {
    document.querySelector(`#cell-${from_node.row}-${from_node.col} .cell`).classList.add("visited");
    document.querySelector(`#cell-${end_node.row}-${end_node.col} .cell`).classList.add("visited");
  }, wait_time_factor * time_count);
  let isGoalReached = false;
  var count_from_start = 0;
  var count_from_end = 0;
  let count_visited_nodes = 0;

  while (!isGoalReached) {
    //FROM START POINT
    let neighbours_start = find_neighbours(queue_from_start[count_from_start], no_of_rows, no_of_cols, board);

    for (let node of neighbours_start) {
      let { row, col, isWall, isVisited, isStart, isEnd, isCheckPoint, isCheckpoint_visited } = node;
      if (!isStart) {
        node = {
          ...node, parent: {
            row: queue_from_start[count_from_start].row,
            col: queue_from_start[count_from_start].col
          }
        };
      }
      if (tmpBoard[row][col].visited_from_end) {
        queue_from_start.push(node);
        intersection_node = node;
        isGoalReached = true;
        break;
      } else if (!isWall && !isVisited && !isStart) {
        queue_from_start.push(node);
        board[row][col].isVisited = true;
        tmpBoard[row][col].visited_from_start = true;
        count_visited_nodes++;
        setTimeout(() => {
          document.querySelector(`#cell-${row}-${col} .cell`).classList.add("visited");
        }, wait_time_factor * time_count_from_start);
        time_count_from_start++;
      }
    }
    count_from_start++;

    //FROM END POINT
    let neighbours_end = find_neighbours(queue_from_end[count_from_end], no_of_rows, no_of_cols, board);

    for (let node of neighbours_end) {
      let { row, col, isWall, isVisited, isStart, isEnd, isCheckPoint, isCheckpoint_visited } = node;
      if (!isStart) {
        node = {
          ...node, parent: {
            row: queue_from_end[count_from_end].row,
            col: queue_from_end[count_from_end].col
          }
        };
      }
      if (tmpBoard[row][col].visited_from_start) {
        queue_from_end.push(node);
        intersection_node = node;
        isGoalReached = true;
        break;
      } else if (!isWall && !isVisited && !isStart) {
        queue_from_end.push(node);
        board[row][col].isVisited = true;
        tmpBoard[row][col].visited_from_end = true;
        count_visited_nodes++;
        setTimeout(() => {
          document.querySelector(`#cell-${row}-${col} .cell`).classList.add("visited");
        }, wait_time_factor * time_count_from_end);
        time_count_from_end++;
      }
    }
    count_from_end++;
  }
  return {
    queue_from_start: queue_from_start,
    queue_from_end: queue_from_end,
    intersection_node: intersection_node,
    count_visited_nodes: count_visited_nodes,
    time_count: Math.max(time_count_from_start, time_count_from_end)
  };
}

const backtrackPath = (queue_from_start, queue_from_end, intersection_node) => {
  let path_intersection_to_end = [];
  let queue_end_size = queue_from_end.length;
  let count_end = queue_end_size - 1;

  let path_start_to_intersection = [];
  let queue_start_size = queue_from_start.length;
  let count_start = queue_start_size - 1;

  if (intersection_node.row === queue_from_end[queue_end_size - 1].row && intersection_node.col === queue_from_end[queue_end_size - 1].col) {
    while (queue_from_start[count_start].row !== intersection_node.row || queue_from_start[count_start].col !== intersection_node.col) {
      count_start--;
    }
  } else if (intersection_node.row === queue_from_start[queue_start_size - 1].row && intersection_node.col === queue_from_start[queue_start_size - 1].col) {
    while (queue_from_end[count_end].row !== intersection_node.row || queue_from_end[count_end].col !== intersection_node.col) {
      count_end--;
    }
  }

  let node = queue_from_end[count_end];
  while (!(node.isEnd) && count_end > 0) {
    path_intersection_to_end.push(node);
    let { row, col } = node.parent;
    //find parent
    while (count_end > 0 && (queue_from_end[count_end].row !== row || queue_from_end[count_end].col !== col)) {
      count_end--;
    }
    node = queue_from_end[count_end];
  }
  path_intersection_to_end.push(queue_from_end[0]);

  node = queue_from_start[count_start];
  while (!(node.isStart) && count_start > 0) {
    path_start_to_intersection.push(node);
    let { row, col } = node.parent;
    //find parent
    while (count_start > 0 && (queue_from_start[count_start].row !== row || queue_from_start[count_start].col !== col)) {
      count_start--;
    }
    node = queue_from_start[count_start];
  }
  path_start_to_intersection.push(queue_from_start[0]);
  let final_path = [];
  for (let k = path_intersection_to_end.length - 1; k >= 0; k--) {
    final_path.push(path_intersection_to_end[k]);
  }
  for (const path_node of path_start_to_intersection) {
    final_path.push(path_node);
  }
  return final_path;
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

export default visualize_biBFS;