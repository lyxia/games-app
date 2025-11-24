import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameInfo } from '../utils/gameScanner';

interface GameCardProps {
  game: GameInfo;
}

// 学科分类中文标签映射
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    english: '英语',
    math: '数学',
    science: '科学',
    chinese: '语文',
    music: '音乐',
    art: '美术'
  };
  return labels[category] || category;
};

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.category}/${game.folderName}`);
  };

  const categoryColors: Record<string, {
    bg: string;
    border: string;
    text: string;
    badge: string;
  }> = {
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
    },
    science: {
      bg: 'bg-gradient-to-br from-purple-400 to-pink-500',
      border: 'border-purple-300',
      text: 'text-purple-800',
      badge: 'bg-purple-100 text-purple-700'
    }
  };

  // 使用默认样式作为后备
  const defaultColors = {
    bg: 'bg-gradient-to-br from-gray-400 to-gray-500',
    border: 'border-gray-300',
    text: 'text-gray-800',
    badge: 'bg-gray-100 text-gray-700'
  };

  const colors = categoryColors[game.category] || defaultColors;

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
            {getCategoryLabel(game.category)}
          </span>
        </div>
        <p className="text-white/90 text-sm flex-grow line-clamp-3">
          {game.description}
        </p>
        <div className="mt-4 flex items-center text-white/80 text-sm font-medium">
          <span>开始学习 →</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
    </div>
  );
};

export default GameCard;

