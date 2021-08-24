import React from 'react';
import Dropdown from '../Components/Dropdown';

import icon from '../images/icon.svg';

import '../styles/Navbar.css';

export default function Navbar(props) {

  let { visualize, setAlgorithm, setSpeed, setWeight, createMaze, OPTIONS, resetBoard, clearWalls, clearPath, AddCheckPoint, ischeckPointAdded, weight } = props;

  const algoList = OPTIONS["algorithm"];
  const speedList = OPTIONS["speed"];
  const mazeList = OPTIONS["maze"];
  const weightList = OPTIONS["weight"];

  return (
    <div className="navbar">
      <a href="/" className="navbar-brand"><img src={icon} alt="icon" /><span>Path <br></br>Visualizer</span></a>
      <div className="navbar-content">
        <div className="content-1">
          <Dropdown title={"Algorithm"} list={algoList} setAlgorithm={setAlgorithm} />
          <Dropdown title={"Maze"} list={mazeList} createMaze={createMaze} weight={weight} />
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
            <button id="checkpoint-btn" className="navbar-btn"
              onClick={AddCheckPoint}>{ischeckPointAdded ? "Remove" : "Add"} Checkpoint</button>
            <Dropdown title={"Weight"} list={weightList} setWeight={setWeight} />
          </div>
        </div>
      </div>
      <button onClick={visualize}
        className="visualize-btn">Visualize</button>
    </div >
  )
}