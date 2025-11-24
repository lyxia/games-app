import React, { useState } from 'react';
import { GRAMMAR_QUESTIONS } from '../constants';
import { Wrench, Check, X } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const Stage2Foundation: React.FC<Props> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const currentQ = GRAMMAR_QUESTIONS[currentIndex];

  const handleOptionClick = (correct: boolean) => {
    if (correct) {
      setFeedback({ type: 'success', msg: "太棒了！地基很稳固！" });
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < GRAMMAR_QUESTIONS.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback({ type: 'error', msg: currentQ.hint });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white/90 rounded-xl p-6 shadow-xl border-4 border-orange-500 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wrench className="text-orange-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-800">第二关：地基加固</h2>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {/* Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentIndex) / GRAMMAR_QUESTIONS.length) * 100}%` }}></div>
            </div>

            {/* Question Display */}
            <div className="text-2xl md:text-3xl font-bold text-center leading-relaxed text-slate-700">
              {currentQ.pre}
              <span className="inline-block w-24 border-b-4 border-slate-400 mx-2"></span>
              {currentQ.post}
            </div>

            {/* Options */}
            <div className="flex gap-4 mt-4">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt.correct)}
                  disabled={feedback?.type === 'success'}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xl font-bold border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {/* Feedback Area */}
            <div className={`h-16 flex items-center justify-center transition-all duration-300 ${feedback ? 'opacity-100' : 'opacity-0'}`}>
                {feedback && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {feedback.type === 'success' ? <Check /> : <X />}
                        {feedback.msg}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Stage2Foundation;
