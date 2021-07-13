import React from 'react';

import '../styles/Cell.css';

export default function Cell(props) {

  let { onClick, onMouseEnter, onMouseDown, onMouseUp, onMouseLeave } = props;
  let { row, col, isStart, isEnd, isWall, isVisited } = props.cell;

  let class_name = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${isWall ? "wall" : ""} ${isVisited ? "visited" : ""}`;

  if (row === 0 && col === 0) {
    console.log("rerendered");
  }

  return (
    <div className={class_name}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}>
    </div>
  )
}