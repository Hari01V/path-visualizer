import React, { useState } from 'react';

import page1Img from '../images/amongus.JPG';
import page2Img from '../images/cool.JPG';

import '../styles/Guide.css';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

let guide = {
  1: {
    heading: "Welcome to Path Visualizer",
    subheading: "Check out the features here",
    content: "You can simply skip the tutorial if needed!",
    imgPath: page1Img
  },
  2: {
    heading: "How does this work ?",
    subheading: "Path Finding Graph Algorithms is used to find Path between two Points (Start and End, even a single checkpoint)",
    content: "Walls and weights can be added in a 2D Grid And then Shortest path is computed and Visualized depending on the Algorithm used.",
    imgPath: page2Img
  },
  3: {
    heading: "Welcome to Path Visualizer",
    subheading: "Check out the features here",
    content: "You can simply skip the tutorial if needed!",
    imgPath: page1Img
  },
  4: {
    heading: "How does this work ?",
    subheading: "Path Finding Graph Algorithms is used to find Path between two Points (Start and End, even a single checkpoint)",
    content: "Walls and weights can be added in a 2D Grid And then Shortest path is computed and Visualized depending on the Algorithm used.",
    imgPath: page2Img
  },
  5: {
    heading: "Welcome to Path Visualizer",
    subheading: "Check out the features here",
    content: "You can simply skip the tutorial if needed!",
    imgPath: page1Img
  },
  6: {
    heading: "How does this work ?",
    subheading: "Path Finding Graph Algorithms is used to find Path between two Points (Start and End, even a single checkpoint)",
    content: "Walls and weights can be added in a 2D Grid And then Shortest path is computed and Visualized depending on the Algorithm used.",
    imgPath: page2Img
  }
}

const pageSize = Object.keys(guide).length;

export function Guide(props) {

  let { setGuideDialog, guideDialog } = props;
  const [page, setPage] = useState(1);

  const handleNext = () => {
    if (page != pageSize) {
      setPage(page + 1);
    }
  }
  const handlePrevious = () => {
    if (page != 1) {
      setPage(page - 1);
    }
  }

  const handleEnd = () => {
    setPage(1);
    setGuideDialog(false);
  }

  return (
    <div className={`Guide-container ${guideDialog ? "" : "tooltip"}`}>
      <div className="Guide">
        {!guideDialog ?
          <div className="tooltip-tag"></div>
          : <></>}
        <div className="Guide-Slide">
          <h1>{guide[page].heading}</h1>
          <h2>{guide[page].subheading}</h2>
          <p>{guide[page].content}</p>
          <img src={guide[page].imgPath}
            className="guide-img" />
        </div>
        <div className="controls">
          <button id="controls-left-btn" className="controls-btn"
            onClick={handlePrevious} disabled={page <= 1}><ArrowLeftIcon /></button>
          <div className="page-indicator">
            {Object.keys(guide).map(key =>
              <div className={`indicator ${page == key ? "active" : "hi"}`}
                key={key}></div>
            )}
          </div>
          <button id="controls-right-btn" className="controls-btn"
            onClick={handleNext} disabled={page >= pageSize}><ArrowRightIcon /></button>
          {guideDialog ?
            <button className="guide-end"
              onClick={handleEnd}>End Tutorial</button>
            : <></>}
        </div>
      </div>
    </div>
  )
}