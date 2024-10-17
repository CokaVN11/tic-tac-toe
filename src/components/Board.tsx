import { useEffect, useState, useMemo } from 'react';
import Square from './Square';
import React from 'react';

interface BoardProps {
  readonly xIsNext: boolean;
  readonly squares: Array<string | null>;
  readonly onPlay: (squares: Array<string | null>) => void;
  readonly boardSize?: number;
}

const useCalculateWinner = (squares: Array<string | null>, boardSize: number): string | null => {
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
        return squares[line[0]];
      }
    }
  }
  return null;
};

const Board: React.FC<BoardProps> = ({ xIsNext, squares, onPlay, boardSize = 3 }: BoardProps) => {
  const winner = useCalculateWinner(squares, boardSize);

  const handleClick = (index: number) => {
    if (squares[index] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  };

  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => {
    setStatus(
      winner ? `Winner: ${winner}` : squares.every(Boolean) ? "It's a draw!" : `Next player: ${xIsNext ? 'X' : 'O'}`
    );
  }, [xIsNext, squares, winner]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-semibold text-xl">{status}</div>
      <div className="gap-1 grid" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            highlight={!!(winner && winner === value)}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Board);
