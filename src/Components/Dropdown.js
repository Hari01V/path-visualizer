import React from 'react';

import '../styles/Dropdown.css';

export default function Dropdown(props) {

  let { title, list } = props;

  return (
    <div className="dropdown">
      <div className="dropdown-title">{title} <span>v</span></div>
      <ul className="dropdown-list">
        {list.map((item) =>
          <li className="dropdown-list-item">{item}</li>
        )}
      </ul>
    </div>
  )
}