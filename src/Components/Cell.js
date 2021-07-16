import React from 'react';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';

import '../styles/Cell.css';

export default function Cell(props) {

  let { onClick, onMouseEnter, onMouseDown, onMouseUp, onMouseLeave } = props;
  let { row, col, isStart, isEnd, isWall, isVisited } = props.cell;

  let class_name = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${isWall ? "wall" : ""}`;

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
      {isEnd ? <GolfCourseIcon /> : ""}
      {isStart ? <GpsFixedIcon /> : ""}
    </div>
  )
}