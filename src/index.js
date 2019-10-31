import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  function LastMove(props) {
    return (
      <div>Last Move: Row: {props.row}, Column: {props.col}</div>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square 
               value={this.props.squares[i]}
               onClick={() => this.props.onClick(i)}
             />;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          moveLocation: {
            row: null,
            col: null
          }
        }],
        xNext: true,
        stepNumber: 0
      };
    }

    handleClick(value) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const moveLocation = getMoveLocation(value);

      if (calculateWinner(squares) || squares[value]) {
        return;
      } 

      squares[value] = this.state.xNext ? "X" : "O";

      this.setState({
        history: history.concat([{
          squares: squares,
          moveLocation: {
            row: moveLocation[0],
            col: moveLocation[1]  
          }
        }]),
        stepNumber: history.length,
        xNext: !this.state.xNext,
      });      
    }

    jumpTo(move) {
      this.setState({
        stepNumber: move,
        xNext: (move % 2) === 0
      });   
    }

    renderMoveString(location) {
      if (location.row != null && location.col != null) {
        return <LastMove row={location.row + 1} col={location.col + 1} />
      }
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const location = current.moveLocation;
      const winner = calculateWinner(current.squares);

      if (!winner && (history.length - 1) === current.squares.length) {
        console.log("NO WINNER!");
      } 
      
      // console.log(JSON.stringify(location,null,2));

      const moves = history.map((step, move) => {
        const selected = move === this.state.stepNumber ? 'green-btn' : '';
        const desc = move ?
          'Move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button className={selected} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;

      if (winner) {
        status = 'Winner is ' + winner + "!";
      } else if ((history.length - 1) === current.squares.length) {
        status = 'The result is a draw!';
      } else {
        status = 'Current player: ' + (this.state.xNext ? "X" : "O");
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              />
          </div>
          <div className="game-info">
            <div>{status}</div>
            {this.renderMoveString(location)}
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return null;
  }

  function getMoveLocation(squareKey) {
    let smap = [
       [0,0],
       [0,1],
       [0,2],
       [1,0],
       [1,1],
       [1,2],
       [2,0],
       [2,1],
       [2,2]
    ]
    console.log(smap[squareKey]);
    return smap[squareKey];
 }
