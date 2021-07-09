import React from 'react';

import '../styles/Cell.css';

export default function Cell(props) {

  let { row, col, isStart, isEnd, isVisited } = props.cell;

  let class_name = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`;

  return (
    <div className={class_name}>
    </div>
  )
}