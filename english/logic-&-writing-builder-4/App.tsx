import React, { useState } from 'react';
import { GameStage } from './types';
import Stage1Warehouse from './components/Stage1Warehouse';
import Stage2Foundation from './components/Stage2Foundation';
import Stage3Logic from './components/Stage3Logic';
import Stage4Skyscraper from './components/Stage4Skyscraper';
import Stage5Certificate from './components/Stage5Certificate';
import { HardHat } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>(GameStage.WAREHOUSE);

  const nextStage = () => {
    setStage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-amber-50 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-lg sticky top-0 z-50 border-b-4 border-orange-700">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
                <HardHat className="text-orange-600" size={24} />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-bold leading-none">英语语法闯关：逻辑与写作</h1>
                <p className="text-orange-100 text-xs font-medium">第四课时：最终章</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
                <div 
                    key={s} 
                    className={`w-3 h-3 rounded-full ${stage >= s - 1 ? 'bg-white' : 'bg-orange-700/40'}`}
                />
            ))}
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="py-8 px-2 md:px-4">
        <div className="max-w-5xl mx-auto">
            {stage === GameStage.WAREHOUSE && <Stage1Warehouse onComplete={nextStage} />}
            {stage === GameStage.FOUNDATION && <Stage2Foundation onComplete={nextStage} />}
            {stage === GameStage.LOGIC && <Stage3Logic onComplete={nextStage} />}
            {stage === GameStage.SKYSCRAPER && <Stage4Skyscraper onComplete={nextStage} />}
            {stage === GameStage.COMPLETION && <Stage5Certificate />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-amber-800/60 text-sm">
        <p>© English Grammar Adventure | Unit 5 写作逻辑</p>
        {stage === GameStage.COMPLETION && (
             <button onClick={() => setStage(GameStage.WAREHOUSE)} className="mt-2 underline hover:text-amber-900">
                 再玩一次
             </button>
        )}
      </footer>
    </div>
  );
};

export default App;
