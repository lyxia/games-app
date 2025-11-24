
import React from 'react';

interface Props {
  onComplete: () => void;
}

const LessonBeVerb: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border-4 border-white max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          📜 秘籍二：Be动词与单复数
        </h2>
        
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-candy-blue rounded-2xl p-5 border-l-8 border-blue-400 shadow-sm">
            <h3 className="text-xl font-bold text-blue-800 mb-3">1. Be动词口诀 🎤</h3>
            <div className="text-lg text-gray-700 font-medium leading-loose bg-white/50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold mr-2">I</span> 
                <span>用</span> 
                <span className="text-purple-600 font-black mx-2 text-xl">am</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold mr-2">You</span> 
                <span>用</span> 
                <span className="text-purple-600 font-black mx-2 text-xl">are</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 font-black mr-2 text-xl">is</span> 
                <span>连着</span> 
                <span className="text-pink-500 font-bold ml-2">他(he) 她(she) 它(it)</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-candy-yellow rounded-2xl p-5 border-l-8 border-yellow-400 shadow-sm">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">2. 单复数口诀 ⚖️</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 p-3 rounded-xl text-center">
                    <div className="text-sm text-gray-500 mb-1">单数 (Single)</div>
                    <div className="text-red-500 font-black text-3xl">is</div>
                    <div className="text-xs text-gray-400 mt-1">一个苹果</div>
                </div>
                <div className="bg-white/60 p-3 rounded-xl text-center">
                    <div className="text-sm text-gray-500 mb-1">复数 (Plural)</div>
                    <div className="text-green-500 font-black text-3xl">are</div>
                    <div className="text-xs text-gray-400 mt-1">两个苹果</div>
                </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl active:scale-95 transition-all animate-pulse"
        >
          明白了，开始填空大战！⚔️
        </button>
      </div>
    </div>
  );
};

export default LessonBeVerb;
