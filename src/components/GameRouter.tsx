import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameByPath } from '../utils/gameScanner';

const GameRouter: React.FC = () => {
  const { category, gameName } = useParams<{ category: string; gameName: string }>();
  const navigate = useNavigate();

  if (!category || !gameName) {
    return <div>游戏路径错误</div>;
  }

  const game = getGameByPath(category, gameName);
  if (!game) {
    return <div>游戏未找到</div>;
  }

  // 动态导入游戏组件
  const getGameComponent = () => {
    switch (game.path) {
      case 'english/grammar-adventure-1':
        return lazy(() => import('@/english/grammar-adventure-1/App'));
      case 'english/word-magic-factory-2':
        return lazy(() => import('@/english/word-magic-factory-2/App'));
      case 'english/plural-verbs-3':
        return lazy(() => import('@/english/plural-verbs-3/App'));
      case 'english/logic-&-writing-builder-4':
        return lazy(() => import('@/english/logic-&-writing-builder-4/App'));
      case 'math/parallel-lines-1':
        return lazy(() => 
          import('@/math/parallel-lines-1/index')
            .then(m => ({ default: m.App }))
            .catch(err => {
              console.error('加载游戏失败:', err);
              throw err;
            })
        );
      default:
        return null;
    }
  };

  const GameComponent = getGameComponent();

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">游戏组件未找到</p>
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

  return (
    <div className="min-h-screen">
      {/* 返回按钮 - 使用更高的 z-index 确保显示在最上层 */}
      <div className="fixed top-4 left-4 z-[9999]">
        <button
          onClick={() => navigate('/')}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-2 text-gray-700 font-medium hover:scale-105"
        >
          <span>←</span>
          <span>返回首页</span>
        </button>
      </div>

      {/* 游戏内容 */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">加载游戏中...</p>
            </div>
          </div>
        }
      >
        <GameComponent />
      </Suspense>
    </div>
  );
};

export default GameRouter;

