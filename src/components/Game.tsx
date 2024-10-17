import { useCallback, useEffect, useState } from 'react';
import Board from './Board';

type HistoryState = {
  squares: Array<string | null>;
  currentMove?: { x: number; y: number };
};

const Game: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([
    { squares: Array(9).fill(null), currentMove: { x: 0, y: 0 } },
  ]);
  const [historyOrder, setHistoryOrder] = useState<'asc' | 'desc'>('asc');
  const [historyMoves, setHistoryMoves] = useState<JSX.Element[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [boardSize, setBoardSize] = useState(3);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  const handlePlay = useCallback(
    (nextSquares: Array<string | null>, { x, y }: { x: number; y: number }) => {
      const nextHistory = [
        ...history.slice(0, currentMove + 1),
        {
          squares: nextSquares,
          currentMove: { x, y },
        },
      ];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    },
    [history, currentMove]
  );

  const jumpTo = useCallback((move: number) => {
    setCurrentMove(move);
  }, []);

  const handleBoardSizeChange = useCallback((newSize: number) => {
    setBoardSize(newSize);
    setHistory([{ squares: Array(newSize ** 2).fill(null) }]);
    setCurrentMove(0);
  }, []);

  useEffect(() => {
    setHistory([{ squares: Array(boardSize ** 2).fill(null) }]);
    setCurrentMove(0);
  }, [boardSize]);

  useEffect(() => {
    setHistoryMoves(
      history.map((_, move) => {
        let description;
        if (move === currentMove) {
          description = `You are at move #${move + 1}`;
        } else if (move > 0) {
          const currentMove = history[move].currentMove ?? { x: 0, y: 0 };
          description = `Go to move #${move + 1}, (${currentMove.x + 1}, ${currentMove.y + 1})`;
        } else {
          const currentMove = history[move].currentMove ?? { x: 0, y: 0 };
          description = `Go to game start, (${currentMove.x + 1}, ${currentMove.y + 1})`;
        }

        return (
          <li key={move} className="mb-2">
            {move === currentMove ? (
              <strong>{description}</strong>
            ) : (
              <button className={`px-3 py-1 rounded bg-blue-500 text-white`} onClick={() => jumpTo(move)}>
                {description}
              </button>
            )}
          </li>
        );
      })
    );
  }, [history, currentMove, jumpTo]);

  useEffect(() => {
    setHistoryMoves((prev) => prev.slice().reverse());
  }, [historyOrder]);

  return (
    <div className="flex md:flex-row flex-col justify-center items-center gap-8 p-4">
      <div className="w-full md:w-auto">
        <div className="mb-4">
          <label htmlFor="boardSize" className="mr-2">
            Board Size:
          </label>
          <input
            id="boardSize"
            type="number"
            min="3"
            max="10"
            defaultValue="3"
            value={boardSize}
            onChange={(e) => handleBoardSizeChange(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          />
        </div>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={boardSize} />
      </div>
      <div className="w-full md:w-64">
        <h2 className="mb-2 font-semibold text-lg">Game History</h2>
        {/* Toggle sort order */}
        <button
          className="bg-blue-50 hover:bg-blue-100 mb-2 px-3 py-1 rounded-lg text-blue-500 transition-colors duration-200"
          onClick={() => setHistoryOrder(historyOrder === 'asc' ? 'desc' : 'asc')}
        >
          {historyOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
        </button>
        <ol>{historyMoves}</ol>
      </div>
    </div>
  );
};

export default Game;
