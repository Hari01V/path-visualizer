import React from 'react';
import Board from './Board';
import Navbar from './Navbar';

import '../styles/PathFinder.css';

export default function PathFinder() {

  return (
    <div className="path-finder">
      <Navbar />
      <Board />
    </div>
  )
}