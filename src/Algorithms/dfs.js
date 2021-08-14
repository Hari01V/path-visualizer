const visualize_DFS = (board, setVisualizing, speed, setResult) => {
  let result = {
    algorithm: "Depth First Search",
    visited_nodes: 0,
    time_taken: 0,
    path_cost: 0
  }

  const t0 = performance.now();
  let no_of_rows = board.length;
  let no_of_cols = board[0].length;
  let CHECKPOINT = null;

  let start_node = null;
  let end_node = null;
  for (let i = 0; i < no_of_rows; i++) {
    for (let j = 0; j < no_of_cols; j++) {
      if (board[i][j].isStart) {
        start_node = board[i][j];
      } else if (board[i][j].isEnd) {
        end_node = board[i][j];
      }
      if (board[i][j].isCheckPoint) {
        CHECKPOINT = { row: i, col: j };
      }
    }
  }

  let wait_time_factor = 20;
  if (speed === "fast") {
    wait_time_factor = 30;
  } else if (speed === "normal") {
    wait_time_factor = 60;
  } else if (speed === "slow") {
    wait_time_factor = 200;
  }

  //DFS & PATH
  let final_path = null;
  let final_time_count = 1;
  if (CHECKPOINT === null) {
    const { path, count_visited_nodes, time_count } = dfs_algorithm(start_node, wait_time_factor, "end_node", board, no_of_rows, no_of_cols, 1);
    result.visited_nodes = count_visited_nodes;

    const t1 = performance.now();
    result.time_taken = (t1 - t0).toFixed(3);

    final_time_count = time_count;
    final_path = backtrackPath(path, "end");

    result.path_cost = final_path.length;
  } else {
    const till_checkpoint = dfs_algorithm(start_node, wait_time_factor, "checkpoint", board, no_of_rows, no_of_cols, 1);

    const till_end = dfs_algorithm(board[CHECKPOINT.row][CHECKPOINT.col], wait_time_factor, "end_node", board, no_of_rows, no_of_cols, till_checkpoint.time_count);

    result.visited_nodes = till_checkpoint.count_visited_nodes + till_end.count_visited_nodes;

    const t1 = performance.now();
    result.time_taken = (t1 - t0).toFixed(3);

    final_time_count = till_end.time_count;

    let path_to_checkpoint = backtrackPath(till_checkpoint.path, "checkpoint");
    let path_to_end = backtrackPath(till_end.path, "end");
    final_path = path_to_end;
    for (const path_node of path_to_checkpoint) {
      final_path.push(path_node);
    }
    result.path_cost = final_path.length - 1;
  }

  //PATH
  let pathCost = 0;
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
}

const dfs_algorithm = (from_node, wait_time_factor, condition, board, no_of_rows, no_of_cols, time_count) => {
  //DFS ALGO
  let neighbours = [from_node];
  let visited_layer_css = condition === "checkpoint" ? "visited_to_checkpoint" : "visited";
  let isGoalReached = false;
  let count_visited_nodes = 0;
  let path = [];

  while (!isGoalReached && neighbours.length > 0) {
    let currNode = neighbours.pop();
    path.push(currNode);
    if (condition === "end_node") {
      board[currNode.row][currNode.col].isVisited = true;
      currNode.isVisited = true;
    } else if (condition === "checkpoint") {
      board[currNode.row][currNode.col].isCheckpoint_visited = true;
      currNode.isCheckpoint_visited = true;
    }
    setTimeout(() => {
      document.querySelector(`#cell-${currNode.row}-${currNode.col} .cell`).classList.add(visited_layer_css);
    }, wait_time_factor * time_count);
    time_count++;
    count_visited_nodes++;

    if (condition === "end_node" && currNode.isEnd) {
      isGoalReached = true;
      break;
    } else if (condition === "checkpoint" && currNode.isCheckPoint) {
      isGoalReached = true;
      break;
    }

    let neighbour_nodes = find_neighbours(currNode, no_of_rows, no_of_cols, board);
    for (let node of neighbour_nodes) {
      let { row, col, isWall, isVisited, isStart, isEnd, isCheckPoint, isCheckpoint_visited } = node;
      if (!isStart) {
        node = {
          ...node, parent: {
            row: currNode.row,
            col: currNode.col
          }
        };
      }
      if (condition === "end_node") {
        if ((!isWall || isEnd) && !isVisited && !isStart && !isCheckPoint) {
          neighbours.push(node);
        }
      } else if (condition === "checkpoint") {
        if ((!isWall || isCheckPoint) && !isCheckpoint_visited && !isStart) {
          neighbours.push(node);
        }
      }
    }
  }
  return { path: path, count_visited_nodes: count_visited_nodes, time_count: time_count };
}

const backtrackPath = (neighbours, to) => {
  let path = [];
  let neighbours_size = neighbours.length;
  let count = neighbours_size - 1;
  if (to === "checkpoint") {
    if (neighbours[neighbours_size - 1].isCheckPoint) {
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
  } else if (to === "end") {
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
  }
  path.push(neighbours[0]);
  return path;
}

const find_neighbours = (node, rows, cols, board) => {
  let { row, col } = node;
  let arr = [];
  if (col + 1 < cols && !board[row][col + 1].isVisited) {
    arr.push(board[row][col + 1]);
  }
  if (row + 1 < rows && !board[row + 1][col].isVisited) {
    arr.push(board[row + 1][col]);
  }
  if (col - 1 >= 0 && !board[row][col - 1].isVisited) {
    arr.push(board[row][col - 1]);
  }
  if (row - 1 >= 0 && !board[row - 1][col].isVisited) {
    arr.push(board[row - 1][col]);
  }
  return arr;
}

export default visualize_DFS;