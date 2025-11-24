
import React, { useState } from 'react';
import { Level } from './types';
import ProgressBar from './components/ProgressBar';
import LessonThirdPerson from './components/LessonThirdPerson';
import LevelTwoGame from './components/LevelTwoGame';
import LessonBeVerb from './components/LessonBeVerb';
import LevelThreeGame from './components/LevelThreeGame';
import Confetti from './components/Confetti';

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<Level>(Level.LESSON_THIRD_PERSON);

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 pb-12">
      {currentLevel === Level.VICTORY && <Confetti />}
      
      <ProgressBar currentLevel={currentLevel} />

      <div className="flex-grow flex flex-col justify-center">
        {/* Step 1: Lesson - Who is Third Person? */}
        {currentLevel === Level.LESSON_THIRD_PERSON && (
          <LessonThirdPerson onComplete={nextLevel} />
        )}

        {/* Step 2: Game - Eagle Eye */}
        {currentLevel === Level.GAME_EAGLE_EYE && (
          <LevelTwoGame onComplete={nextLevel} />
        )}

        {/* Step 3: Lesson - Be Verbs & Plurals */}
        {currentLevel === Level.LESSON_BE_VERB && (
          <LessonBeVerb onComplete={nextLevel} />
        )}

        {/* Step 4: Game - Be Verb Battle */}
        {currentLevel === Level.GAME_BE_VERB && (
          <LevelThreeGame onComplete={nextLevel} />
        )}

        {/* Step 5: Victory */}
        {currentLevel === Level.VICTORY && (
          <div className="flex flex-col items-center justify-center animate-bounce-in text-center bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-2xl max-w-2xl mx-auto border-8 border-yellow-200">
            <div className="text-8xl mb-6 animate-bounce">🏆</div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
              恭喜通关！
            </h1>
            <p className="text-2xl text-gray-600 font-bold mb-8">
              你已经是英语语法小大师啦！
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xl font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              再玩一次 🎮
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-8 text-white/60 font-medium text-sm">
        Keep Learning & Have Fun! 🌈
      </div>
    </div>
  );
};

export default App;
