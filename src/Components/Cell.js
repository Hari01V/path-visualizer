import React from 'react';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';

import '../styles/Cell.css';

export default function Cell(props) {

  let { onClick, onMouseEnter, onMouseDown, onMouseUp, onMouseLeave } = props;
  let { row, col, isStart, isEnd, isWall, isVisited, isCheckpoint_visited, isCheckPoint, weight } = props.cell;

  let class_name = `cell ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${isCheckPoint ? "checkpoint" : ""} ${!isStart && !isEnd && !isCheckPoint ? (isWall ? "wall" : "") : ""}`;

  if (!isStart && !isEnd && !isCheckPoint) {
    if (weight === 5) {
      class_name += " weight-vl ";
    } else if (weight === 10) {
      class_name += " weight-l ";
    } else if (weight === 20) {
      class_name += " weight-m ";
    } else if (weight === 30) {
      class_name += " weight-h ";
    } else if (weight === 50) {
      class_name += " weight-vh ";
    }
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