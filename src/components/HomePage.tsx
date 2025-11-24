import React from 'react';
import { games, getGamesByCategory } from '../utils/gameScanner';
import GameCard from './GameCard';

const HomePage: React.FC = () => {
  const englishGames = getGamesByCategory('english');
  const mathGames = getGamesByCategory('math');
  const scienceGames = getGamesByCategory('science');

  return (
    <div className="min-h-screen p-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
            小学生专项练习中心
          </h1>
          <p className="text-xl text-gray-600">
            选择你需要的练习，开始学习之旅吧！
          </p>
        </div>

        {/* 英语游戏区域 */}
        {englishGames.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">📚</span>
                <h2 className="text-3xl font-bold text-blue-600">英语</h2>
              </div>
              <div className="flex-grow h-1 bg-gradient-to-r from-blue-200 to-transparent ml-4 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {englishGames.map((game) => (
                <GameCard key={game.path} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* 数学游戏区域 */}
        {mathGames.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🔢</span>
                <h2 className="text-3xl font-bold text-green-600">数学</h2>
              </div>
              <div className="flex-grow h-1 bg-gradient-to-r from-green-200 to-transparent ml-4 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {mathGames.map((game) => (
                <GameCard key={game.path} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* 科学游戏区域 */}
        {scienceGames.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🔬</span>
                <h2 className="text-3xl font-bold text-purple-600">科学</h2>
              </div>
              <div className="flex-grow h-1 bg-gradient-to-r from-purple-200 to-transparent ml-4 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {scienceGames.map((game) => (
                <GameCard key={game.path} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>共有 {games.length} 个练习可供选择</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

