import { useEffect, useState, useMemo } from 'react';
import Square from './Square';
import React from 'react';

interface BoardProps {
  readonly xIsNext: boolean;
  readonly squares: Array<string | null>;
  readonly onPlay: (squares: Array<string | null>, { x, y }: { x: number; y: number }) => void;
  readonly boardSize?: number;
}

/**
 * Custom hook to calculate the winner of the game
 * @param squares Board squares
 * @param boardSize Board size
 * @returns Winner and winning line
 */
const useCalculateWinner = (squares: Array<string | null>, boardSize: number): [string | null, Array<number>] => {
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < boardSize; i++) {
      result.push(
        Array.from({ length: boardSize }, (_, j) => i * boardSize + j), // rows
        Array.from({ length: boardSize }, (_, j) => j * boardSize + i) // columns
      );
    }
    // diagonals
    result.push(Array.from({ length: boardSize }, (_, i) => i * boardSize + i));
    result.push(Array.from({ length: boardSize }, (_, i) => i * boardSize + boardSize - 1 - i));
    return result;
  }, [boardSize]);

  for (const line of lines) {
    for (let i = 1; i < line.length; i++) {
      if (squares[line[i]] !== squares[line[0]]) {
        break;
      }
      if (i === line.length - 1) {
        return [squares[line[0]] as string, line];
      }
    }
  }
  return [null, []];
};

const Board: React.FC<BoardProps> = ({ xIsNext, squares, onPlay, boardSize = 3 }: BoardProps) => {
  const [winner, winningLine] = useCalculateWinner(squares, boardSize);

  const handleClick = (index: number) => {
    if (squares[index] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, { x: Math.floor(index / boardSize), y: index % boardSize });
  };

  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => {
    let statusMessage;
    if (winner) {
      statusMessage = `Winner: ${winner}`;
    } else if (squares.every(Boolean)) {
      statusMessage = "It's a draw!";
    } else {
      statusMessage = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
    setStatus(statusMessage);
  }, [xIsNext, squares, winner]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-semibold text-xl">{status}</div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: boardSize }, (_, row) => (
          <div key={`row_${row}`} className="flex gap-1">
            {Array.from({ length: boardSize }, (_, col) => row * boardSize + col).map((index) => (
              <Square
                key={`cell_${index}`}
                value={squares[index]}
                onClick={() => handleClick(index)}
                highlight={!!(winner && winningLine.includes(index))}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Board);
