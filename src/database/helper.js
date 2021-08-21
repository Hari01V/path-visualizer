import visualize_Dijkstra from '../Algorithms/dijkstra';
import visualize_BFS from '../Algorithms/bfs';
import visualize_DFS from '../Algorithms/dfs';
import visualize_Astar from '../Algorithms/astar';
import visualize_greedy from '../Algorithms/greedyBFS';
import visualize_biBFS from '../Algorithms/bidirectionalBFS';

import recursiveDivision from '../MazeAlgorithms/recursiveDivision';
import weightHexCage from '../MazeAlgorithms/weightHexCage';
import concentricMaze from '../MazeAlgorithms/concentricMaze';
import recurDivVertical from '../MazeAlgorithms/recurDivVertical';
import recurDivHorizontal from '../MazeAlgorithms/recurDivHorizontal';

let OPTIONS = {
  "algorithm": [
    { name: "Dijkstra's Algorithm", value: "dijkstra", method: visualize_Dijkstra, isWeighted: true, checkPointNotAllowed: false },
    { name: "A* Search Algorithm", value: "astar", method: visualize_Astar, isWeighted: true, checkPointNotAllowed: false },
    { name: "Breadth First Search", value: "bfs", method: visualize_BFS, isWeighted: false, checkPointNotAllowed: false },
    { name: "Depth First Search", value: "dfs", method: visualize_DFS, isWeighted: false, checkPointNotAllowed: false },
    { name: "Greedy Best First", value: "greedy", method: visualize_greedy, isWeighted: true, checkPointNotAllowed: false },
    { name: "Bi-directional BFS", value: "biBFS", method: visualize_biBFS, isWeighted: false, checkPointNotAllowed: true }
  ],
  "speed": [
    { name: "Fast", value: "fast" },
    { name: "Normal", value: "normal" },
    { name: "Slow", value: "slow" }
  ],
  "maze": [
    { name: "Recursive Division", method: recursiveDivision, value: "recursive-div" },
    { name: "Recursive Vertical Skew", method: recurDivVertical, value: "recursive-div-vertical" },
    { name: "Recursive Horizontal Skew", method: recurDivHorizontal, value: "recursive-div-horizontal" },
    { name: "Weight Hex Cage", method: weightHexCage, value: "weight-hex" },
    { name: "Concentric Maze", method: concentricMaze, value: "concentric" }
  ],
  "weight": [
    { name: "very less : 5", value: 5 },
    { name: "less : 10", value: 10 },
    { name: "moderate : 20", value: 20 },
    { name: "high : 30", value: 30 },
    { name: "very high : 50", value: 50 }
  ]
}

let ALGO_DESC = {
  "": "Pick an Algorithm!",
  "bfs": "Breadth-first Search is <strong>unweighted</strong> and <strong>guarantees</strong> the shortest path!",
  "dijkstra": "Dijkstra's Algorithm is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!",
  "astar": "A* Search is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!",
  "dfs": "Depth-first Search is <strong>unweighted</strong> and does <strong>not guarantee</strong> the shortest path!",
  "greedy": "Greedy Best-first Search is <strong>weighted</strong> and does <strong>not guarantee</strong> the shortest path!",
  "biBFS": "Bi-Directional Breadth-First-Search is <strong>unweighted</strong> and <strong>guarantees</strong> the shortest path!"
}

export { OPTIONS, ALGO_DESC };