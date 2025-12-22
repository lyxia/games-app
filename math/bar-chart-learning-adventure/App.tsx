import React, { useState } from 'react';
import { Stage } from './types';
import { StageOne } from './components/StageOne';
import { StageTwo } from './components/StageTwo';
import { StageThree } from './components/StageThree';
import { StageFour } from './components/StageFour';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.Counting);

  const handleStageOneComplete = () => {
    setCurrentStage(Stage.Scale);
  };

  const handleStageTwoComplete = () => {
    setCurrentStage(Stage.Comparison);
  };

  const handleStageThreeComplete = () => {
    setCurrentStage(Stage.Review);
  };

  const handleRestart = () => {
      setCurrentStage(Stage.Counting);
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 flex items-center gap-2">
            📊 条形统计图探险
          </h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStage >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-2 md:p-6 pb-24">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl h-[calc(100vh-140px)] border border-white overflow-hidden relative">
            {currentStage === Stage.Counting && <StageOne onComplete={handleStageOneComplete} />}
            {currentStage === Stage.Scale && <StageTwo onComplete={handleStageTwoComplete} />}
            {currentStage === Stage.Comparison && <StageThree onComplete={handleStageThreeComplete} />}
            {currentStage === Stage.Review && <StageFour onRestart={handleRestart} />}
        </div>
      </main>
    </div>
  );
};

export default App;