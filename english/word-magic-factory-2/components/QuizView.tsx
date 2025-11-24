import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizStage } from '../types';
import { MagicButton } from './MagicButton';
import { Star, AlertCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  stage: QuizStage;
  onNext: (correct: boolean) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ stage, onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedback, setFeedback] = useState<string>("");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset state when stage changes
  useEffect(() => {
    console.log('🔄 Stage 变化，重置状态。新 stage:', stage.id, stage.word);
    setSelected(null);
    setStatus('idle');
    setFeedback("");

    // 清理可能存在的旧 timeout
    if (timeoutRef.current) {
      console.log('🧹 清理旧的 timeout');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stage]);

  const handleOptionClick = (option: string) => {
    console.log('🎯 点击选项:', option, '| 当前状态:', status, '| 正确答案:', stage.correctOption);

    if (status === 'correct') {
      console.log('⛔ 已经答对，忽略点击');
      return; // Prevent clicks after correct
    }

    setSelected(option);

    if (option === stage.correctOption) {
      console.log('✅ 答对了！准备跳转下一题');
      setStatus('correct');
      setFeedback("Excellent! 魔法生效！");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FCD34D', '#A78BFA', '#34D399']
      });

      // 清理可能存在的旧 timeout
      if (timeoutRef.current) {
        console.log('🧹 清理旧的 timeout（答对时）');
        clearTimeout(timeoutRef.current);
      }

      // Auto advance after short delay
      timeoutRef.current = setTimeout(() => {
        console.log('⏰ 1.5秒后调用 onNext(true)');
        onNext(true);
      }, 1500);
    } else {
      console.log('❌ 答错了，状态设为 incorrect');
      setStatus('incorrect');
      setFeedback(stage.hint);

      // Subtle vibration pattern for mobile
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 w-full max-w-3xl mx-auto">
      
      {/* Word Card */}
      <motion.div 
        key={stage.word}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-12"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
        <div className="relative bg-white text-slate-900 rounded-3xl px-12 py-8 shadow-2xl border-4 border-purple-300">
          <h1 className="text-6xl font-black tracking-wider text-center">{stage.word}</h1>
          <div className="absolute -top-6 -right-6 bg-yellow-400 text-yellow-900 rounded-full p-3 border-4 border-white shadow-lg">
            <Zap size={32} fill="currentColor" />
          </div>
        </div>
      </motion.div>

      {/* Feedback Area */}
      <div className="h-16 mb-4 w-full flex justify-center items-center">
        <AnimatePresence mode="wait">
          {status === 'incorrect' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg"
            >
              <AlertCircle size={20} />
              <span className="font-bold text-lg">{feedback}</span>
            </motion.div>
          )}
          {status === 'correct' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              className="flex items-center gap-2 text-yellow-300 drop-shadow-lg"
            >
              <Star size={32} fill="currentColor" />
              <span className="font-bold text-3xl">Perfect!</span>
              <Star size={32} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {stage.options.map((option) => {
          const isSelected = selected === option;
          const isWrong = isSelected && status === 'incorrect';
          const isCorrect = isSelected && status === 'correct';

          return (
            <motion.button
              key={option}
              whileHover={status === 'idle' ? { scale: 1.05 } : {}}
              whileTap={status === 'idle' ? { scale: 0.95 } : {}}
              animate={isWrong ? { x: 0 } : {}}
              transition={isWrong ? {
                x: {
                  type: "tween",
                  duration: 0.5,
                  ease: "easeInOut",
                  repeat: 3,
                  repeatType: "reverse"
                }
              } : { type: "spring", duration: 0.4 }}
              onClick={() => handleOptionClick(option)}
              className={`
                relative overflow-hidden px-6 py-6 rounded-2xl text-2xl font-bold shadow-lg transition-all border-b-8
                ${status === 'correct' && !isCorrect ? 'opacity-50 cursor-not-allowed bg-slate-700 border-slate-800 text-slate-400' : ''}
                ${isCorrect 
                  ? 'bg-green-500 border-green-700 text-white scale-105 ring-4 ring-green-300' 
                  : isWrong
                    ? 'bg-red-500 border-red-700 text-white ring-4 ring-red-300'
                    : 'bg-white text-purple-900 border-purple-200 hover:border-purple-300 hover:bg-purple-50'
                }
              `}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};