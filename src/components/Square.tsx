import React from 'react';

interface SquareProps {
  readonly value: string | null;
  readonly onClick: () => void;
  readonly highlight?: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, highlight }) => {
  return (
    <button
      className={`size-16 text-4xl font-bold border ${
        highlight ? 'bg-yellow-200' : 'bg-white'
      } hover:bg-gray-100 transition-colors duration-200`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default React.memo(Square);
