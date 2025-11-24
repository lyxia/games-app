
import React from 'react';
import { Level } from '../types';

interface ProgressBarProps {
  currentLevel: Level;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel }) => {
  const getProgress = () => {
    switch (currentLevel) {
      case Level.LESSON_THIRD_PERSON: return 10;
      case Level.GAME_EAGLE_EYE: return 30;
      case Level.LESSON_BE_VERB: return 50;
      case Level.GAME_BE_VERB: return 80;
      case Level.VICTORY: return 100;
      default: return 0;
    }
  };

  const getTitle = () => {
    switch (currentLevel) {
      case Level.LESSON_THIRD_PERSON: return "第一关：秘籍 - 谁是三单？";
      case Level.GAME_EAGLE_EYE: return "第二关：挑战 - 火眼金睛";
      case Level.LESSON_BE_VERB: return "第三关：秘籍 - Be动词法则";
      case Level.GAME_BE_VERB: return "第四关：挑战 - Be动词大作战";
      case Level.VICTORY: return "通关大吉！";
      default: return "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-4 pt-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-lg font-bold text-indigo-600">{getTitle()}</span>
        <span className="text-sm font-medium text-gray-500">进度 {getProgress()}%</span>
      </div>
      <div className="w-full bg-white rounded-full h-4 shadow-inner border border-gray-200">
        <div 
          className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${getProgress()}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
