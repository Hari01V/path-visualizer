import React from 'react';

import '../styles/Navbar.css';

export default function Navbar(props) {

  let { visualize } = props;

  return (
    <div className="navbar">
      <button onClick={visualize}>Visualize</button>
    </div>
  )
}