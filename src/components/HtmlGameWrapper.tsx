import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LivePreview } from './LivePreview';
import { Creation } from './CreationHistory';

interface HtmlGameWrapperProps {
  dataPath: string;
  gameName: string;
}

export default function HtmlGameWrapper({ dataPath, gameName }: HtmlGameWrapperProps) {
  const navigate = useNavigate();
  const [creation, setCreation] = useState<Creation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGameData() {
      try {
        setIsLoading(true);
        setError(null);

        // 处理路径：如果是绝对路径（以 / 开头），需要加上 base 路径
        const basePath = import.meta.env.BASE_URL || '/';
        const fullPath = dataPath.startsWith('/')
          ? `${basePath.replace(/\/$/, '')}${dataPath}`
          : dataPath;

        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`加载失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // 确保时间戳是 Date 对象
        if (data.timestamp) {
          data.timestamp = new Date(data.timestamp);
        }

        setCreation(data);
      } catch (err) {
        console.error('加载游戏数据失败:', err);
        setError(err instanceof Error ? err.message : '加载游戏数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadGameData();
  }, [dataPath]);

  const handleReset = () => {
    // 重新加载游戏数据
    window.location.reload();
  };

  const handleBack = () => {
    navigate('/');
  };

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">加载失败</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              返回首页
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 加载状态或正常渲染 LivePreview
  return (
    <div className="relative">
      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm"
      >
        <ArrowLeft size={20} />
        返回首页
      </button>

      {/* LivePreview 组件 */}
      <LivePreview
        creation={creation}
        isLoading={isLoading}
        isFocused={true}
        onReset={handleReset}
      />
    </div>
  );
}
