import React from 'react';
import { ShieldCheck, ArrowRight, User, Users, Search } from 'lucide-react';

interface StageIntroProps {
  onComplete: () => void;
}

const StageIntro: React.FC<StageIntroProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
      <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-6 md:p-8 relative border-4 border-detective-accent transform rotate-1">
        
        {/* Header */}
        <div className="text-center mb-6">
            <div className="inline-block p-3 bg-detective-accent rounded-full text-white mb-2 shadow-lg">
                <Search size={32} />
            </div>
            <h2 className="text-3xl font-fun font-bold text-detective-brown">
            语法侦探事务所
            </h2>
            <p className="text-detective-brown/80 font-bold">第三课时：动词变形之谜</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-5 border-2 border-yellow-200 space-y-5 text-detective-brown">
          <p className="font-bold text-lg text-center">🕵️‍♂️ 小侦探，破案请遵守<span className="text-detective-accent text-xl">“三部曲”</span>：</p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border-l-8 border-blue-400 hover:scale-105 transition-transform">
              <div className="bg-blue-400 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-lg">1</div>
              <div>
                <h3 className="font-bold text-lg">找主语 (嫌疑人)</h3>
                <p className="text-gray-600 text-sm">就在句子的最开头。</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border-l-8 border-orange-400 hover:scale-105 transition-transform">
              <div className="bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-lg">2</div>
              <div>
                <h3 className="font-bold text-lg">判三单 (查身份)</h3>
                <div className="flex flex-wrap gap-2 mt-1 text-xs font-bold">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ 他/她/它/单人</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">❌ 我/你/复数</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border-l-8 border-green-400 hover:scale-105 transition-transform">
              <div className="bg-green-400 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-lg">3</div>
              <div>
                <h3 className="font-bold text-lg">定动词 (做决定)</h3>
                <ul className="text-sm text-gray-600 pl-1">
                    <li>是三单 👉 <span className="font-bold text-green-600">动词 +s/es</span></li>
                    <li>非三单 👉 <span className="font-bold text-red-500">动词用原形</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="mt-8 w-full bg-detective-accent hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <ShieldCheck size={24} />
          我记住了，开始破案！
        </button>
      </div>
    </div>
  );
};

export default StageIntro;