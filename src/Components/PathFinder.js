import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import Navbar from './Navbar';

import '../styles/PathFinder.css';

import visualize_Dijkstra from '../Algorithms/dijkstra';
import visualize_BFS from '../Algorithms/bfs';



let board = [];

let OPTIONS = {
  "algorithm": [
    { name: "Breadth First Search", value: "bfs", method: visualize_BFS },
    { name: "Dijkstra's Algorithm", value: "dijkstra", method: visualize_Dijkstra }
  ],
  "speed": [
    { name: "Fast", value: "fast" },
    { name: "Normal", value: "normal" },
    { name: "Slow", value: "slow" }
  ]
}

let ALGO_DESC = {
  "": "Pick an Algorithm!",
  "bfs": "Breath-first Search is <strong>unweighted</strong> and <strong>guarantees</strong> the shortest path!",
  "dijkstra": "Dijkstra's Algorithm is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!"
}

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
  const [isVisualizing, setVisualizing] = useState(false);
  const [result, setResult] = useState(null);

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
          isWall: false
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
          isWall: false
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
    });
    createBoard();
  }, [])

  useEffect(() => {
    document.querySelector(".algo-desc").innerHTML = ALGO_DESC[algorithm];
  }, [algorithm])

  const visualize = () => {
    if (!isVisualizing) {
      clearPath();

      const currAlgorithm = OPTIONS.algorithm.find(item => item.value === algorithm);
      if (currAlgorithm) {
        setVisualizing(true);
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

  const handleClick = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;
    if (!isVisualizing && !isStart && !isEnd) {
      event.target.classList.remove("visited");
      event.target.classList.remove("path");
      board[row][col].isVisited = false;
      event.target.classList.toggle("wall");
      board[row][col].isWall = !(board[row][col].isWall);
    }
  }

  const handleMouseEnter = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;
    if (!isVisualizing && isMouseDown) {
      if (!isStart && !isEnd && !isStartRelocating && !isEndRelocating) {
        event.target.classList.remove("path");
        event.target.classList.remove("visited");
        board[row][col].isVisited = false;
        event.target.classList.toggle("wall");
        board[row][col].isWall = !(board[row][col].isWall);
      } else if (isStartRelocating && !isEnd) {
        board[start.row][start.col].isStart = false;
        setStart({ row: row, col: col });
        board[row][col].isStart = true;
        board[row][col].isWall = false;
      } else if (isEndRelocating && !isStart) {
        board[end.row][end.col].isEnd = false;
        setEnd({ row: row, col: col });
        board[row][col].isEnd = true;
        board[row][col].isWall = false;
      }
    }
  }

  const handleMouseDown = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;
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
      }
    }
  }

  const handleMouseLeave = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;

  }

  const handleMouseUp = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;
    if (!isVisualizing) {
      if (isStartRelocating) {
        if (!isEnd) {
          setStart({ row: row, col: col });
          board[row][col].isStart = true;
          board[row][col].isWall = false;
        }
        setStartRelocation(false);
      }
      if (isEndRelocating) {
        if (!isStart) {
          setEnd({ row: row, col: col });
          board[row][col].isEnd = true;
          board[row][col].isWall = false;
        }
        setEndRelocation(false);
      }
    }
  }

  const clearWalls = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        board[i][j].isWall = false;
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("wall");
        board[i][j].isVisited = false;
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
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
          isWall: false
        });
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("wall");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
      }
      board.push(row);
    }
    setMatrix(board);
  }

  const clearPath = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        board[i][j].isVisited = false;
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
        document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
      }
    }
  }

  return (
    <div className="path-finder">
      <Navbar visualize={visualize}
        setAlgorithm={setAlgorithm}
        setSpeed={setSpeed}
        OPTIONS={OPTIONS}
        resetBoard={resetBoard}
        clearWalls={clearWalls}
        clearPath={clearPath} />
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