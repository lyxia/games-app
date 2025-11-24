
import React from 'react';

interface Props {
  onComplete: () => void;
}

const LessonThirdPerson: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border-4 border-white max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">
          📜 秘籍一：谁是“三单”？
        </h2>
        
        <div className="bg-candy-pink rounded-2xl p-6 border-l-8 border-pink-400 shadow-sm mb-6">
          <h3 className="text-2xl font-bold text-pink-800 mb-4">🕵️ 只有它们是“三单”：</h3>
          <div className="space-y-4">
             <div className="flex flex-wrap gap-3 justify-center">
                <span className="bg-white px-4 py-2 rounded-xl text-xl font-bold text-pink-600 shadow-sm">He (他)</span>
                <span className="bg-white px-4 py-2 rounded-xl text-xl font-bold text-pink-600 shadow-sm">She (她)</span>
                <span className="bg-white px-4 py-2 rounded-xl text-xl font-bold text-pink-600 shadow-sm">It (它)</span>
             </div>
             <div className="flex flex-wrap gap-3 justify-center">
                <span className="bg-white px-4 py-2 rounded-xl text-xl font-bold text-purple-600 shadow-sm">单人 (比如 Sam)</span>
                <span className="bg-white px-4 py-2 rounded-xl text-xl font-bold text-purple-600 shadow-sm">单物 (比如 Dog)</span>
             </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-2xl p-5 border-2 border-red-200 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-200 text-red-800 px-3 py-1 rounded-bl-lg font-bold text-sm">重要陷阱</div>
            <h3 className="text-xl font-bold text-red-700 mb-2">⚠️ 特别注意：</h3>
            <p className="text-lg text-gray-700 font-bold">
              复数（比如 apple<span className="text-2xl text-red-600">s</span>, noodles）<br/>
              <span className="text-2xl">🙅</span> 绝对不是三单！
            </p>
        </div>

        <button 
          onClick={onComplete}
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl active:scale-95 transition-all animate-pulse"
        >
          我记住了，去抓“三单”！🔎
        </button>
      </div>
    </div>
  );
};

export default LessonThirdPerson;
