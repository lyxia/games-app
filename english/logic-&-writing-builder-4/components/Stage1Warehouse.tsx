import React, { useState, useEffect } from 'react';
import { MATCHING_PAIRS } from '../constants';
import { MatchingItem } from '../types';
import { Hammer, Check } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const Stage1Warehouse: React.FC<Props> = ({ onComplete }) => {
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  
  const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<number | null>(null);
  
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Initialize and shuffle columns independently
    const cnItems: MatchingItem[] = MATCHING_PAIRS.map(p => ({
      id: p.id * 10,
      text: p.cn,
      type: 'cn' as const,
      pairId: p.id
    })).sort(() => Math.random() - 0.5);

    const enItems: MatchingItem[] = MATCHING_PAIRS.map(p => ({
      id: p.id * 10 + 1,
      text: p.en,
      type: 'en' as const,
      pairId: p.id
    })).sort(() => Math.random() - 0.5);

    setLeftItems(cnItems);
    setRightItems(enItems);
  }, []);

  useEffect(() => {
    if (selectedLeftId !== null && selectedRightId !== null) {
        const leftItem = leftItems.find(i => i.id === selectedLeftId);
        const rightItem = rightItems.find(i => i.id === selectedRightId);

        if (leftItem && rightItem) {
            if (leftItem.pairId === rightItem.pairId) {
                // Match
                setMatchedPairIds(prev => [...prev, leftItem.pairId]);
                setSelectedLeftId(null);
                setSelectedRightId(null);
            } else {
                // Mismatch
                setError(true);
                setTimeout(() => {
                    setError(false);
                    setSelectedLeftId(null);
                    setSelectedRightId(null);
                }, 500);
            }
        }
    }
  }, [selectedLeftId, selectedRightId, leftItems, rightItems]);

  useEffect(() => {
    if (matchedPairIds.length === MATCHING_PAIRS.length) {
      setTimeout(onComplete, 1000);
    }
  }, [matchedPairIds, onComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white/90 rounded-xl p-6 shadow-xl border-4 border-orange-500">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Hammer className="text-orange-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-800">第一关：建材仓库</h2>
        </div>
        <p className="text-center text-slate-600 mb-6">请将左边的<b>中文含义</b>与右边的<b>英文短语</b>连线！</p>

        <div className="grid grid-cols-2 gap-8 md:gap-16 relative">
             {/* Connecting Line Simulation could go here, but simple color matching is easier for DOM */}
             
             {/* Left Column (CN) */}
             <div className="space-y-4">
                 {leftItems.map((item) => {
                     const isMatched = matchedPairIds.includes(item.pairId);
                     const isSelected = selectedLeftId === item.id;
                     const isError = isSelected && error;
                     
                     return (
                         <button
                            key={item.id}
                            onClick={() => !isMatched && setSelectedLeftId(item.id)}
                            disabled={isMatched}
                            className={`
                                w-full p-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 flex items-center justify-between
                                ${isMatched ? 'bg-green-100 border-green-300 text-green-700 opacity-50' : 'hover:bg-orange-50'}
                                ${isSelected && !isMatched ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-300' : 'bg-white border-slate-200'}
                                ${isError ? 'bg-red-100 border-red-500 animate-shake' : ''}
                            `}
                         >
                             <span>{item.text}</span>
                             {isMatched && <Check size={20} />}
                         </button>
                     );
                 })}
             </div>

             {/* Right Column (EN) */}
             <div className="space-y-4">
                 {rightItems.map((item) => {
                     const isMatched = matchedPairIds.includes(item.pairId);
                     const isSelected = selectedRightId === item.id;
                     const isError = isSelected && error;

                     return (
                         <button
                            key={item.id}
                            onClick={() => !isMatched && setSelectedRightId(item.id)}
                            disabled={isMatched}
                            className={`
                                w-full p-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 flex items-center justify-between
                                ${isMatched ? 'bg-green-100 border-green-300 text-green-700 opacity-50' : 'hover:bg-orange-50'}
                                ${isSelected && !isMatched ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-300' : 'bg-white border-slate-200'}
                                ${isError ? 'bg-red-100 border-red-500 animate-shake' : ''}
                            `}
                         >
                             {isMatched && <Check size={20} />}
                             <span>{item.text}</span>
                         </button>
                     );
                 })}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Stage1Warehouse;