import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameScreen, { LessonPlan } from './GameScreen';

interface Props {
  dataPath: string;
  gameName: string;
}

const buildAssetUrl = (dataPath: string) => {
  const baseUrl = import.meta.env.BASE_URL;
  if (!dataPath) return baseUrl;
  return dataPath.startsWith('/')
    ? `${baseUrl}${dataPath.slice(1)}`
    : `${baseUrl}${dataPath}`;
};

const isLessonPlan = (data: unknown): data is LessonPlan => {
  if (!data || typeof data !== 'object') return false;
  const lesson = data as LessonPlan;
  return (
    typeof lesson.title === 'string' &&
    Array.isArray(lesson.items)
  );
};

const EnglishGameWrapper: React.FC<Props> = ({ dataPath }) => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setIsLoading(true);
        const fullPath = buildAssetUrl(dataPath);
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`加载失败: ${response.status}`);
        }
        const data = await response.json();
        if (!isLessonPlan(data)) {
          throw new Error('JSON 结构不符合 LessonPlan 要求');
        }
        setLesson(data);
        setError(null);
      } catch (err) {
        console.error('加载课程数据失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [dataPath]);

  const handleExit = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">课程加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-xl mb-4">加载课程失败</p>
          <p className="text-gray-600 mb-4">{error || '未知错误'}</p>
          <button
            onClick={handleExit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </button>
      </div>

      <GameScreen lesson={lesson} onExit={handleExit} />
    </div>
  );
};

export default EnglishGameWrapper;

