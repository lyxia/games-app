import React, { useState } from 'react';
import { SENTENCE_CHALLENGE } from '../constants';
import { CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const Stage4Skyscraper: React.FC<Props> = ({ onComplete }) => {
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(SENTENCE_CHALLENGE.words);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleWordClick = (word: string, fromPool: boolean) => {
    setFeedback(null);
    if (fromPool) {
      setPlacedWords([...placedWords, word]);
      setAvailableWords(prev => {
        const idx = prev.indexOf(word);
        const newArr = [...prev];
        newArr.splice(idx, 1);
        return newArr;
      });
    } else {
      // Return to pool
      setPlacedWords(prev => {
        const idx = prev.indexOf(word);
        const newArr = [...prev];
        newArr.splice(idx, 1);
        return newArr;
      });
      setAvailableWords(prev => [...prev, word]);
    }
  };

  const handleCheck = () => {
    const currentSentence = placedWords.join(' ');
    const targetSentence = SENTENCE_CHALLENGE.target.join(' ');

    if (currentSentence === targetSentence) {
      setIsComplete(true);
      setFeedback({ type: 'success', msg: "太棒了！句子非常完美！" });
      setTimeout(onComplete, 2000);
    } else {
      // Specific logic check for word order
      if (placedWords.indexOf('always') > placedWords.indexOf('helps')) {
         setFeedback({ type: 'error', msg: "提示：频率副词 'always' 通常放在动词前面哦！" });
      } else if (placedWords.length !== SENTENCE_CHALLENGE.target.length) {
         setFeedback({ type: 'error', msg: "句子好像还没写完？" });
      } else {
         setFeedback({ type: 'error', msg: "顺序不对，再试试看？" });
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-xl border-4 border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Header / Progress */}
        <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-600">第四关：句子搭建</h2>
                <span className="text-slate-400 text-sm">最终挑战</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full w-[10%]" ></div>
            </div>
        </div>

        <div className="flex-1 p-6 flex flex-col">
            {/* Character / Prompt */}
            <div className="flex gap-4 mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-300 text-3xl">
                    👷
                </div>
                <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm relative">
                    <MessageSquare className="absolute -left-2 top-0 text-slate-200 fill-white w-4 h-4 transform rotate-45" />
                    <h3 className="font-bold text-slate-700 text-lg">请将单词排成正确的句子：</h3>
                    <p className="text-slate-500 mt-1">她总是帮助我。</p>
                </div>
            </div>

            {/* Sentence Builder Area */}
            <div className="min-h-[80px] border-b-2 border-t-2 border-slate-100 bg-slate-50 flex flex-wrap gap-2 items-center p-4 rounded-lg mb-12">
                 {placedWords.map((word, idx) => (
                     <button
                        key={`${word}-${idx}`}
                        onClick={() => !isComplete && handleWordClick(word, false)}
                        className="px-4 py-2 bg-white border-2 border-slate-200 border-b-4 active:border-b-2 rounded-xl text-slate-700 font-bold text-lg shadow-sm hover:bg-slate-50 transition-all"
                     >
                         {word}
                     </button>
                 ))}
                 {placedWords.length === 0 && (
                     <span className="text-slate-400 select-none">点击下方单词...</span>
                 )}
            </div>

            {/* Word Bank */}
            <div className="flex flex-wrap gap-3 justify-center mt-auto mb-8">
                {availableWords.map((word, idx) => (
                    <button
                        key={`${word}-${idx}`}
                        onClick={() => handleWordClick(word, true)}
                        disabled={isComplete}
                        className="px-5 py-3 bg-white border-2 border-slate-200 border-b-4 active:border-b-2 active:translate-y-1 rounded-xl text-slate-700 font-bold text-xl shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        {word}
                    </button>
                ))}
            </div>
        </div>

        {/* Bottom Bar (Feedback & Action) */}
        <div className={`p-6 border-t-2 transition-colors duration-300 ${feedback?.type === 'success' ? 'bg-green-100 border-green-200' : feedback?.type === 'error' ? 'bg-red-100 border-red-200' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between max-w-lg mx-auto">
                
                {/* Feedback Message */}
                <div className="flex-1 mr-4">
                    {feedback ? (
                        <div className={`font-bold text-lg flex items-center gap-2 ${feedback.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                             {feedback.type === 'success' ? <CheckCircle /> : <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-mono">!</div>}
                             {feedback.msg}
                        </div>
                    ) : (
                        <button onClick={() => { setPlacedWords([]); setAvailableWords(SENTENCE_CHALLENGE.words); }} className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 text-sm">
                             <RefreshCw size={16} /> 重置
                        </button>
                    )}
                </div>

                {/* Check Button */}
                <button
                    onClick={handleCheck}
                    disabled={placedWords.length === 0 || isComplete}
                    className={`
                        px-8 py-3 rounded-2xl font-bold text-white text-lg tracking-wide border-b-4 transition-all
                        ${isComplete 
                            ? 'bg-green-500 border-green-700 cursor-default' 
                            : feedback?.type === 'error' 
                                ? 'bg-red-500 border-red-700 hover:bg-red-600 active:border-b-0 active:translate-y-1'
                                : 'bg-green-500 border-green-700 hover:bg-green-600 active:border-b-0 active:translate-y-1'
                        }
                        disabled:bg-slate-300 disabled:border-slate-400 disabled:cursor-not-allowed
                    `}
                >
                    {isComplete ? '完成' : '检查'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Stage4Skyscraper;
