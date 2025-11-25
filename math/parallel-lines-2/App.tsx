
import React, { useState } from 'react';
import { AppView } from './types';
import { Navigation } from './components/Navigation';
import { LabView } from './components/LabView';
import { ScenarioView } from './components/ScenarioView';
import { QuizView } from './components/QuizView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LAB);

  const renderView = () => {
    switch (currentView) {
      case AppView.LAB:
        return <LabView />;
      case AppView.SCENARIOS:
        return <ScenarioView />;
      case AppView.QUIZ:
        return <QuizView />;
      default:
        return <LabView />;
    }
  };

  return (
    <div className="min-h-screen bg-macaron-cream font-sans text-macaron-text selection:bg-macaron-pink selection:text-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center relative">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            📐 垂线与距离：几何探险工厂
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
