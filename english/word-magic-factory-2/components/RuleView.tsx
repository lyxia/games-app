import React from 'react';
import { motion } from 'framer-motion';
import { RuleStage } from '../types';
import { MagicButton } from './MagicButton';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface RuleViewProps {
  stage: RuleStage;
  onNext: () => void;
}

export const RuleView: React.FC<RuleViewProps> = ({ stage, onNext }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-full p-4 pb-8 text-center overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden my-4"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
        <Sparkles className="absolute top-4 right-4 text-yellow-300 animate-pulse" size={32} />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-300 shadow-lg"
        >
          <BookOpen className="text-white" size={32} />
        </motion.div>

        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white drop-shadow-md">
          {stage.title}
        </h2>

        <p className="text-base md:text-xl text-purple-100 mb-6 leading-relaxed">
          {stage.content}
        </p>

        {stage.highlight && (
          <div className="bg-indigo-900/50 border border-indigo-500/30 rounded-xl p-4 md:p-6 mb-6">
            <p className="text-2xl md:text-3xl font-black text-yellow-300 whitespace-pre-line leading-snug font-mono">
              {stage.highlight}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 mb-6 w-full max-w-md mx-auto">
          {stage.examples.map((ex, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="flex items-center justify-center gap-3 text-lg md:text-xl bg-white/5 rounded-lg p-2 md:p-3"
            >
              <span className="text-gray-300">{ex.original}</span>
              <ArrowRight className="text-purple-400" size={20} />
              <span className="font-bold text-green-300">{ex.transformed}</span>
            </motion.div>
          ))}
        </div>

        <MagicButton onClick={onNext} variant="success">
          {stage.buttonText}
        </MagicButton>
      </motion.div>
    </div>
  );
};