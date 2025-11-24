import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Wand2 } from 'lucide-react';
import { MagicButton } from './MagicButton';

interface ModeSelectionProps {
  onSelectMode: (mode: 'normal' | 'ultimate') => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wand2 size={48} className="text-yellow-300" />
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">
            单词魔法工厂
          </h1>
          <Wand2 size={48} className="text-yellow-300" />
        </div>
        <p className="text-xl md:text-2xl text-purple-200">
          选择你的冒险模式！
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* 正常模式 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden hover:scale-105 transition-transform"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-300 shadow-lg">
            <BookOpen className="text-white" size={48} />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">学习模式</h2>
          <p className="text-purple-100 mb-6 text-lg leading-relaxed">
            跟着魔法秘籍一步步学习，先学规则再练习，循序渐进掌握单词变身法！
          </p>

          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <ul className="text-left text-purple-100 space-y-2">
              <li>✨ 学习第一招和第二招</li>
              <li>✨ 学习第三招 Y 规则</li>
              <li>✨ 挑战大魔王 Have</li>
            </ul>
          </div>

          <MagicButton onClick={() => onSelectMode('normal')} variant="primary">
            开始学习
          </MagicButton>
        </motion.div>

        {/* 终极挑战模式 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden hover:scale-105 transition-transform"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

          <div className="absolute -top-2 -right-2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold rotate-12 shadow-lg">
            高难度
          </div>

          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-yellow-300 shadow-lg animate-pulse">
            <Zap className="text-white" size={48} fill="currentColor" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">终极挑战</h2>
          <p className="text-purple-100 mb-6 text-lg leading-relaxed">
            所有题目打乱顺序，混合出题！考验你对所有魔法规则的掌握程度，你准备好了吗？
          </p>

          <div className="bg-red-900/30 rounded-lg p-4 mb-6">
            <ul className="text-left text-purple-100 space-y-2">
              <li>🔥 14道题目随机顺序</li>
              <li>🔥 混合所有规则</li>
              <li>🔥 测试真实掌握度</li>
            </ul>
          </div>

          <MagicButton onClick={() => onSelectMode('ultimate')} variant="danger">
            接受挑战
          </MagicButton>
        </motion.div>
      </div>
    </div>
  );
};
