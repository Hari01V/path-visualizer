/*

=> WHEN WE CREATE WALLS CONTINUOUSLY BY DRAGGING, IT DOES'NT RERENDER

=> WHEN RELOCATE THE START NODE, IT RERENDERS EVERYTIME


BFS : (QUEUE)
  # Find Neighbours
  # Visit each neighbour
  # Check if End point

DFS : (STACK)
  # Find Neighbours
  # Push them in the Stack
  # Pop from stack and Visit it
  # Check if End Point

DIJKSTRA :
  # SPT -> Shortest Path Tree
  # Find Neighbours
  # IF node not been to SPT, push it to SPT
  # Pop the node with min weight
  # Visit the popped node and check if End point

A STAR :
  # manhattan heuristic (h)
  # f = g + h
  # Find Neighbours
  # If a node is present in OPENLIST with LowerF than currNode, then skip the currNode
  # Sort OpenList wrt F value
  # Pop a node from Openlist and Vist it and then push it to ClosedList

GREEDY (Best First Search):
  # same as A* but instead of updating the weigths, use only the current weight!

SWARM :

BIDIRECTIONAL SWARM :

ITERATIVE DEEPENING :


*/