import React, { useEffect, useState } from 'react';
import Cell from './Cell';

import '../styles/Board.css';

export default function Board(props) {

  let { row, col, start, end } = props;
  let board = [];
  const [matrix, setMatrix] = useState(board);

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
          isVisited: false
        })
      }
      board.push(row);
    }
    setMatrix(board);
  }

  useEffect(() => {
    createBoard();
  }, [])

  return (
    <div className="board">
      <table>
        <tbody className="board-table">
          {matrix.map((row, row_index) =>
            <tr id={`row-${row_index}`} key={`row-${row_index}`} className="table-row">
              {row.map((cell, cell_index) =>
                <td id={`${row_index}-${cell_index}`}
                  key={`${row_index}-${cell_index}`}
                  className="table-cell">
                  <Cell cell={cell} />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

Board.defaultProps = {
  row: 20,
  col: 50,
  start: { row: 8, col: 8 },
  end: { row: 8, col: 40 }
}