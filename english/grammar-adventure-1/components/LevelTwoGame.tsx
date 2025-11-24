import React, { useState, useEffect, useCallback } from 'react';
import { LEVEL_2_DATA } from '../constants';
import { ThirdPersonItem } from '../types';

interface Props {
  onComplete: () => void;
}

const LevelTwoGame: React.FC<Props> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<ThirdPersonItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'error' | null, message: string }>({ type: null, message: '' });
  const [shake, setShake] = useState(false);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...LEVEL_2_DATA].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, []);

  const currentItem = questions[currentIndex];

  const handleAnswer = useCallback((userSaysYes: boolean) => {
    if (!currentItem) return;

    const isCorrect = userSaysYes === currentItem.isThirdPerson;

    if (isCorrect) {
      setFeedback({ type: 'correct', message: '太棒了！答对了！🎉' });
      setTimeout(() => {
        setFeedback({ type: null, message: '' });
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setShake(true);
      // Logic for specific feedback
      let msg = '哎呀，再想想！😅';
      
      if (currentItem.isTrap) {
        msg = '❌ 错啦！这是复数（有s尾巴），不是三单哦！';
      } else if (userSaysYes && !currentItem.isThirdPerson) {
        if (currentItem.word === 'I' || currentItem.word === 'you') {
          msg = `❌ ${currentItem.word} 是特殊人称，不是三单哦！`;
        } else {
          msg = '❌ 这是复数，要用 are，不是三单！';
        }
      } else if (!userSaysYes && currentItem.isThirdPerson) {
         msg = '❌ 这是一个单人/单物，是三单哦！';
      }

      setFeedback({ type: 'error', message: msg });
      
      setTimeout(() => setShake(false), 500); // Remove shake class
    }
  }, [currentIndex, currentItem, questions.length, onComplete]);

  if (!currentItem) return <div className="text-center">准备中...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
       {/* Question Card */}
       <div className={`relative bg-white rounded-3xl shadow-2xl p-8 w-full text-center border-4 border-white transition-all ${shake ? 'animate-shake ring-4 ring-red-400' : ''}`}>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-bold border border-indigo-200">
             第 {currentIndex + 1} / {questions.length} 题
          </div>

          <h3 className="text-gray-500 text-lg font-medium mb-4">它是不是“三单”？</h3>
          
          <div className="bg-gray-50 rounded-2xl py-10 mb-8 border-2 border-dashed border-gray-300">
            <span className="text-6xl font-black text-gray-800 tracking-wide">{currentItem.word}</span>
          </div>

          {/* Feedback Area */}
          <div className={`h-12 flex items-center justify-center mb-6 ${feedback.type === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
             {feedback.message && (
               <span className="text-lg font-bold animate-bounce bg-white px-4 py-1 rounded shadow-sm">
                 {feedback.message}
               </span>
             )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => handleAnswer(true)}
              disabled={feedback.type === 'correct'}
              className="bg-green-100 hover:bg-green-200 text-green-700 border-b-4 border-green-300 active:border-b-0 active:translate-y-1 text-2xl font-bold py-6 rounded-2xl transition-all flex flex-col items-center"
            >
              <span className="text-4xl mb-2">✅</span>
              是 (Yes)
            </button>
            <button 
              onClick={() => handleAnswer(false)}
              disabled={feedback.type === 'correct'}
              className="bg-red-100 hover:bg-red-200 text-red-700 border-b-4 border-red-300 active:border-b-0 active:translate-y-1 text-2xl font-bold py-6 rounded-2xl transition-all flex flex-col items-center"
            >
              <span className="text-4xl mb-2">🙅</span>
              不是 (No)
            </button>
          </div>
       </div>
    </div>
  );
};

export default LevelTwoGame;
