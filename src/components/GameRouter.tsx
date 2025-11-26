import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameByPath, getGameUrl } from '../utils/gameScanner';
import IframeGameWrapper from './IframeGameWrapper';
import ScienceGameWrapper from './ScienceGameWrapper';
import EnglishGameWrapper from './EnglishGameWrapper';

const GameRouter: React.FC = () => {
  const { category, gameName } = useParams<{ category: string; gameName: string }>();
  const navigate = useNavigate();

  if (!category || !gameName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">游戏路径错误</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const game = getGameByPath(category, gameName);
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">游戏未找到</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // 英语类型游戏：加载 LessonPlan JSON，渲染 GameScreen
  if (game.type === 'english') {
    if (!game.dataPath) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">游戏配置错误：缺少数据路径</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              返回首页
            </button>
          </div>
        </div>
      );
    }
    return <EnglishGameWrapper dataPath={game.dataPath} gameName={game.name} />;
  }

  // 科学类型游戏：通过 JSON 加载数据，使用 LivePreview 渲染
  if (game.type === 'science') {
    if (!game.dataPath) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">游戏配置错误：缺少数据路径</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              返回首页
            </button>
          </div>
        </div>
      );
    }
    return <ScienceGameWrapper dataPath={game.dataPath} gameName={game.name} />;
  }

  // iframe 类型游戏：通过 iframe 加载独立构建的游戏
  const gameUrl = getGameUrl(game);
  return <IframeGameWrapper src={gameUrl} gameName={game.name} devPort={game.devPort} />;
};

export default GameRouter;
