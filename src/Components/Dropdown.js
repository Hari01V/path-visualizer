import React, { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import '../styles/Dropdown.css';

export default function Dropdown(props) {

  let { title, list, setAlgorithm } = props;
  const [isOpen, setOpen] = useState(false);

  const handleClick = (event) => {
    if (isOpen) {
      event.stopPropagation();
    }
    setOpen(!isOpen);
  }
  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (event.target && event.target.parentNode) {
        if (event.target.parentNode.id !== `dropdown-${title}` && event.target.parentNode.className !== `dropdown-list`) {
          setOpen(false);
        }
      }
    })
  }, []);

  const handleSelect = (value) => {
    if (title === "Algorithm") {
      setAlgorithm(value);
    }
  }

  return (
    <div className="dropdown" id={`dropdown-${title}`}
      onClick={handleClick}
      style={isOpen ? { background: '#002433' } : {}}
      aria-controls="simple-menu" aria-haspopup="true">
      <div className="dropdown-title">{title} <ArrowDropDownIcon /></div>
      <ul className="dropdown-list" style={isOpen ? { display: 'block' } : { display: 'none' }}>
        {list.map((item) =>
          <li className="dropdown-list-item"
            key={`dropdown-list-item-${item.value}`}
            onClick={() => handleSelect(item.value)}>{item.name}</li>
        )}
      </ul>
    </div>
  )
}