import './GameOfLife.css';
import React, {Component} from 'react';
import Node from './Node/Node';
import { dijkstra, evolveGrid, getNodesInShortestPathOrder } from './algorithms';
import { AwesomeButton } from "react-awesome-button";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const NUM_ROWS = 22;
const NUM_COLS = 22;
export const UNDERPOPULATION = 1;
export const OVERPOPULATION = 4;
export const BIRTH = 3;

export default class GameOfLife extends Component {
    constructor() {
        super();
        console.log('I was triggered during constructor');
        this.state = {
          grid: [],
          mouseIsPressed: false,
          isPaused: false,
          statesPerSec: 1,
        };
    }
    
    componentDidMount() {
      this.resetGrid();
    }

    resetGrid() {
      const grid = getInitialGrid();
      this.setState({grid});
    }
    
    handleMouseDown(row, col) {
      const newGrid = getNewGridWithLifeToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  
    handleMouseEnter(row, col) {
      if (!this.state.mouseIsPressed) return;
      const newGrid = getNewGridWithLifeToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
  
    handleMouseUp() {
      this.setState({mouseIsPressed: false});
    }
  
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder);
          }, 10 * i);
          return;
        }
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }, 10 * i);
      }
    }
    
    animateShortestPath(nodesInShortestPathOrder) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }, 50 * i);
      }
    }

    visualizeGameOfLife() {
      this.setState({isPaused: false});
      setTimeout(() => {
        const curGrid = this.state.grid;
        const newGrid = evolveGrid(curGrid);
        if (!this.state.isPaused) {
          this.setState({grid: newGrid});
          this.visualizeGameOfLife();
        }
      }, (1 / this.state.statesPerSec) * 1500 );
    }
  
    visualizeDijkstra() {
      const {grid} = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  
    render() {
      const {grid, mouseIsPressed} = this.state;
      console.log('I was triggered during render');
      return (
        <>
          <button onClick={() => this.visualizeGameOfLife()}>
            Play Conway's Game of Life
          </button>
          <button onClick={() => this.setState({isPaused: true})}>
            Pause
          </button>
          <button onClick={() => this.resetGrid()}>
            Clear
          </button>
          <button onClick={() => console.log(this.state.grid)}>
            PrintGrid
          </button>
          {this.getButton("This is a button")}
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, isAlive} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isAlive={isAlive}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      );
    }
}

function getButton(name) {
  return <AwesomeButton type="primary">{name}</AwesomeButton>
}

export const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < NUM_COLS; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // const createNode = (col, row) => {
  //   return {
  //     col,
  //     row,
  //     isStart: row === START_NODE_ROW && col === START_NODE_COL,
  //     isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  //     distance: Infinity,
  //     isVisited: false,
  //     isWall: false,
  //     previousNode: null,
  //   };
  // };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isAlive: false,
    };
  };

  // const getNewGridWithWallToggled = (grid, row, col) => {
  //   const newGrid = grid.slice();
  //   const node = newGrid[row][col];
  //   const newNode = {
  //     ...node,
  //     isWall: !node.isWall,
  //   };
  //   newGrid[row][col] = newNode;
  //   return newGrid;
  // };

  const getNewGridWithLifeToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isAlive: !node.isAlive,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

