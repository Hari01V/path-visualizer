const visualize_Dijkstra = (board) => {
  let no_of_rows = board.length;
  let no_of_cols = board[0].length;

  let start_node = null;
  let end_node = null;
  for (let i = 0; i < no_of_rows; i++) {
    for (let j = 0; j < no_of_cols; j++) {
      if (board[i][j].isStart) {
        start_node = board[i][j];
      } else if (board[i][j].isEnd) {
        end_node = board[i][j];
      }
    }
  }

  const neighbours = find_neighbours(start_node, no_of_rows, no_of_cols, board);
  console.log(neighbours);
}

const find_neighbours = (node, rows, cols, board) => {
  let { row, col } = node;
  let arr = [];
  if (row + 1 < rows) {
    arr.push({ row: row + 1, col: col });
  }
  if (row - 1 >= 0) {
    arr.push({ row: row - 1, col: col });
  }
  if (col + 1 < cols) {
    arr.push({ row: row, col: col + 1 });
  }
  if (col - 1 >= 0) {
    arr.push({ row: row, col: col - 1 });
  }
  return arr;
}

export default visualize_Dijkstra;