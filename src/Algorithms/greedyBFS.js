import weightHexCage from "../MazeAlgorithms/weightHexCage";

const visualize_greedy = (board, setVisualizing, speed, setResult) => {
  let result = {
    algorithm: "Greedy Best First Search",
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

  //GreedyBFS & PATH
  let final_path = null;
  let final_time_count = 1;
  if (CHECKPOINT === null) {
    const { CLOSED_LIST, count_visited_nodes, time_count } = greedy_algorithm(start_node, end_node, wait_time_factor, "end_node", board, no_of_rows, no_of_cols, 1);
    result.visited_nodes = count_visited_nodes;

    const t1 = performance.now();
    result.time_taken = (t1 - t0).toFixed(3);

    final_time_count = time_count;
    final_path = backtrackPath(CLOSED_LIST, "end");
  } else {
    const till_checkpoint = greedy_algorithm(start_node, CHECKPOINT, wait_time_factor, "checkpoint", board, no_of_rows, no_of_cols, 1);

    const till_end = greedy_algorithm(board[CHECKPOINT.row][CHECKPOINT.col], end_node, wait_time_factor, "end_node", board, no_of_rows, no_of_cols, till_checkpoint.time_count);

    result.visited_nodes = till_checkpoint.count_visited_nodes + till_end.count_visited_nodes;

    const t1 = performance.now();
    result.time_taken = (t1 - t0).toFixed(3);

    final_time_count = till_end.time_count;

    let path_to_checkpoint = backtrackPath(till_checkpoint.CLOSED_LIST, "checkpoint");
    let path_to_end = backtrackPath(till_end.CLOSED_LIST, "end");
    final_path = path_to_end;
    for (const path_node of path_to_checkpoint) {
      final_path.push(path_node);
    }
  }


  //PATH
  let pathCost = 0;
  for (let i = final_path.length - 1; i >= 0; i--) {
    let { row, col, weight } = final_path[i];
    pathCost += weight;
    setTimeout(() => {
      document.querySelector(`#cell-${row}-${col} .cell`).classList.add("path");
      if (i == 0) {
        setVisualizing(false);
        setResult(result);
      }
    }, wait_time_factor * final_time_count);
    final_time_count++;
  }
  result.path_cost = pathCost;
}

const compare_F_desc = (a, b) => {
  let a_f = a.g + a.h;
  let b_f = b.g + b.h;
  if (b_f === a_f) {
    if (b.h === a.h) {
      return b.g - a.g;
    }
    return b.h - a.h;
  }
  return b_f - a_f;
}

const manhattanDist = (a, b) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

const lowerF_in_list = (list, currNode) => {
  let { row, col, g, h } = currNode;
  const foundNode = list.find(node => node.row === row && node.col === col);
  if (!foundNode) {
    return false;
  } else {
    if ((foundNode.g + foundNode.h) <= (g + h)) {
      return true;
    } else {
      return false;
    }
  }
}

const greedy_algorithm = (from_node, end_node, wait_time_factor, condition, board, no_of_rows, no_of_cols, time_count) => {
  //GREEDY BFS ALGO
  let OPEN_LIST = [{ ...from_node, g: 0, h: 0 }];
  let CLOSED_LIST = [];
  let visited_layer_css = condition === "checkpoint" ? "visited_to_checkpoint" : "visited";
  setTimeout(() => {
    document.querySelector(`#cell-${from_node.row}-${from_node.col} .cell`).classList.add(visited_layer_css);
  }, wait_time_factor * time_count);
  let isGoalReached = false;
  let count_visited_nodes = 0;

  while (!isGoalReached && OPEN_LIST.length > 0) {
    //POP LOWEST f FROM OPEN_LIST
    let choseNode = OPEN_LIST.pop();

    if (condition === "end_node") {
      board[choseNode.row][choseNode.col].isVisited = true;
      choseNode.isVisited = true;
      if (board[choseNode.row][choseNode.col].isEnd) {
        CLOSED_LIST.push(choseNode);
        isGoalReached = true;
        break;
      }
    } else if (condition === "checkpoint") {
      board[choseNode.row][choseNode.col].isCheckpoint_visited = true;
      choseNode.isCheckpoint_visited = true;
      if (board[choseNode.row][choseNode.col].isCheckPoint) {
        CLOSED_LIST.push(choseNode);
        isGoalReached = true;
        break;
      }
    }
    let neighbour_nodes = find_neighbours(choseNode, no_of_rows, no_of_cols, board);
    for (let node of neighbour_nodes) {
      let { row, col, isWall, isVisited, isStart, isEnd, isCheckPoint, isCheckpoint_visited, weight } = node;
      if (!isStart) {
        node = {
          ...node, parent: {
            row: choseNode.row,
            col: choseNode.col
          },
          g: weight,
          h: manhattanDist(node, end_node)
        };
      }
      if (lowerF_in_list(CLOSED_LIST, node)) {
        continue;
      }
      if (lowerF_in_list(OPEN_LIST, node)) {
        continue;
      }
      if (condition === "end_node") {
        if ((!isWall || isEnd) && !isVisited && !isStart && !isCheckPoint) {
          OPEN_LIST = OPEN_LIST.filter(element => element.row !== node.row || element.col !== node.col);
          OPEN_LIST.push(node);
        }
      } else if (condition === "checkpoint") {
        if ((!isWall || isCheckPoint) && !isCheckpoint_visited && !isStart) {
          OPEN_LIST = OPEN_LIST.filter(element => element.row !== node.row || element.col !== node.col);
          OPEN_LIST.push(node);
        }
      }
    }
    OPEN_LIST.sort(compare_F_desc);
    CLOSED_LIST.push(choseNode);
    count_visited_nodes++;
    setTimeout(() => {
      document.querySelector(`#cell-${choseNode.row}-${choseNode.col} .cell`).classList.add(visited_layer_css);
    }, wait_time_factor * time_count);
    time_count++;
  }
  return { CLOSED_LIST: CLOSED_LIST, count_visited_nodes: count_visited_nodes, time_count: time_count };
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
  // right bottom left top
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

export default visualize_greedy;