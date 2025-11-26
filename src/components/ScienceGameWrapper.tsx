import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LivePreview } from './LivePreview';
import { Creation } from './CreationHistory';

interface Props {
  dataPath: string;
  gameName: string;
}

const ScienceGameWrapper: React.FC<Props> = ({ dataPath, gameName }) => {
  const navigate = useNavigate();
  const [creation, setCreation] = useState<Creation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        setIsLoading(true);
        // 拼接 base URL，处理开发/生产环境路径差异
        const baseUrl = import.meta.env.BASE_URL;
        const fullPath = dataPath.startsWith('/')
          ? `${baseUrl}${dataPath.slice(1)}`
          : `${baseUrl}${dataPath}`;
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`加载失败: ${response.status}`);
        }
        const data = await response.json();
        setCreation(data);
        setError(null);
      } catch (err) {
        console.error('加载游戏数据失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadGameData();
  }, [dataPath]);

  const handleReset = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-xl mb-4">加载游戏失败</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* 返回按钮覆盖层 */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </button>
      </div>

      <LivePreview
        creation={creation}
        isLoading={isLoading}
        isFocused={true}
        onReset={handleReset}
      />
    </div>
  );
};

export default ScienceGameWrapper;
