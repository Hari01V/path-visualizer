import React, { useState } from 'react';

import page1Img from '../images/amongus.JPG';
import page2Img from '../images/cool.JPG';
import weights from '../images/weights.JPG';
import checkpoint from '../images/checkpoint.JPG';
import results from '../images/results.JPG';
import WallsWeights from '../images/WallsWeights.gif';

import '../styles/Guide.css';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

let guide = {
  1: {
    heading: "Welcome to Path Visualizer",
    subheading: "Check out the features and options here",
    content: ["You can simply skip the tutorial if needed!"],
    imgPath: page2Img,
    alt: "welcome img"
  },
  2: {
    heading: "How does this work ?",
    subheading: "Path Finding Graph Algorithms is used to find Path between two Points (Start and End, even a single checkpoint)",
    content: ["Position the Start node, and then the End node. Now, Select an algorithm to visualize it.", "Walls and weights can also be added to simulate mazes or maps."],
    imgPath: page1Img,
    alt: "example"
  },
  3: {
    heading: "Graph Algorithms",
    subheading: "Try out all the algorithm from the Algorithm Dropdown, Each one is different!",
    content: ["Dijkstra's Algo - Weighted and guarantees the shortest path, minimizes the path cost. (aka) Father of Pathfinding Algorithms.",
      "A* Search - Weighted, guarantees the shortest path using Heuristics. Dijkstra with Heuristics is A*, Faster and better algorithm.",
      "Breadth First Search - Unweighted and guarantees the shortest path. Complete and suitable algorithm for PathFinding.",
      "Depth First Search - Unweighted and does not guarantee the shortest path. Not suitable for Path Findings.",
      "Greedy Best First Search - Weighted, does not guarantee the shortest path. Depends more on the Heuristics.",
      "Bi-directional BFS - Unweighted, does not guarantee the shortest path. Performs BFS from both sides."],
    imgPath: undefined,
    alt: undefined
  },
  4: {
    heading: "Adding Walls and Weights",
    subheading: "Walls are like deadends, whereas weights add some path cost to the route",
    content: ["Walls can be added by clicking on the Grid",
      "Weights can be added by clicking on the grid while pressing 'W'"],
    imgPath: WallsWeights,
    alt: "walls and weights"
  },
  5: {
    heading: "Weights classification",
    subheading: "You can find 5 different weights from Weight Dropdown",
    content: ["Each Weight imposes different amount of Cost on the route. Weights ranging from 5 to 50 path costs, are shown in different colours (grey to red respectively) on the grid"],
    imgPath: weights,
    alt: "weight types"
  },
  6: {
    heading: "Add CheckPoint",
    subheading: "Path from Start to CheckPoint and then reach End from CheckPoint. Path between 3 points on the Grid.",
    content: ["CheckPoint connect the path between start and end",
      "Note: Bi-directional BFS algorithm and checkpoint is not supported together!"],
    imgPath: checkpoint,
    alt: "checkpoint"
  },
  7: {
    heading: "Results",
    subheading: "what would be the time taken or other info after the algorithm ends?",
    content: ["Number of Visited Nodes, Time Taken and the Path Cost is shown as results once the Algorithm ends.",
      "Path cost of each cell is considered to be 1 unless it is weighted. If it is weighted, Path cost is the cost of the Weights applied"],
    imgPath: results,
    alt: "result"
  },
  8: {
    heading: "Visualize",
    subheading: "Try out different Pathfinding Algorithms and Randomized mazes! Check out this project on ",
    content: [""],
    imgPath: page2Img,
    alt: "visualize"
  }
}

const pageSize = Object.keys(guide).length;

export function Guide(props) {

  let { setGuideDialog, guideDialog } = props;
  const [page, setPage] = useState(1);

  const handleNext = () => {
    if (page !== pageSize) {
      setPage(page + 1);
    }
  }
  const handlePrevious = () => {
    if (page !== 1) {
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
          <h2>{guide[page].subheading} {page === 8 ? <a href="https://github.com/Hari01V/path-visualizer" target="_blank" rel="noopener noreferrer">Github</a> : ""}</h2>
          {guide[page].content.map((para, index) =>
            <p key={index}>{para}</p>
          )}
          <img src={guide[page].imgPath}
            alt={guide[page].alt}
            className="guide-img" />
        </div>
        <div className="controls">
          <button id="controls-left-btn" className="controls-btn"
            onClick={handlePrevious} disabled={page <= 1}><ArrowLeftIcon /></button>
          <div className="page-indicator">
            {Object.keys(guide).map(key =>
              <div className={`indicator ${page == key ? "active" : ""}`}
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