import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import Navbar from './Navbar';
import useToggle from '../hooks/useToggle';

import '../styles/PathFinder.css';

import visualize_Dijkstra from '../Algorithms/dijkstra';
import visualize_BFS from '../Algorithms/bfs';
import visualize_DFS from '../Algorithms/dfs';
import visualize_Astar from '../Algorithms/astar';
import visualize_greedy from '../Algorithms/greedyBFS';
import visualize_biBFS from '../Algorithms/bidirectionalBFS';
import recursiveDivision from '../MazeAlgorithms/recursiveDivision';

// import LockIcon from '@material-ui/icons/Lock';

let board = [];

let OPTIONS = {
  "algorithm": [
    { name: "Breadth First Search", value: "bfs", method: visualize_BFS, isWeighted: false, checkPointNotAllowed: false },
    { name: "Dijkstra's Algorithm", value: "dijkstra", method: visualize_Dijkstra, isWeighted: true, checkPointNotAllowed: false },
    { name: "A* Search Algorithm", value: "astar", method: visualize_Astar, isWeighted: true, checkPointNotAllowed: false },
    { name: "Depth First Search", value: "dfs", method: visualize_DFS, isWeighted: false, checkPointNotAllowed: false },
    { name: "Greedy Best First", value: "greedy", method: visualize_greedy, isWeighted: true, checkPointNotAllowed: false },
    { name: "Bi-directional BFS", value: "biBFS", method: visualize_biBFS, isWeighted: false, checkPointNotAllowed: true }
  ],
  "speed": [
    { name: "Fast", value: "fast" },
    { name: "Normal", value: "normal" },
    { name: "Slow", value: "slow" }
  ],
  "maze": [
    { name: "Recursive Division", method: recursiveDivision }
  ],
  "weight": [
    { name: "very less : 5", value: 5 },
    { name: "less : 10", value: 10 },
    { name: "moderate : 20", value: 20 },
    { name: "high : 30", value: 30 },
    { name: "very high : 50", value: 50 }
  ]
}

let ALGO_DESC = {
  "": "Pick an Algorithm!",
  "bfs": "Breadth-first Search is <strong>unweighted</strong> and <strong>guarantees</strong> the shortest path!",
  "dijkstra": "Dijkstra's Algorithm is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!",
  "astar": "A* Search is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!",
  "dfs": "Depth-first Search is <strong>unweighted</strong> and does <strong>not guarantee</strong> the shortest path!",
  "greedy": "Greedy Best-first Search is <strong>weighted</strong> and does <strong>not guarantee</strong> the shortest path!",
  "biBFS": "Bi-Directional Breadth-First-Search is <strong>unweighted</strong> and <strong>guarantees</strong> the shortest path!"
}

let isWeightAllowed = false;

export default function PathFinder(props) {

  let { row, col, initial_start, initial_end } = props;

  const [matrix, setMatrix] = useState([]);
  const [isMouseDown, setMouseDown] = useState(false);
  const [start, setStart] = useState(initial_start);
  const [end, setEnd] = useState(initial_end);
  const [isStartRelocating, setStartRelocation] = useState(false);
  const [isEndRelocating, setEndRelocation] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [speed, setSpeed] = useState("fast");
  const [weight, setWeight] = useState(5);
  const [isVisualizing, setVisualizing] = useState(false);
  const [result, setResult] = useState(null);
  const [isCheckPointRelocating, setCheckPointRelocation] = useState(false);
  const [ischeckPointAdded, setCheckPointAdded] = useState(false);

  const createBoard = () => {
    board = [];
    for (let i = 0; i < row; i++) {
      let row = [];
      for (let j = 0; j < col; j++) {
        row.push({
          row: i,
          col: j,
          isStart: i === initial_start.row && j === initial_start.col,
          isEnd: i === initial_end.row && j === initial_end.col,
          isVisited: false,
          isCheckpoint_visited: false,
          isWall: false,
          isCheckPoint: false,
          weight: 1
        })
      }
      board.push(row);
    }

    let initial_board = [];
    for (let i = 0; i < row; i++) {
      let row = [];
      for (let j = 0; j < col; j++) {
        row.push({
          row: i,
          col: j,
          isStart: i === initial_start.row && j === initial_start.col,
          isEnd: i === initial_end.row && j === initial_end.col,
          isVisited: false,
          isCheckpoint_visited: false,
          isWall: false,
          isCheckPoint: false,
          weight: 1
        })
      }
      initial_board.push(row);
    }
    setMatrix(initial_board);
  }

  useEffect(() => {
    document.querySelector(".board-table").addEventListener("mousedown", () => {
      setMouseDown(true);
    });
    document.querySelector(".board-table").addEventListener("mouseup", () => {
      setMouseDown(false);
    });
    document.querySelector(".board-table").addEventListener("mouseleave", () => {
      setMouseDown(false);
      setStartRelocation(false);
      setEndRelocation(false);
      setCheckPointRelocation(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.code === "KeyW") {
        isWeightAllowed = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      isWeightAllowed = false;
    });
    createBoard();
  }, [])

  useEffect(() => {
    document.querySelector(".algo-desc").innerHTML = ALGO_DESC[algorithm];
    const algo = OPTIONS["algorithm"].find(algo => algo.value === algorithm);
    if (algo && !algo.isWeighted) {
      clearWeights();
      //SNACK BAR: CURR ALGORITHM IS UNWEIGHTED!
      // showSnackBar("Selected Algorithm is Unweighted, so the weights have been removed!");
    }
    if (algo && algo.checkPointNotAllowed) {
      AddCheckPoint();
    }
  }, [algorithm])

  const visualize = () => {
    if (!isVisualizing) {
      clearPath();

      const currAlgorithm = OPTIONS.algorithm.find(item => item.value === algorithm);
      if (currAlgorithm) {
        setVisualizing(true);
        if (!currAlgorithm.isWeighted) {
          clearWeights();
          //SNACK BAR: CURR ALGORITHM IS UNWEIGHTED!
          // showSnackBar("Selected Algorithm is Unweighted, so the weights have been removed!");
        }
        currAlgorithm.method(board, setVisualizing, speed, setResult);
      } else {
        const element = document.querySelector(".algo-desc");
        element.style.transform = "scale(1.1)";
        element.style.color = 'red';
        setTimeout(() => {
          element.style.transform = "scale(1)";
          element.style.color = 'black';
        }, 1000);
      }
    }
  }

  const addWeightClass = (event, board, row, col) => {
    board[row][col].weight = board[row][col].weight === weight ? 1 : weight;
    if (weight === 5) {
      event.target.classList.toggle("weight-vl");
      event.target.classList.remove("weight-l");
      event.target.classList.remove("weight-m");
      event.target.classList.remove("weight-h");
      event.target.classList.remove("weight-vh");
    } else if (weight === 10) {
      event.target.classList.remove("weight-vl");
      event.target.classList.toggle("weight-l");
      event.target.classList.remove("weight-m");
      event.target.classList.remove("weight-h");
      event.target.classList.remove("weight-vh");
    } else if (weight === 20) {
      event.target.classList.remove("weight-vl");
      event.target.classList.remove("weight-l");
      event.target.classList.toggle("weight-m");
      event.target.classList.remove("weight-h");
      event.target.classList.remove("weight-vh");
    } else if (weight === 30) {
      event.target.classList.remove("weight-vl");
      event.target.classList.remove("weight-l");
      event.target.classList.remove("weight-m");
      event.target.classList.toggle("weight-h");
      event.target.classList.remove("weight-vh");
    } else if (weight === 50) {
      event.target.classList.remove("weight-vl");
      event.target.classList.remove("weight-l");
      event.target.classList.remove("weight-m");
      event.target.classList.remove("weight-h");
      event.target.classList.toggle("weight-vh");
    }
  }

  const handleClick = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isCheckpoint_visited, isWall, isCheckPoint } = cell;
    if (!isVisualizing && !isStart && !isEnd && !isCheckPoint) {
      event.target.classList.remove("visited");
      event.target.classList.remove("visited_to_checkpoint");
      event.target.classList.remove("path");
      board[row][col].isVisited = false;
      board[row][col].isCheckpoint_visited = false;
      if (isWeightAllowed) {
        board[row][col].isWall = false;
        event.target.classList.remove("wall");
        addWeightClass(event, board, row, col);
      } else {
        event.target.classList.remove("weight-vl");
        event.target.classList.remove("weight-l");
        event.target.classList.remove("weight-m");
        event.target.classList.remove("weight-h");
        event.target.classList.remove("weight-vh");
        board[row][col].weight = 1;

        event.target.classList.toggle("wall");
        board[row][col].isWall = !(board[row][col].isWall);
      }
    }
  }

  const handleMouseEnter = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isCheckpoint_visited, isWall, isCheckPoint, weight } = cell;
    if (!isVisualizing && isMouseDown) {
      if (!isStart && !isEnd && !isStartRelocating && !isEndRelocating && !isCheckPointRelocating) {
        event.target.classList.remove("path");
        event.target.classList.remove("visited");
        event.target.classList.remove("visited_to_checkpoint");
        board[row][col].isVisited = false;
        board[row][col].isCheckpoint_visited = false;
        if (isWeightAllowed) {
          board[row][col].isWall = false;
          event.target.classList.remove("wall");
          addWeightClass(event, board, row, col);
        } else {
          event.target.classList.remove("weight-vl");
          event.target.classList.remove("weight-l");
          event.target.classList.remove("weight-m");
          event.target.classList.remove("weight-h");
          event.target.classList.remove("weight-vh");
          board[row][col].weight = 1;

          event.target.classList.toggle("wall");
          board[row][col].isWall = !(board[row][col].isWall);
        }
      } else if (isStartRelocating && !isEnd && !isCheckPoint) {
        board[start.row][start.col].isStart = false;
        setStart({ row: row, col: col });
        board[row][col].isStart = true;
        // board[row][col].isWall = false;
      } else if (isEndRelocating && !isStart && !isCheckPoint) {
        board[end.row][end.col].isEnd = false;
        setEnd({ row: row, col: col });
        board[row][col].isEnd = true;
        // board[row][col].isWall = false;
      } else if (isCheckPointRelocating && !isStart && !isEnd) {
        board[row][col].isCheckPoint = true;
        event.target.classList.add("checkpoint");
        setMatrix(board);
      }
    }
  }

  const handleMouseDown = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isCheckpoint_visited, isWall, isCheckPoint, weight } = cell;
    if (!isVisualizing) {
      if (isStart) {
        setStartRelocation(true);
        board[row][col].isStart = false;
        // setMatrix([...matrix, [...matrix[row], { ...matrix[row][col], isStart: false }]]);
        setMatrix(board);
      } else if (isEnd) {
        setEndRelocation(true);
        board[row][col].isEnd = false;
        // setMatrix([...matrix, [...matrix[row], { ...matrix[row][col], isEnd: false }]]);
        setMatrix(board);
      } else if (isCheckPoint) {
        setCheckPointRelocation(true);
      }
    }
  }

  const handleMouseLeave = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isCheckpoint_visited, isWall, isCheckPoint, weight } = cell;
    if (!isVisualizing) {
      if (isCheckPointRelocating) {
        board[row][col].isCheckPoint = false;
        event.target.classList.remove("checkpoint");
      }
    }
  }

  const handleMouseUp = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isCheckpoint_visited, isWall, isCheckPoint, weight } = cell;
    if (!isVisualizing) {
      if (isStartRelocating) {
        if (!isEnd && !isCheckPoint) {
          setStart({ row: row, col: col });
          board[row][col].isStart = true;
          // board[row][col].isWall = false;
        }
        setStartRelocation(false);
      }
      if (isEndRelocating) {
        if (!isStart && !isCheckPoint) {
          setEnd({ row: row, col: col });
          board[row][col].isEnd = true;
          // board[row][col].isWall = false;
        }
        setEndRelocation(false);
      }
      if (isCheckPointRelocating) {
        if (!isStart && !isEnd) {
          // board[row][col].isCheckPoint = true;
        }
        setCheckPointRelocation(false);
      }
    }
  }

  const clearWalls = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        board[i][j].isWall = false;
        board[i][j].weight = 1;
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("wall");
        board[i][j].isVisited = false;
        board[i][j].isCheckpoint_visited = false;
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
  }

  const clearWeights = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        board[i][j].weight = 1;
        const cell = document.querySelector(`#cell-${i}-${j} .cell`);
        cell.classList.remove("weight-vl");
        cell.classList.remove("weight-l");
        cell.classList.remove("weight-m");
        cell.classList.remove("weight-h");
        cell.classList.remove("weight-vh");
      }
    }
  }


  const resetBoard = () => {
    board = [];
    for (let i = 0; i < row; i++) {
      let row = [];
      for (let j = 0; j < col; j++) {
        row.push({
          row: i,
          col: j,
          isStart: i === initial_start.row && j === initial_start.col,
          isEnd: i === initial_end.row && j === initial_end.col,
          isVisited: false,
          isCheckpoint_visited: false,
          isWall: false,
          isCheckPoint: false,
          weight: 1
        });
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("wall");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited_to_checkpoint");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("checkpoint");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-vl");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-l");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-m");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-h");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("weight-vh");
      }
      board.push(row);
    }
    setMatrix(board);
  }

  const clearPath = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        board[i][j].isVisited = false;
        board[i][j].isCheckpoint_visited = false;
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited_to_checkpoint");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
      }
    }
  }

  const AddCheckPoint = () => {
    const currAlgo = OPTIONS["algorithm"].find(algo => algo.value === algorithm);
    if (currAlgo && currAlgo.checkPointNotAllowed) {
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          if (board[i][j].isCheckPoint) {
            board[i][j].isCheckPoint = false;
            document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("checkpoint");
          }
        }
      }
      setCheckPointAdded(false);
      //SNACK BAR: CURRENT ALGORITHM DOES NOT SUPPORT CHECKPOINT
      // showSnackBar("Selected Algorithm does not support CheckPoint !");
    } else {
      if (ischeckPointAdded) {
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < col; j++) {
            if (board[i][j].isCheckPoint) {
              board[i][j].isCheckPoint = false;
              document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("checkpoint");
            }
          }
        }
        setCheckPointAdded(false);
      } else {
        let row = 8;
        let col = 20;
        if (!board[8][20].isStart && !board[8][20].isEnd) {
          row = 8;
          col = 20;
        } else if (!board[8][21].isStart && !board[8][21].isEnd) {
          row = 8;
          col = 21;
        } else if (!board[8][19].isStart && !board[8][19].isEnd) {
          row = 8;
          col = 19;
        }
        board[row][col].isVisited = false;
        board[row][col].isCheckpoint_visited = false;
        board[row][col].isCheckPoint = true;
        document.querySelector(`#cell-${row}-${col} .cell`).classList.remove("visited");
        document.querySelector(`#cell-${row}-${col} .cell`).classList.remove("visited_to_checkpoint");
        document.querySelector(`#cell-${row}-${col} .cell`).classList.remove("path");
        document.querySelector(`#cell-${row}-${col} .cell`).classList.add("checkpoint");
        setMatrix(board);
        setCheckPointAdded(true);
      }
    }
  }

  const createMaze = (method) => {
    if (!isVisualizing) {
      method(board, speed);
    }
  }

  return (
    <div className="path-finder">
      <Navbar visualize={visualize}
        setAlgorithm={setAlgorithm}
        setSpeed={setSpeed}
        setWeight={setWeight}
        createMaze={createMaze}
        OPTIONS={OPTIONS}
        resetBoard={resetBoard}
        clearWalls={clearWalls}
        clearPath={clearPath}
        AddCheckPoint={AddCheckPoint}
        ischeckPointAdded={ischeckPointAdded} />
      <div className="algo-desc"></div>
      <div className="search-result">
        <div className="result-part">
          <span className="result-part-value">{isVisualizing || !result ? "-" : result.visited_nodes}</span> VISITED NODES
        </div>
        <div className="result-part">
          <span className="result-part-value">{isVisualizing || !result ? "-" : result.time_taken}</span> TIME TAKEN(in ms)
        </div>
        <div className="result-part">
          <span className="result-part-value">{isVisualizing || !result ? "-" : result.path_cost}</span> PATH COST
        </div>
      </div>
      <div className="board">
        <table>
          <tbody className="board-table">
            {matrix.map((row, row_index) =>
              <tr id={`row-${row_index}`} key={`row-${row_index}`} className="table-row">
                {row.map((cell, cell_index) =>
                  <td id={`cell-${row_index}-${cell_index}`}
                    key={`${row_index}-${cell_index}`}
                    className="table-cell">
                    <Cell
                      cell={cell}
                      onClick={(event) => handleClick(event, cell.row, cell.col)}
                      onMouseEnter={(event) => handleMouseEnter(event, cell.row, cell.col)}
                      onMouseDown={(event) => handleMouseDown(event, cell.row, cell.col)}
                      onMouseUp={(event) => handleMouseUp(event, cell.row, cell.col)}
                      onMouseLeave={(event) => handleMouseLeave(event, cell.row, cell.col)} />
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

PathFinder.defaultProps = {
  row: 20,
  col: 50,
  initial_start: { row: 8, col: 8 },
  initial_end: { row: 8, col: 40 }
}