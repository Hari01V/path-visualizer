import React, { useEffect, useState } from 'react';

import '../styles/Dropdown.css';

export default function Dropdown(props) {

  let { title, list } = props;
  const [isOpen, setOpen] = useState(false);

  const handleClick = (event) => {
    if (isOpen) {
      event.stopPropagation();
    }
    setOpen(!isOpen);
  }
  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (event.target.parentNode.id !== `dropdown-${title}`) {
        setOpen(false);
      }
    })
  }, []);

  return (
    <div className="dropdown" id={`dropdown-${title}`}
      onClick={handleClick}
      style={isOpen ? { background: '#002433' } : {}}
      aria-controls="simple-menu" aria-haspopup="true">
      <div className="dropdown-title">{title} <span>v</span></div>
      <ul className="dropdown-list" style={isOpen ? { display: 'block' } : { display: 'none' }}>
        {list.map((item) =>
          <li className="dropdown-list-item">{item}</li>
        )}
      </ul>
    </div>
  )
}