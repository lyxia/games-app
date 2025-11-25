import React, { useState } from 'react';
import { quizList } from '../constants';
import { Quiz } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizCard: React.FC<{ quiz: Quiz; index: number }> = ({ quiz, index }) => {
  const [status, setStatus] = useState<'unanswered' | 'correct' | 'wrong'>('unanswered');

  const handleAnswer = (userSaysTrue: boolean) => {
    if (status !== 'unanswered') return;

    if (userSaysTrue === quiz.isCorrect) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="bg-macaron-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium text-gray-800 mb-6 leading-relaxed">
            {quiz.question}
          </h3>
          
          <div className="flex gap-4">
            <button 
              onClick={() => handleAnswer(true)}
              disabled={status !== 'unanswered'}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                status === 'unanswered' 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-transparent hover:border-blue-200' 
                  : 'opacity-50 cursor-not-allowed bg-gray-100'
              }`}
            >
              <CheckCircle size={20} /> 对
            </button>
            <button 
              onClick={() => handleAnswer(false)}
              disabled={status !== 'unanswered'}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                 status === 'unanswered'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-red-200'
                  : 'opacity-50 cursor-not-allowed bg-gray-100'
              }`}
            >
              <XCircle size={20} /> 错
            </button>
          </div>
        </div>
      </div>

      {/* Result Overlay */}
      {status !== 'unanswered' && (
        <div className={`mt-6 p-4 rounded-xl animate-fade-in ${status === 'correct' ? 'bg-macaron-green/30 border-2 border-green-200' : 'bg-red-100 border-2 border-red-200'}`}>
           <div className="flex items-center gap-2 font-bold text-lg mb-1">
             {status === 'correct' ? '🎉 太棒了！' : '❌ 哎呀，答错了'}
           </div>
           <p className="text-gray-700">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
};

export const QuizView: React.FC = () => {
  return (
    <div className="p-4 pb-24 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-macaron-text mb-2">💣 陷阱排雷站</h2>
        <p className="text-gray-500">小心！别掉进几何陷阱里哦。</p>
      </div>

      {quizList.map((quiz, idx) => (
        <QuizCard key={quiz.id} quiz={quiz} index={idx} />
      ))}
    </div>
  );
};