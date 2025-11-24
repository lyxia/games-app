import React, { useState } from 'react';
import { LOGIC_QUESTIONS } from '../constants';
import { LogicOption } from '../types';
import { HardHat, ArrowDown } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const Stage3Logic: React.FC<Props> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const currentQ = LOGIC_QUESTIONS[currentIndex];

  const handleCheck = (option: LogicOption) => {
    setSelectedOptionId(option.id);
    
    if (option.isCorrect) {
      setFeedback({ type: 'success', msg: option.feedback });
      setTimeout(() => {
        setFeedback(null);
        setSelectedOptionId(null);
        if (currentIndex < LOGIC_QUESTIONS.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 2500);
    } else {
      setFeedback({ type: 'error', msg: option.feedback });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white/90 rounded-xl p-6 shadow-xl border-4 border-orange-500 min-h-[500px]">
        <div className="flex items-center justify-center gap-2 mb-6">
          <HardHat className="text-orange-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-800">第三关：逻辑工程师</h2>
        </div>

        {/* Blueprint Visual */}
        <div className="bg-sky-800 p-6 rounded-lg shadow-inner mb-6 relative overflow-hidden border-4 border-sky-900">
            {/* Blueprint grid lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10">
                <div className="bg-white p-4 rounded shadow-md mb-4 transform -rotate-1">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Opinion (观点)</span>
                    <p className="text-2xl font-bold text-slate-800">{currentQ.opinion}</p>
                </div>
                
                <div className="flex justify-center mb-4">
                    <ArrowDown className="text-white animate-bounce w-8 h-8" />
                </div>

                <div className="bg-white/20 p-2 rounded text-center text-white text-sm font-mono mb-2">
                    请选择最合适的理由 (Reason)
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => handleCheck(opt)}
                    disabled={!!feedback && feedback.type === 'success'}
                    className={`
                        p-4 rounded-lg text-left transition-all border-l-8 flex items-center gap-3
                        ${selectedOptionId === opt.id 
                            ? (opt.isCorrect ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-red-100 border-red-500 ring-2 ring-red-500')
                            : 'bg-gray-50 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                        }
                    `}
                >
                    <span className="font-bold text-lg w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-600 shrink-0">{opt.id}</span>
                    <span className="text-lg font-medium text-slate-700">{opt.text}</span>
                </button>
            ))}
        </div>

        {/* Detailed Feedback */}
        {feedback && (
            <div className={`mt-4 p-4 rounded-lg text-center font-bold animate-pulse ${feedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {feedback.msg}
            </div>
        )}

      </div>
    </div>
  );
};

export default Stage3Logic;
