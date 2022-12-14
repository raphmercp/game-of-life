import './GameOfLife.css';
import React, {Component} from 'react';
import Node from './Node/Node';
import { dijkstra, evolveGrid, getNodesInShortestPathOrder } from './algorithms';
import Button from './Components/Button';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const NUM_ROWS = 22;
const NUM_COLS = 33;
export const UNDERPOPULATION = 1;
export const OVERPOPULATION = 5;
export const BIRTH = 3;

export default class GameOfLife extends Component {
    constructor() {
        super();
        console.log('I was triggered during constructor');
        this.state = {
          grid: [],
          mouseIsPressed: false,
          isPaused: true,
          statesPerSec: 2,
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
  
    // animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    //   for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    //     if (i === visitedNodesInOrder.length) {
    //       setTimeout(() => {
    //         this.animateShortestPath(nodesInShortestPathOrder);
    //       }, 10 * i);
    //       return;
    //     }
    //     setTimeout(() => {
    //       const node = visitedNodesInOrder[i];
    //       document.getElementById(`node-${node.row}-${node.col}`).className =
    //         'node node-visited';
    //     }, 10 * i);
    //   }
    // }
    
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
      console.log("starting game of life");
      this.setState({isPaused: false});
      setTimeout(() => {
        const curGrid = this.state.grid;
        const newGrid = evolveGrid(curGrid);
        if (!this.state.isPaused) {
          this.setState({grid: newGrid});
          this.visualizeGameOfLife();
        }
      }, (1 / this.state.statesPerSec) * 1000 );
    }
  
    render() {
      const {grid, mouseIsPressed} = this.state;
      const handleSliderChange = (e) => this.setState({statesPerSec: e.target.value})
      console.log('I was triggered during render');
      return (
        <div>
          <h1>Conway's Game of Life</h1>
          <div>
            <Button text="Start" hoverColor="green" disabled={!this.state.isPaused} onClick={() => this.visualizeGameOfLife()}></Button>
            <Button text="Stop" onClick={() => this.setState({isPaused: true})}></Button>
            <Button text="Clear" onClick={() => this.resetGrid()}></Button>
            <Button text="Print Grid" onClick={() => console.log(this.state.grid)}></Button>
            <label id="bar-label" for="speedbar">Speed</label>
            <input type="range" id="speedbar" min="0.2" max="10" value={this.state.statesPerSec} onChange={handleSliderChange}></input>
          </div>
          <div>
          </div>
            <div className="grid" id="game-grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div className="grid-row" key={rowIdx}>
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
        </div>
      );
    }
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

