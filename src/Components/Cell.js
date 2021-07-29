import React from 'react';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import RoomIcon from '@material-ui/icons/Room';

import '../styles/Cell.css';

export default function Cell(props) {

  let { onClick, onMouseEnter, onMouseDown, onMouseUp, onMouseLeave } = props;
  let { row, col, isStart, isEnd, isWall, isVisited, isCheckpoint_visited, isCheckPoint } = props.cell;

  let class_name = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${isCheckPoint ? "checkpoint" : ""} ${!isStart && !isEnd && !isCheckPoint ? (isWall ? "wall" : "") : ""}`;

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
      {/* {isCheckPoint ? <RoomIcon /> : ""} */}
    </div>
  )
}