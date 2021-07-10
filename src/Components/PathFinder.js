import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import Navbar from './Navbar';

import '../styles/PathFinder.css';

import visualize_Dijkstra from '../Algorithms/dijkstra';



let board = [];

export default function PathFinder(props) {

  let { row, col, start, end } = props;

  const [matrix, setMatrix] = useState([]);
  const [isMouseDown, setMouseDown] = useState(false);

  const createBoard = () => {
    board = [];
    for (let i = 0; i < row; i++) {
      let row = [];
      for (let j = 0; j < col; j++) {
        row.push({
          row: i,
          col: j,
          isStart: i === start.row && j === start.col,
          isEnd: i === end.row && j === end.col,
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
          isStart: i === start.row && j === start.col,
          isEnd: i === end.row && j === end.col,
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
    });
    createBoard();
  }, [])

  const visualize = () => {
    visualize_Dijkstra(board);
  }

  const handleMouseDown = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;
    if (!isStart && !isEnd) {
      event.target.classList.toggle("wall");
      board[row][col].isWall = !(board[row][col].isWall);
    }
  }

  const handleMouseEnter = (event, row, col) => {
    let cell = board[row][col];
    let { isStart, isEnd, isVisited, isWall } = cell;
    if (!isStart && !isEnd && isMouseDown) {
      event.target.classList.toggle("wall");
      board[row][col].isWall = !(board[row][col].isWall);
    }
  }

  return (
    <div className="path-finder">
      <Navbar visualize={visualize} />

      <div className="board">
        <table>
          <tbody className="board-table">
            {matrix.map((row, row_index) =>
              <tr id={`row-${row_index}`} key={`row-${row_index}`} className="table-row">
                {row.map((cell, cell_index) =>
                  <td id={`${row_index}-${cell_index}`}
                    key={`${row_index}-${cell_index}`}
                    className="table-cell">
                    <Cell
                      cell={cell}
                      onMouseDown={(event) => handleMouseDown(event, cell.row, cell.col)}
                      onMouseEnter={(event) => handleMouseEnter(event, cell.row, cell.col)} />
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
  start: { row: 8, col: 8 },
  end: { row: 8, col: 40 }
}