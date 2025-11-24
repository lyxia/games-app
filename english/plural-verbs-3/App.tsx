import React, { useState } from 'react';
import StageIntro from './components/StageIntro';
import StageTutorial from './components/StageTutorial';
import StagePractice from './components/StagePractice';
import StageLogic from './components/StageLogic';
import StageResult from './components/StageResult';
import { GameStage } from './types';
import { PRACTICE_QUESTIONS } from './constants';

function App() {
  const [stage, setStage] = useState<GameStage>(GameStage.INTRO);
  const [score, setScore] = useState(0);

  // Intro -> Tutorial
  const handleIntroComplete = () => {
    setStage(GameStage.TUTORIAL);
  };

  // Tutorial -> Practice
  const handleTutorialComplete = () => {
    setStage(GameStage.PRACTICE);
  };

  // Practice -> Logic
  // Receives score from practice round (max 6)
  const handlePracticeComplete = (practiceScore: number) => {
    setScore(practiceScore);
    setStage(GameStage.LOGIC);
  };

  // Logic -> Result
  // Receives success boolean (adds 1 point if true)
  const handleLogicComplete = (isSuccess: boolean) => {
    if (isSuccess) {
      setScore(prev => prev + 1);
    }
    setStage(GameStage.RESULT);
  };

  // Restart
  const handleRestart = () => {
    setScore(0);
    setStage(GameStage.INTRO);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-fixed flex items-center justify-center">
      <div className="w-full h-screen max-w-4xl mx-auto overflow-y-auto">
        {stage === GameStage.INTRO && (
          <StageIntro onComplete={handleIntroComplete} />
        )}
        {stage === GameStage.TUTORIAL && (
          <StageTutorial onComplete={handleTutorialComplete} />
        )}
        {stage === GameStage.PRACTICE && (
          <StagePractice onComplete={handlePracticeComplete} />
        )}
        {stage === GameStage.LOGIC && (
          <StageLogic onComplete={handleLogicComplete} />
        )}
        {stage === GameStage.RESULT && (
          <StageResult 
            score={score} 
            total={PRACTICE_QUESTIONS.length + 1} 
            onRestart={handleRestart} 
          />
        )}
      </div>
    </div>
  );
}

export default App;