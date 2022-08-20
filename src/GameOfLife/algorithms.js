// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path

import { BIRTH, getInitialGrid, OVERPOPULATION, UNDERPOPULATION } from "./GameOfLife";

export function evolveGrid(grid) {
	const allNodes = getAllNodes(grid);
	const newGrid = getInitialGrid();
	for (const curNode of allNodes) {
		const newNode = {
			...curNode,
			isAlive: isNextIterationAlive(curNode, grid)
		}
		newGrid[curNode.row][curNode.col] = newNode;
	}
	return newGrid
}

function isNextIterationAlive(node, grid) {
	const neighbors = [];
	const {col, row} = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
	if (row > 0 && col > 0) 					neighbors.push(grid[row - 1][col - 1]);
	if (row > 0 && col < grid[0].length - 1) 	neighbors.push(grid[row - 1][col + 1]);
	if (row < grid.length - 1 && col > 0) 		neighbors.push(grid[row + 1][col - 1]);
	if (row < grid.length - 1 && col < grid[0].length - 1) neighbors.push(grid[row + 1][col + 1]);
	const liveNeighbors = neighbors.filter(neighbor => neighbor.isAlive).length;
	
	if (node.isAlive) {
		const survives = UNDERPOPULATION < liveNeighbors && liveNeighbors < OVERPOPULATION;
		if (survives) {
		}
		return UNDERPOPULATION < liveNeighbors && liveNeighbors < OVERPOPULATION;
	}
	else {
		const isBorn = liveNeighbors === BIRTH;
		if (isBorn) {
		}
		return isBorn;
	}
}


  
  function sortNodesByDistance(unvisitedNodes) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
function updateUnvisitedNeighbors(node, grid) {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of unvisitedNeighbors) {
	  neighbor.distance = node.distance + 1;
	  neighbor.previousNode = node;
	}
  }
  
  function getUnvisitedNeighbors(node, grid) {
	const neighbors = [];
	const {col, row} = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
	return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  function getAllNodes(grid) {
	const nodes = [];
	for (const row of grid) {
	  for (const node of row) {
		nodes.push(node);
	  }
	}
	return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
	const nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	while (currentNode !== null) {
	  nodesInShortestPathOrder.unshift(currentNode);
	  currentNode = currentNode.previousNode;
	}
	return nodesInShortestPathOrder;
  }