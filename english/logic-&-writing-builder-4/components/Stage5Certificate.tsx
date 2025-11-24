import React from 'react';
import { Trophy, Star, Download } from 'lucide-react';

const Stage5Certificate: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-[fadeIn_1s_ease-in]">
      <div className="bg-white border-8 border-yellow-400 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Confetti Decoration (Static CSS) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
        
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="bg-yellow-100 p-6 rounded-full border-4 border-yellow-400">
                    <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-md" />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 font-serif">语法大师荣誉证书</h1>
            
            <div className="py-4">
                <p className="text-xl text-slate-600">恭喜你通过所有挑战，成为</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">逻辑与语法建筑大师</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 max-w-md mx-auto">
                <h3 className="text-slate-500 font-bold uppercase tracking-wider mb-4">掌握技能</h3>
                <ul className="text-left space-y-2 text-slate-700">
                    <li className="flex items-center gap-2"><Star className="text-yellow-400 fill-current" size={20} /> Unit 5 核心善举短语</li>
                    <li className="flex items-center gap-2"><Star className="text-yellow-400 fill-current" size={20} /> 第三人称单数动词规则</li>
                    <li className="flex items-center gap-2"><Star className="text-yellow-400 fill-current" size={20} /> 写作逻辑 (观点 & 理由)</li>
                    <li className="flex items-center gap-2"><Star className="text-yellow-400 fill-current" size={20} /> 英语连词成句</li>
                </ul>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <button 
                    onClick={() => alert("证书下载功能开发中！")}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                >
                    <Download size={20} /> 下载证书
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Stage5Certificate;
