import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import Navbar from './Navbar';

import '../styles/PathFinder.css';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import { OPTIONS, ALGO_DESC } from '../database/helper';

import { Guide } from './Guide';

let board = [];

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
  const [guideDialog, setGuideDialog] = useState(true);

  //SNACKBAR
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState(undefined);
  const snackHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

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
      let need = clearWeights();
      if (need) {
        //SNACK BAR: CURR ALGORITHM IS UNWEIGHTED!
        setSnackMsg("Weights have been removed!")
        setSnackOpen(true);
      }
    }
    if (algo && algo.checkPointNotAllowed && ischeckPointAdded) {
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
          let need = clearWeights();
          if (need) {
            //SNACK BAR: CURR ALGORITHM IS UNWEIGHTED!
            setSnackMsg("Weights have been removed!")
            setSnackOpen(true);
          }
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
    if (!isVisualizing) {
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
      setSnackMsg("Cleared Walls");
      setSnackOpen(true);
    }
  }

  const clearWeights = () => {
    if (!isVisualizing) {
      let need = false;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
          if (board[i][j].weight != 1) {
            need = true;
          }
          board[i][j].weight = 1;
          const cell = document.querySelector(`#cell-${i}-${j} .cell`);
          cell.classList.remove("weight-vl");
          cell.classList.remove("weight-l");
          cell.classList.remove("weight-m");
          cell.classList.remove("weight-h");
          cell.classList.remove("weight-vh");
        }
      }
      return need;
    }
  }

  const resetBoard = () => {
    if (!isVisualizing) {
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
      // setMatrix(board);
      setCheckPointAdded(false);
      setSnackMsg("Board Reset");
      setSnackOpen(true);
    }
  }

  const clearPath = () => {
    if (!isVisualizing) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
          board[i][j].isVisited = false;
          board[i][j].isCheckpoint_visited = false;
          document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited");
          document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("visited_to_checkpoint");
          document.querySelector(`#cell-${i}-${j} .cell`).classList.remove("path");
        }
      }
      setSnackMsg("Cleared Path");
      setSnackOpen(true);
    }
  }

  const AddCheckPoint = () => {
    if (!isVisualizing) {
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
        setSnackMsg("Bidir-BFS does not support CheckPoint!");
        setSnackOpen(true);
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
          setSnackMsg("Removed CheckPoint!");
          setSnackOpen(true);
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
          // setMatrix(board);
          setCheckPointAdded(true);
          setSnackMsg("Added CheckPoint!");
          setSnackOpen(true);
        }
      }
    }
  }

  const createMaze = (method, weight) => {
    if (!isVisualizing) {
      setVisualizing(true);
      method(board, speed, weight, setVisualizing);
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
        ischeckPointAdded={ischeckPointAdded}
        weight={weight} />
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
      <Guide setGuideDialog={setGuideDialog} guideDialog={guideDialog} />
      {snackMsg ?
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={snackHandleClose}
          message={snackMsg}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={snackHandleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        : <></>}
    </div>
  )
}

PathFinder.defaultProps = {
  row: 25,
  col: 50,
  initial_start: { row: 8, col: 8 },
  initial_end: { row: 8, col: 40 }
}