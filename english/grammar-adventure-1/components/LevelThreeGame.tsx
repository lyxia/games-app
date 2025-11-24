import React, { useState, useCallback } from 'react';
import { LEVEL_3_DATA } from '../constants';

interface Props {
  onComplete: () => void;
}

const LevelThreeGame: React.FC<Props> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null, msg: string }>({ isCorrect: null, msg: '' });
  const [shake, setShake] = useState(false);

  const currentQ = LEVEL_3_DATA[currentIndex];

  const handleChoice = useCallback((choice: 'am' | 'is' | 'are') => {
    if (choice === currentQ.answer) {
      setFeedback({ isCorrect: true, msg: 'Perfect! 🌟' });
      
      setTimeout(() => {
        setFeedback({ isCorrect: null, msg: '' });
        if (currentIndex < LEVEL_3_DATA.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 800);
    } else {
      setShake(true);
      setFeedback({ isCorrect: false, msg: '不对哦，再试一次！💪' });
      setTimeout(() => setShake(false), 500);
    }
  }, [currentIndex, currentQ.answer, onComplete]);

  // Split sentence by '___' to render the blank visually
  const parts = currentQ.sentence.split('___');

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className={`relative bg-white rounded-3xl shadow-xl p-8 w-full border-4 border-white transition-all ${shake ? 'animate-shake ring-4 ring-red-400' : ''}`}>
        
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-bold border border-purple-200">
            挑战 {currentIndex + 1} / {LEVEL_3_DATA.length}
        </div>

        <h3 className="text-center text-gray-500 font-medium mb-6 mt-2">选择正确的 Be 动词填空</h3>

        <div className="bg-candy-blue rounded-2xl p-8 mb-8 text-center border-2 border-blue-100">
           <div className="text-3xl md:text-4xl font-bold text-gray-700 leading-relaxed">
             {parts[0]}
             <span className="inline-block min-w-[80px] border-b-4 border-indigo-500 text-indigo-600 px-2 mx-2 bg-white rounded">
               {feedback.isCorrect === true ? currentQ.answer : '?'}
             </span>
             {parts[1]}
           </div>
        </div>

        <div className={`h-8 text-center mb-6 font-bold ${feedback.isCorrect === false ? 'text-red-500' : 'text-green-500'}`}>
          {feedback.msg}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['am', 'is', 'are'].map((opt) => (
            <button
              key={opt}
              onClick={() => handleChoice(opt as any)}
              disabled={feedback.isCorrect === true}
              className="bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 text-2xl font-bold py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelThreeGame;
