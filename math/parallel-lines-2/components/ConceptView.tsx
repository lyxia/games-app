import React, { useState } from 'react';
import { conceptList } from '../constants';
import { Concept } from '../types';

const ConceptCard: React.FC<{ concept: Concept }> = ({ concept }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-64 w-full cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
           style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>
        
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border-4 border-macaron-blue flex flex-col items-center justify-center p-6 text-center hover:scale-[1.02] transition-transform">
          <div className="text-6xl mb-4">{concept.icon}</div>
          <h3 className="text-2xl font-bold text-macaron-text">{concept.title}</h3>
          <p className="mt-4 text-sm text-gray-400 font-bold">点击翻转查看知识点 👆</p>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-macaron-blue rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center rotate-y-180"
             style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          <div className="text-4xl mb-2 opacity-50">{concept.icon}</div>
          <p className="text-lg font-bold text-white leading-relaxed">
            {concept.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ConceptView: React.FC = () => {
  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-macaron-text mb-2">🎓 几何知识图谱</h2>
        <p className="text-gray-500">点击卡片，探索垂线与距离的奥秘！</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conceptList.map(concept => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>
    </div>
  );
};