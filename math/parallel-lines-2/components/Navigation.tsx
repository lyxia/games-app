
import React from 'react';
import { AppView } from '../types';
import { FlaskConical, Map, AlertTriangle } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: AppView.LAB, label: "实验室", icon: <FlaskConical size={24} />, color: "text-macaron-pink" },
    { view: AppView.SCENARIOS, label: "智慧应用", icon: <Map size={24} />, color: "text-macaron-green" },
    { view: AppView.QUIZ, label: "排雷站", icon: <AlertTriangle size={24} />, color: "text-macaron-purple" }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`mb-1 transition-colors ${isActive ? item.color : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className={`w-1 h-1 rounded-full mt-1 ${item.color.replace('text-', 'bg-')}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
