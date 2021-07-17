import React from 'react';
import Dropdown from '../Components/Dropdown';

import '../styles/Navbar.css';

export default function Navbar(props) {

  let { visualize, setAlgorithm, setSpeed, OPTIONS, resetBoard, clearWalls, clearPath } = props;

  const algoList = OPTIONS["algorithm"];
  const speedList = OPTIONS["speed"];

  return (
    <div className="navbar">
      <a href="/" className="navbar-brand">Path <br></br>Visualizer</a>
      <div className="navbar-content">
        <div className="content-1">
          <Dropdown title={"Algorithm"} list={algoList} setAlgorithm={setAlgorithm} />
          <Dropdown title={"Speed"} list={speedList} setSpeed={setSpeed} />
        </div>
        <div className="content-2">
          <button className="navbar-btn"
            onClick={resetBoard}>Reset Board</button>
          <button className="navbar-btn"
            onClick={clearWalls}>Clear Walls</button>
          <button className="navbar-btn"
            onClick={clearPath}>Clear Path</button>
        </div>
      </div>
      <button onClick={visualize}
        className="visualize-btn">Visualize</button>
    </div >
  )
}