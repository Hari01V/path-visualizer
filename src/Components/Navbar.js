import React from 'react';
import Dropdown from '../Components/Dropdown';

import '../styles/Navbar.css';

export default function Navbar(props) {

  let { visualize, setAlgorithm, OPTIONS } = props;

  const algoList = OPTIONS["algorithm"];
  const speedList = OPTIONS["speed"];

  return (
    <div className="navbar">
      <a href="/" className="navbar-brand">Path <br></br>Visualizer</a>
      <div className="navbar-content">
        <div className="content-1">
        </div>
        <div className="content-2">
          <Dropdown title={"Algorithm"} list={algoList} setAlgorithm={setAlgorithm} />
        </div>
      </div>
      <button onClick={visualize}
        className="visualize-btn">Visualize</button>
    </div >
  )
}