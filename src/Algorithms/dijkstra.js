const visualize_Dijkstra = (board, setVisualizing, speed, setResult) => {
  let result = {
    algorithm: "Breadth First Search",
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

  //DIJKSTRA & PATH
  let final_path = null;
  let final_time_count = 1;
  if (CHECKPOINT === null) {
    const { neighbours, count_visited_nodes, time_count } = dijkstra_algorithm(start_node, wait_time_factor, "end_node", board, no_of_rows, no_of_cols, 1);
    result.visited_nodes = count_visited_nodes;

    const t1 = performance.now();
    result.time_taken = (t1 - t0).toFixed(3);

    final_time_count = time_count;
    final_path = backtrackPath(neighbours, "end");

    result.path_cost = final_path.length;
  } else {
    const till_checkpoint = dijkstra_algorithm(start_node, wait_time_factor, "checkpoint", board, no_of_rows, no_of_cols, 1);

    const till_end = dijkstra_algorithm(board[CHECKPOINT.row][CHECKPOINT.col], wait_time_factor, "end_node", board, no_of_rows, no_of_cols, till_checkpoint.time_count);

    result.visited_nodes = till_checkpoint.count_visited_nodes + till_end.count_visited_nodes;

    const t1 = performance.now();
    result.time_taken = (t1 - t0).toFixed(3);

    final_time_count = till_end.time_count;

    let path_to_checkpoint = backtrackPath(till_checkpoint.neighbours, "checkpoint");
    let path_to_end = backtrackPath(till_end.neighbours, "end");
    final_path = path_to_end;
    for (const path_node of path_to_checkpoint) {
      final_path.push(path_node);
    }

    result.path_cost = final_path.length - 1;
  }


  //PATH
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

const compareDescendingOrder = (a, b) => {
  if (b.cummulativeSum === a.cummulativeSum) {
    let b_sum = b.row + b.col;
    let a_sum = a.row + a.col;
    if (b_sum === a_sum) {
      return a.col - b.col;

    } else {
      return b_sum - a_sum;
    }
  }
  return b.cummulativeSum - a.cummulativeSum;
}

const dijkstra_algorithm = (from_node, wait_time_factor, condition, board, no_of_rows, no_of_cols, time_count) => {
  //DIJKSTRA ALGO
  let neighbours = [{ ...from_node, cummulativeSum: 0 }];
  let nodes_been_to_SPT = new Set([]);
  let shortestPathTree = [{ ...from_node, cummulativeSum: 0 }];
  nodes_been_to_SPT.add(`${from_node.row}-${from_node.col}`);
  let visited_layer_css = condition === "checkpoint" ? "visited_to_checkpoint" : "visited";
  setTimeout(() => {
    document.querySelector(`#cell-${from_node.row}-${from_node.col} .cell`).classList.add(visited_layer_css);
  }, wait_time_factor * time_count);
  let isGoalReached = false;
  let count_visited_nodes = 0;

  while (!isGoalReached && shortestPathTree.length > 0) {
    const choseNode = shortestPathTree.pop();
    if (condition === "end_node") {
      board[choseNode.row][choseNode.col].isVisited = true;
      choseNode.isVisited = true;
    } else if (condition === "checkpoint") {
      board[choseNode.row][choseNode.col].isCheckpoint_visited = true;
      choseNode.isCheckpoint_visited = true;
    }
    neighbours.push(choseNode);
    count_visited_nodes++;
    setTimeout(() => {
      document.querySelector(`#cell-${choseNode.row}-${choseNode.col} .cell`).classList.add(visited_layer_css);
    }, wait_time_factor * time_count);
    time_count++;
    if (condition === "end_node" && board[choseNode.row][choseNode.col].isEnd) {
      neighbours.push(choseNode);
      isGoalReached = true;
      break;
    } else if (condition === "checkpoint" && board[choseNode.row][choseNode.col].isCheckPoint) {
      neighbours.push(choseNode);
      isGoalReached = true;
      break;
    }
    //add visited class
    let neighbour_nodes = find_neighbours(choseNode, no_of_rows, no_of_cols, board);
    for (let node of neighbour_nodes) {
      let { row, col, isWall, isVisited, isStart, isEnd, isCheckPoint, isCheckpoint_visited, weight } = node;
      if (!isStart) {
        node = {
          ...node, parent: {
            row: choseNode.row,
            col: choseNode.col
          },
          cummulativeSum: choseNode.cummulativeSum + weight,
        };
      }
      if (condition === "end_node") {
        if (!isWall && !isVisited && !isStart && !isCheckPoint && !nodes_been_to_SPT.has(`${row}-${col}`)) {
          nodes_been_to_SPT.add(`${row}-${col}`);
          shortestPathTree.push(node);
          // neighbours.push(node);
        }
      } else if (condition === "checkpoint") {
        if (!isWall && !isCheckpoint_visited && !isStart && !nodes_been_to_SPT.has(`${row}-${col}`)) {
          nodes_been_to_SPT.add(`${row}-${col}`);
          shortestPathTree.push(node);
          //   neighbours.push(node);
        }
      }
    }
    shortestPathTree.sort(compareDescendingOrder);
  }
  return { neighbours: neighbours, count_visited_nodes: count_visited_nodes, time_count: time_count };
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
        if (node.isCheckPoint) {
          break;
        }
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

export default visualize_Dijkstra;