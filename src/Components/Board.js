import React, { useState } from 'react';

import '../styles/Board.css';

export default function Board(props) {

  let { row, col } = props;
  let board = new Array(row).fill(0).map(() => new Array(col).fill(0));
  const [matrix, setMatrix] = useState(board);

  const handleClick = (event) => {
    const element = document.getElementById(event.target.id);
    element.classList.toggle("wall");
  }

  return (
    <div className="board">
      <table>
        <tbody className="board-table">
          {matrix.map((row, row_index) =>
            <tr id={`row-${row_index}`} key={`row-${row_index}`} className="table-row">
              {row.map((cell, cell_index) =>
                <td id={`${row_index}-${cell_index}`}
                  key={`${row_index}-${cell_index}`}
                  className="table-cell"
                  onClick={handleClick}></td>
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
  col: 50
}