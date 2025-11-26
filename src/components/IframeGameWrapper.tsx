import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  src: string;
  gameName: string;
  devPort?: number;
}

const IframeGameWrapper: React.FC<Props> = ({ src, gameName, devPort }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isDev = import.meta.env.DEV;

  // 在开发模式下检测游戏服务器是否可用
  useEffect(() => {
    if (isDev && devPort) {
      const checkServer = async () => {
        try {
          // 尝试连接游戏服务器
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          await fetch(`http://localhost:${devPort}`, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          setLoading(false);
          setError(false);
        } catch {
          setLoading(false);
          setError(true);
        }
      };
      checkServer();
    } else {
      setLoading(false);
    }
  }, [isDev, devPort]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  // 开发模式下服务器未启动的提示
  if (isDev && error && devPort) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <button
          onClick={() => navigate('/')}
          className="fixed top-4 left-4 z-50 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{gameName}</h2>
          <p className="text-gray-600 mb-6">
            游戏开发服务器未启动
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-gray-500 mb-2">请在终端运行：</p>
            <code className="text-sm font-mono text-purple-600">
              npm run dev:game
            </code>
            <p className="text-xs text-gray-400 mt-2">
              然后选择「{gameName}」(端口: {devPort})
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* 返回按钮 - 覆盖在 iframe 上方 */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
      >
        <span>←</span>
        <span>返回首页</span>
      </button>

      {/* 加载指示器 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载游戏中...</p>
          </div>
        </div>
      )}

      {/* 游戏 iframe */}
      <iframe
        src={src}
        title={gameName}
        className="w-full h-full border-0"
        allow="fullscreen"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
};

export default IframeGameWrapper;
