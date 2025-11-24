import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGES, getAllQuizzesShuffled } from './constants';
import { GameState, GameStage } from './types';
import { RuleView } from './components/RuleView';
import { QuizView } from './components/QuizView';
import { ResultScreen } from './components/ResultScreen';
import { ModeSelection } from './components/ModeSelection';
import { Wand2 } from 'lucide-react';

type GameMode = 'select' | 'normal' | 'ultimate';

export default function App() {
  const [mode, setMode] = useState<GameMode>('select');
  const [gameState, setGameState] = useState<GameState>({
    currentStageIndex: 0,
    score: 0,
    mistakes: [],
    completed: false,
  });

  // 根据模式获取关卡列表
  const stages: GameStage[] = useMemo(() => {
    if (mode === 'ultimate') {
      return getAllQuizzesShuffled();
    }
    return STAGES;
  }, [mode]);

  const currentStage = stages[gameState.currentStageIndex];
  const progress = ((gameState.currentStageIndex) / stages.length) * 100;

  console.log('🎯 App 渲染 - currentStageIndex:', gameState.currentStageIndex, '| currentStage:', currentStage?.id, currentStage?.word || currentStage?.title);

  const handleModeSelect = (selectedMode: 'normal' | 'ultimate') => {
    setMode(selectedMode);
    setGameState({
      currentStageIndex: 0,
      score: 0,
      mistakes: [],
      completed: false,
    });
  };

  const handleNextStage = (isCorrect: boolean = true) => {
    console.log('🎮 handleNextStage 被调用，isCorrect:', isCorrect, '| 当前关卡:', gameState.currentStageIndex);

    // Logic for Score
    let newScore = gameState.score;
    let newMistakes = [...gameState.mistakes];

    if (currentStage.type === 'quiz') {
      if (isCorrect) {
        newScore += 10;
        console.log('➕ 加10分，新分数:', newScore);
      } else {
        // We won't deduct points in the simple handler,
        // but we track mistakes if this function is called with false.
        // Note: Our QuizView calls handleNext(true) only when eventually correct.
        // To track mistakes properly, we'd need to update state on wrong click inside QuizView.
        // For this simplified version, we assume 'mistakes' are tracked if we added logic for it,
        // but let's just advance.
      }
    }

    if (gameState.currentStageIndex + 1 >= stages.length) {
      console.log('🏁 游戏完成！');
      setGameState(prev => ({ ...prev, score: newScore, completed: true }));
    } else {
      console.log('⏭️  进入下一关:', gameState.currentStageIndex + 1);
      setGameState(prev => ({
        ...prev,
        score: newScore,
        currentStageIndex: prev.currentStageIndex + 1
      }));
    }
  };

  // We need a way to track mistakes from the QuizView
  const handleQuizResult = (correctFirstTry: boolean) => {
    if (!correctFirstTry) {
      // If the user made a mistake on the current word, add it to list if not already there
      if (currentStage.type === 'quiz' && !gameState.mistakes.includes(currentStage.word)) {
        setGameState(prev => ({
            ...prev,
            mistakes: [...prev.mistakes, currentStage.word]
        }));
      }
    } else {
       handleNextStage(true);
    }
  };

  const restartGame = () => {
    setMode('select');
    setGameState({
      currentStageIndex: 0,
      score: 0,
      mistakes: [],
      completed: false,
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-violet-900 via-purple-900 to-slate-900 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: Math.random() * 20 + 10 + 'px',
              height: Math.random() * 20 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 5 + 5 + 's',
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Header / Progress */}
      {mode !== 'select' && !gameState.completed && (
        <div className="relative z-10 w-full p-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 text-white/90">
            <div className="bg-white/10 p-2 rounded-lg">
              <Wand2 size={24} className="text-yellow-300" />
            </div>
            <span className="font-bold text-xl tracking-wide">单词魔法工厂</span>
          </div>
          
          <div className="w-full max-w-md h-4 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 container mx-auto px-4 py-4 flex items-stretch justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <AnimatePresence mode="wait">
          {mode === 'select' ? (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ModeSelection onSelectMode={handleModeSelect} />
            </motion.div>
          ) : gameState.completed ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <ResultScreen gameState={gameState} onRestart={restartGame} />
            </motion.div>
          ) : (
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {currentStage.type === 'rule' ? (
                <RuleView stage={currentStage} onNext={() => handleNextStage(true)} />
              ) : (
                <QuizView
                  stage={currentStage}
                  onNext={(success) => {
                      console.log('📢 QuizView onNext 被调用，success:', success);
                      if(success) {
                          console.log('🚀 调用 handleNextStage(true)');
                          handleNextStage(true);
                      }
                  }}
                  // Note: Real mistake tracking would require modifying QuizView to call a handler on incorrect clicks
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}