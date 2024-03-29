import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'


const Square = (props) => (
  <button
    className="square"
    onClick={props.onClick}
    style={props.isWinningSquare ? { backgroundColor: '#fff', color: '#222' } : null}
  >
    {props.value}
  </button>
)

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      isWinningSquare={this.props.winningLine && this.props.winningLine.includes(i)}
    />
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map(parentElement => (
          <div className="board-row" key={parentElement}>
            {[0, 1, 2].map(childElement => (
              <span key={childElement}>
                {this.renderSquare(childElement + parentElement * 3)}
              </span>
            ))}
          </div>
        )
        )}
      </div>
    )
  }
}


class Game extends React.Component {
  state = {
    history: [{
      squares: Array(9).fill(null),
    }],
    xIsNext: true,
    stepNumber: 0,
    squareClicked: [],
    sortAsc: true,
  }
  winningLine: null

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        this.winningLine = [a, b, c]
        return squares[a]
      }
    }
    this.winningLine = null
    return null
  }
  

  showColumnAndRow(i) {
    return (i % 3) + 1 + ', ' + (Math.floor(i / 3) + 1)
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (this.calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      squareClicked: this.state.squareClicked.slice(0, this.state.stepNumber).concat([this.showColumnAndRow(i)]),
    })
  }

  handleSort = () => {
    this.setState({ sortRaising: !this.state.sortRaising })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = this.calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ?
        'Przejdź do ruchu #' + move + ` (${this.state.squareClicked[move - 1]})` :
        'Przejdź na początek gry'
      return (
        <li key={move}>
          <button className='step-number'
            onClick={() => this.jumpTo(move)}
            style={move === this.state.stepNumber ? { fontWeight: 'bold' } : null}
          >
            {desc}
          </button>
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Wygrywa: ' + winner
    } else {
      status = this.state.stepNumber >= 9 ? 'Remis!' : 'Następny gracz: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={this.winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <button
            onClick={this.handleSort}
          >
            Sortuj
          </button>
          <ul>{this.state.sortRaising ? moves : moves.slice().reverse()}</ul>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

