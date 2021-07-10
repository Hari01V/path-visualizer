import React from 'react';

import '../styles/Cell.css';

export default function Cell(props) {

  let { onClick, onMouseEnter, onMouseDown, onMouseUp, onMouseLeave } = props;
  let { row, col, isStart, isEnd } = props.cell;

  let class_name = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`;

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