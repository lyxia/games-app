import React, { useState } from 'react';
import { scenarioList } from '../constants';
import { Scenario, ScenarioOption } from '../types';
import { Check, X } from 'lucide-react';

const ScenarioItem: React.FC<{ scenario: Scenario }> = ({ scenario }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (selectedOption) return; // Prevent changing after selection
    setSelectedOption(optionId);
  };

  const getFeedback = () => {
    if (!selectedOption) return null;
    const option = scenario.options.find(o => o.id === selectedOption);
    return option;
  };

  const feedback = getFeedback();

  // Render different SVG illustrations based on mode
  const renderIllustration = () => {
    switch(scenario.svgMode) {
      case 'pipeline':
        return (
          <svg viewBox="0 0 200 150" className="w-full h-full bg-blue-50">
             {/* House A */}
             <path d="M 100 20 L 120 40 L 80 40 Z" fill="#FF6B6B" />
             <rect x="85" y="40" width="30" height="20" fill="#FFC8DD" />
             <text x="95" y="55" fontSize="10" fill="#4A4A4A">A</text>
             {/* Main Road */}
             <line x1="0" y1="130" x2="200" y2="130" stroke="#4A4A4A" strokeWidth="8" />
             <line x1="0" y1="130" x2="200" y2="130" stroke="white" strokeWidth="1" strokeDasharray="10" />
             {/* Paths Preview (faint) */}
             <line x1="100" y1="60" x2="160" y2="126" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4" />
             <line x1="100" y1="60" x2="100" y2="126" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4" />
          </svg>
        );
      case 'duck':
        return (
           <svg viewBox="0 0 200 150" className="w-full h-full bg-blue-100">
             {/* River Banks */}
             <line x1="0" y1="20" x2="200" y2="20" stroke="#4A90E2" strokeWidth="4" />
             <line x1="0" y1="130" x2="200" y2="130" stroke="#4A90E2" strokeWidth="4" />
             {/* Water Flow */}
             <path d="M 20 50 Q 50 60 80 50 T 140 50" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
             <path d="M 60 90 Q 90 100 120 90 T 180 90" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
             {/* Duck A */}
             <circle cx="50" cy="35" r="10" fill="#FFD700" />
             <text x="45" y="38" fontSize="8">🦆</text>
             <text x="45" y="15" fontSize="10" fontWeight="bold">A</text>
           </svg>
        );
      case 'paper':
        return (
           <svg viewBox="0 0 200 150" className="w-full h-full bg-gray-100">
             {/* Paper Strip */}
             <rect x="20" y="40" width="160" height="70" fill="white" stroke="#999" strokeWidth="1" />
             {/* Parallel Edges */}
             <line x1="20" y1="40" x2="180" y2="40" stroke="#4A4A4A" strokeWidth="2" />
             <line x1="20" y1="110" x2="180" y2="110" stroke="#4A4A4A" strokeWidth="2" />
             {/* Width Indicator */}
             <line x1="170" y1="40" x2="170" y2="110" stroke="#FF6B6B" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
             <text x="175" y="80" fontSize="12" fill="#FF6B6B" fontWeight="bold">5cm</text>
           </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-2 border-macaron-yellow">
      <div className="bg-macaron-yellow px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-lg text-macaron-text">{scenario.title}</h3>
        <span className="text-2xl opacity-80">🤔</span>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Visual */}
        <div className="w-full md:w-1/3 h-40 md:h-auto border-b md:border-b-0 md:border-r border-gray-100">
           {renderIllustration()}
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 p-4">
           <p className="text-gray-600 mb-4">{scenario.desc}</p>
           
           <div className="grid grid-cols-1 gap-3">
             {scenario.options.map(option => {
               let btnClass = "border-2 rounded-lg p-3 text-left transition-all hover:bg-gray-50 flex items-center justify-between ";
               if (selectedOption === option.id) {
                 btnClass = option.correct 
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-red-500 bg-red-50 text-red-800";
               } else if (selectedOption) {
                 btnClass = "border-gray-200 opacity-50";
               } else {
                 btnClass += "border-macaron-blue";
               }

               return (
                 <button 
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    disabled={!!selectedOption}
                    className={btnClass}
                 >
                   <span><span className="font-bold mr-2">{option.id}.</span> {option.text}</span>
                   {selectedOption === option.id && (
                     option.correct ? <Check size={20} /> : <X size={20} />
                   )}
                 </button>
               )
             })}
           </div>
           
           {/* Feedback Area */}
           {feedback && (
             <div className={`mt-4 p-3 rounded-lg animate-fade-in ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold flex items-center gap-2">
                  {feedback.correct ? '🎉 回答正确！' : '❌ 再想一想...'}
                </p>
                <p className="text-sm mt-1">{feedback.feedback}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export const ScenarioView: React.FC = () => {
  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-macaron-text mb-2">🚀 智慧应用挑战</h2>
        <p className="text-gray-500">用几何知识解决生活中的难题！</p>
      </div>

      <div>
        {scenarioList.map(item => (
          <ScenarioItem key={item.id} scenario={item} />
        ))}
      </div>
    </div>
  );
};