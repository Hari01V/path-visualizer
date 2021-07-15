import React from 'react';
import Dropdown from '../Components/Dropdown';

import '../styles/Navbar.css';

export default function Navbar(props) {

  let { visualize } = props;

  return (
    <div className="navbar">
      <h1 className="navbar-brand">Path <br></br>Visualizer</h1>
      <div className="navbar-content">
        <div className="content-1">
        </div>
        <div className="content-2">
          <Dropdown title={"Algorithm"} list={["Breadth First Search", "Dijkstra's Algorithm"]} />
        </div>
      </div>
      <button onClick={visualize}
        className="visualize-btn">Visualize</button>
    </div >
  )
}