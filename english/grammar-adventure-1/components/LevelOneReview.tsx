import React from 'react';

interface Props {
  onComplete: () => void;
}

const LevelOneReview: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border-4 border-white max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          📜 魔法语法秘籍
        </h2>
        
        <div className="space-y-4">
          {/* Card 1 */}
          <div className="bg-candy-blue rounded-2xl p-5 border-l-8 border-blue-400 shadow-sm hover:transform hover:scale-[1.02] transition-transform">
            <h3 className="text-xl font-bold text-blue-800 mb-2">1. Be动词口诀 🎤</h3>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              <span className="text-blue-600 font-bold text-xl bg-white px-2 py-1 rounded-lg mx-1">I</span> 用 <span className="text-purple-600 font-bold">am</span>，<br/>
              <span className="text-blue-600 font-bold text-xl bg-white px-2 py-1 rounded-lg mx-1">You</span> 用 <span className="text-purple-600 font-bold">are</span>，<br/>
              <span className="text-purple-600 font-bold">is</span> 连着 <span className="text-pink-500 font-bold">他(he) 她(she) 它(it)</span>。
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-candy-yellow rounded-2xl p-5 border-l-8 border-yellow-400 shadow-sm hover:transform hover:scale-[1.02] transition-transform">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">2. 单复数口诀 ⚖️</h3>
            <p className="text-lg text-gray-700 font-medium">
              单数（一个）用 <span className="text-red-500 font-bold text-2xl">is</span><br/>
              复数（两个及以上）用 <span className="text-green-500 font-bold text-2xl">are</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-candy-pink rounded-2xl p-5 border-l-8 border-pink-400 shadow-sm hover:transform hover:scale-[1.02] transition-transform">
            <h3 className="text-xl font-bold text-pink-800 mb-2">3. 谁是“三单”？🕵️</h3>
            <p className="text-lg text-gray-700 font-medium">
              只有 <span className="bg-white px-2 py-1 rounded text-pink-600 font-bold">He, She, It, 单人, 单物</span> 才是三单。<br/>
              <span className="text-sm text-red-500 mt-2 block font-bold bg-red-50 p-2 rounded-lg border border-red-100">
                ⚠️ 注意：复数（比如 apple<span className="text-xl">s</span>）绝对不是三单！
              </span>
            </p>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl active:scale-95 transition-all animate-bounce"
        >
          我记住了，开始挑战！🚀
        </button>
      </div>
    </div>
  );
};

export default LevelOneReview;
