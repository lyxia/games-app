import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types';
import { MagicButton } from './MagicButton';
import { Trophy, RefreshCcw, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STAGES } from '../constants';

interface ResultScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ gameState, onRestart }) => {
  
  useEffect(() => {
    // Big celebration on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FCD34D', '#F472B6', '#60A5FA']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FCD34D', '#F472B6', '#60A5FA']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Get all quiz items to show review
  const quizItems = STAGES.filter(s => s.type === 'quiz');
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pb-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full text-center border-8 border-yellow-400 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-100 to-white -z-10"></div>
        
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto -mt-16 mb-6 border-4 border-white shadow-xl">
          <Trophy size={48} className="text-yellow-800" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-purple-900 mb-2">
          魔法师证书
        </h1>
        <p className="text-xl text-purple-600 font-medium mb-8">
          恭喜你通过了所有语法试炼！
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <div className="text-purple-400 text-sm font-bold uppercase tracking-wide">得分</div>
                <div className="text-4xl font-black text-purple-900">{gameState.score}</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                <div className="text-pink-400 text-sm font-bold uppercase tracking-wide">失误</div>
                <div className="text-4xl font-black text-pink-900">{gameState.mistakes.length}</div>
            </div>
        </div>

        <div className="text-left mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">变身记录清单:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {quizItems.map((item: any) => {
              const isMistake = gameState.mistakes.includes(item.word);
              return (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${isMistake ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                  <div className="flex items-center gap-3">
                    {isMistake ? <XCircle size={20} className="text-red-400"/> : <CheckCircle2 size={20} className="text-green-500"/>}
                    <span className="text-lg font-bold text-gray-700">
                      {item.word} <ArrowRight className="inline w-4 h-4 mx-1 text-gray-400"/> {item.correctOption}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MagicButton onClick={onRestart} variant="primary" className="w-full sm:w-auto">
          <span className="flex items-center justify-center gap-2">
            <RefreshCcw size={20} />
            再玩一次
          </span>
        </MagicButton>
      </motion.div>
    </div>
  );
};