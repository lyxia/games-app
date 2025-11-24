import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameInfo } from '../utils/gameScanner';

interface GameCardProps {
  game: GameInfo;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.category}/${game.folderName}`);
  };

  const categoryColors = {
    english: {
      bg: 'bg-gradient-to-br from-blue-400 to-purple-500',
      border: 'border-blue-300',
      text: 'text-blue-800',
      badge: 'bg-blue-100 text-blue-700'
    },
    math: {
      bg: 'bg-gradient-to-br from-green-400 to-teal-500',
      border: 'border-green-300',
      text: 'text-green-800',
      badge: 'bg-green-100 text-green-700'
    }
  };

  const colors = categoryColors[game.category];

  return (
    <div
      onClick={handleClick}
      className={`
        ${colors.bg}
        ${colors.border}
        relative overflow-hidden rounded-2xl shadow-lg
        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
        cursor-pointer border-2
        min-h-[200px] flex flex-col
      `}
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {game.name}
          </h3>
          <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2`}>
            {game.category === 'english' ? '英语' : '数学'}
          </span>
        </div>
        <p className="text-white/90 text-sm flex-grow line-clamp-3">
          {game.description}
        </p>
        <div className="mt-4 flex items-center text-white/80 text-sm font-medium">
          <span>开始游戏 →</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
    </div>
  );
};

export default GameCard;

