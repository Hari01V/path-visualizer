import React, { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import '../styles/Dropdown.css';

export default function Dropdown(props) {

  let { title, list, setAlgorithm, setSpeed } = props;
  const [isOpen, setOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState("");

  const handleClick = (event) => {
    if (isOpen) {
      event.stopPropagation();
    }
    setOpen(!isOpen);
  }
  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (event.target && event.target.parentNode) {
        if (event.target.parentNode.id !== `dropdown-${title}` && event.target.parentNode.className !== `dropdown-list`
          && event.target.id !== `dropdown-${title}`) {
          setOpen(false);
        }
      }
    })
    if (title === "Speed") {
      setCurrentOption("fast");
    }
  }, []);

  const handleSelect = (value) => {
    if (title === "Algorithm") {
      setAlgorithm(value);
    } else if (title === "Speed") {
      setSpeed(value);
    }
    setCurrentOption(value);
  }

  return (
    <div className="dropdown" id={`dropdown-${title}`}
      onClick={handleClick}
      style={isOpen ? { background: '#002433' } : {}}
      aria-controls="simple-menu" aria-haspopup="true">
      <div className="dropdown-title">{title === "Speed" ? `Speed: ${currentOption}` : title} <ArrowDropDownIcon /></div>
      {title !== "Speed" ?
        <span className="selected-option">{currentOption}</span>
        : ""}
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