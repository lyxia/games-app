import React from 'react';
import { Award, RotateCcw, Star } from 'lucide-react';

interface StageResultProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const StageResult: React.FC<StageResultProps> = ({ score, total, onRestart }) => {
  const percentage = (score / total) * 100;
  let title = "";
  let badgeColor = "";

  if (percentage === 100) {
      title = "传说级神探";
      badgeColor = "text-yellow-400";
  } else if (percentage >= 70) {
      title = "高级督察";
      badgeColor = "text-gray-400";
  } else {
      title = "实习警员";
      badgeColor = "text-orange-700";
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl text-center border-t-8 border-detective-accent relative">
            
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-detective-brown text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-lg">
                结案报告
            </div>

            <div className="mt-8 mb-6 relative inline-block">
                <div className={`transform scale-150 ${badgeColor} drop-shadow-2xl`}>
                    <Award size={100} fill="currentColor" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-3">
                     <span className="text-white font-black text-xl drop-shadow-md">{Math.round(percentage)}%</span>
                </div>
            </div>

            <h3 className="text-3xl font-fun font-bold text-detective-brown mb-2">
                {title}
            </h3>
            <p className="text-gray-500 mb-6 text-sm">本次获得的荣誉称号</p>

            <div className="grid grid-cols-2 gap-4 mb-8 bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-100">
                <div className="text-center border-r border-yellow-200">
                    <div className="text-4xl font-black text-green-500">{score}</div>
                    <div className="text-sm text-gray-500 font-bold">答对</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-black text-detective-brown">{total}</div>
                    <div className="text-sm text-gray-500 font-bold">总题数</div>
                </div>
            </div>

            <button 
                onClick={onRestart}
                className="w-full bg-detective-highlight hover:bg-blue-500 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
                <RotateCcw size={20} /> 再次挑战
            </button>
        </div>
    </div>
  );
};

export default StageResult;