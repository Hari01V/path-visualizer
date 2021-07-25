import React from 'react';
import Dropdown from '../Components/Dropdown';
import BlockIcon from '@material-ui/icons/Block';

import '../styles/Navbar.css';

export default function Navbar(props) {

  let { visualize, setAlgorithm, setSpeed, createMaze, OPTIONS, resetBoard, clearWalls, clearPath, addCheckPoint, toggleAddCheckPoint } = props;

  const algoList = OPTIONS["algorithm"];
  const speedList = OPTIONS["speed"];
  const mazeList = OPTIONS["maze"];

  return (
    <div className="navbar">
      <a href="/" className="navbar-brand">Path <br></br>Visualizer</a>
      <div className="navbar-content">
        <div className="content-1">
          <Dropdown title={"Algorithm"} list={algoList} setAlgorithm={setAlgorithm} />
          <Dropdown title={"Maze"} list={mazeList} createMaze={createMaze} />
          <Dropdown title={"Speed"} list={speedList} setSpeed={setSpeed} />
        </div>
        <div className="content-2">
          <div className="content-2-1">
            <button className="navbar-btn"
              onClick={resetBoard}>Reset Board</button>
            <button className="navbar-btn"
              onClick={clearWalls}>Clear Walls</button>
            <button className="navbar-btn"
              onClick={clearPath}>Clear Path</button>
          </div>
          <div className="content-2-2">
            <button className="navbar-btn"
              onClick={toggleAddCheckPoint}>{addCheckPoint ? <BlockIcon /> : ""}Add Checkpoint</button>
          </div>
        </div>
      </div>
      <button onClick={visualize}
        className="visualize-btn">Visualize</button>
    </div >
  )
}