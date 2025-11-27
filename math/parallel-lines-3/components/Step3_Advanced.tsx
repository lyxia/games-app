import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Eye, Map, Star, ArrowRight, Play, RotateCcw, CheckCircle2, Ruler, MousePointerClick, XCircle } from 'lucide-react';

// --- Module 3.1: 测量周长 (Perimeter Calculator) ---
export const PerimeterCalculator: React.FC = () => {
  const [step, setStep] = useState(0);
  const [sideA] = useState(15);
  const [sideB] = useState(10);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState('');

  const checkAnswer = () => {
    if (parseInt(inputVal) === (sideA + sideB) * 2) {
      setFeedback('🎉 正确！你真棒！');
      setStep(2);
    } else {
      setFeedback('🤔 再算算？提示：(长+宽) × 2');
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
        <Calculator size={24}/> 周长计算大挑战
      </h3>
      
      <div className="relative w-72 h-48 mb-8 flex items-center justify-center">
        <div className="relative w-64 h-32 bg-pink-100 border-4 border-pink-400 transform -skew-x-12 flex items-center justify-center shadow-lg transition-all duration-1000">
            {step === 2 && <div className="absolute inset-0 bg-green-100 opacity-50 animate-pulse"></div>}
            
            {/* Labels */}
            <div className="absolute top-[-30px] left-20 font-bold text-gray-700 bg-white px-2 rounded shadow">{sideA} cm</div>
            <div className="absolute left-[-40px] top-10 font-bold text-gray-700 bg-white px-2 rounded shadow">{sideB} cm</div>
            
            {/* Interactive Unknowns */}
            <div 
              onClick={() => setStep(1)}
              className={`absolute bottom-[-30px] right-20 font-bold px-2 rounded cursor-pointer transition-all ${step >= 1 ? 'text-gray-700 bg-white shadow' : 'text-pink-400 bg-pink-50 animate-bounce'}`}
            >
              {step >= 1 ? `${sideA} cm` : "?"}
            </div>
            <div 
              onClick={() => setStep(1)}
              className={`absolute right-[-40px] top-10 font-bold px-2 rounded cursor-pointer transition-all ${step >= 1 ? 'text-gray-700 bg-white shadow' : 'text-pink-400 bg-pink-50 animate-bounce'}`}
            >
              {step >= 1 ? `${sideB} cm` : "?"}
            </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-pink-100">
        {step === 0 && (
          <p className="text-center text-lg font-bold text-pink-500">
            点击平行四边形上带有 <span className="text-xl">?</span> 的边，看看它们是多少？
          </p>
        )}
        
        {step >= 1 && (
          <div className="animate-fade-in space-y-4">
            <p className="text-center text-gray-600">根据“对边相等”，我们知道了四条边的长度。</p>
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <span className="font-mono text-lg font-bold text-gray-700">C = ({sideA} + {sideB}) × 2 = </span>
              <input 
                type="number" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-24 p-2 border-2 border-pink-300 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-pink-500"
                placeholder="?"
              />
              <button onClick={checkAnswer} className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow transition-transform active:scale-95">提交</button>
            </div>
            {feedback && <p className="text-center font-bold text-lg animate-bounce text-pink-600">{feedback}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Module 3.2: 火眼金睛 (Shape Counter - Combinatorial Method) ---
export const ShapeCounter: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [animating, setAnimating] = useState(false);
  const [highlightedSegment, setHighlightedSegment] = useState<{start: number, end: number, type: 'row' | 'col'} | null>(null);
  const [currentSegmentName, setCurrentSegmentName] = useState('');

  // Grid Configuration: 3 Columns x 2 Rows
  const COLS = 3; 
  const ROWS = 2;
  
  // Visual config - Optimized for height
  const START_X = 90;
  const START_Y = 30;
  const CELL_W = 65;
  const CELL_H = 50;
  const SKEW = 20;

  const getPointLabel = (type: 'row' | 'col', index: number) => {
      if (type === 'col') { // Bottom edge points: A, B, C, D...
          return String.fromCharCode(65 + index);
      } else { // Side edge points: A, E, F... (A=0, E=1, F=2)
          if (index === 0) return 'A';
          return String.fromCharCode(69 + index - 1); // 1->E(69), 2->F(70)
      }
  };

  // Animation Sequence Logic: Combinatorial Order
  const runAnimation = async (type: 'row' | 'col', maxSegments: number) => {
    setAnimating(true);
    
    // Iterate through starting positions (Points 0 to max-1)
    for (let start = 0; start < maxSegments; start++) {
      // Iterate through ending positions (Points start+1 to max)
      for (let end = start + 1; end <= maxSegments; end++) {
         setHighlightedSegment({ start, end, type });
         
         // Update label
         const startLabel = getPointLabel(type, start);
         const endLabel = getPointLabel(type, end);
         setCurrentSegmentName(`${startLabel}${endLabel}`);

         await new Promise(r => setTimeout(r, 800)); // Time to read the label
      }
    }
    setHighlightedSegment(null);
    setCurrentSegmentName('');
    setAnimating(false);
  };

  useEffect(() => {
    if (phase === 1) {
      runAnimation('col', COLS);
    } else if (phase === 2) {
      runAnimation('row', ROWS);
    }
  }, [phase]);

  const getPoints = (r: number, c: number) => {
    const x = START_X + c * CELL_W - r * SKEW;
    const y = START_Y + r * CELL_H;
    return { x, y };
  };

  return (
    <div className="flex flex-col items-center w-full p-2">
      <div className="flex items-center justify-between w-full max-w-lg mb-2">
         <h3 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
           <Eye size={20} /> 组合法解题：数图形
         </h3>
         <button 
            onClick={() => { setPhase(0); setHighlightedSegment(null); setCurrentSegmentName(''); }}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1 text-gray-600"
         >
           <RotateCcw size={12}/> 重置
         </button>
      </div>

      {/* SVG Container - Compact */}
      <div className="relative w-full max-w-md h-[200px] bg-slate-50 rounded-xl border border-indigo-100 flex items-center justify-center shadow-inner overflow-visible mb-2">
        <svg width="360" height="200" viewBox="0 0 360 200" className="overflow-visible">
           {/* Draw All Parallelograms (Grid) */}
           {Array.from({ length: ROWS }).map((_, r) => (
             Array.from({ length: COLS }).map((_, c) => {
               const p1 = getPoints(r, c);
               const p2 = getPoints(r, c + 1);
               const p3 = getPoints(r + 1, c + 1);
               const p4 = getPoints(r + 1, c);
               return (
                 <path 
                   key={`${r}-${c}`}
                   d={`M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y} Z`}
                   fill="white"
                   stroke="#cbd5e1"
                   strokeWidth="1"
                 />
               );
             })
           ))}

           {/* Phase 1: Highlight Base Segments */}
           {(phase === 1 || phase === 3) && (
              <g>
                <line 
                  x1={getPoints(ROWS, 0).x} y1={getPoints(ROWS, 0).y} 
                  x2={getPoints(ROWS, COLS).x} y2={getPoints(ROWS, COLS).y} 
                  stroke="#e0e7ff" strokeWidth="4" strokeLinecap="round"
                />
                
                {Array.from({ length: COLS + 1 }).map((_, i) => {
                  const p = getPoints(ROWS, i);
                  const label = String.fromCharCode(65 + i); 
                  return (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="6" fill={phase === 1 ? "#6366f1" : "#cbd5e1"} />
                      {phase === 1 && <text x={p.x - 5} y={p.y + 24} fontWeight="bold" fill="#4338ca" fontSize="14">{label}</text>}
                    </g>
                  );
                })}
                
                {phase === 1 && highlightedSegment && highlightedSegment.type === 'col' && (
                  <line 
                    x1={getPoints(ROWS, highlightedSegment.start).x} 
                    y1={getPoints(ROWS, highlightedSegment.start).y} 
                    x2={getPoints(ROWS, highlightedSegment.end).x} 
                    y2={getPoints(ROWS, highlightedSegment.end).y} 
                    stroke="#4338ca" strokeWidth="6" strokeLinecap="round"
                  />
                )}
              </g>
           )}

           {/* Phase 2: Highlight Side Segments */}
           {(phase === 2 || phase === 3) && (
              <g>
                <line 
                  x1={getPoints(0, 0).x} y1={getPoints(0, 0).y} 
                  x2={getPoints(ROWS, 0).x} y2={getPoints(ROWS, 0).y} 
                  stroke="#ffe4e6" strokeWidth="4" strokeLinecap="round"
                />
                
                {Array.from({ length: ROWS + 1 }).map((_, i) => {
                  const p = getPoints(i, 0);
                  const labels = ['A', 'E', 'F']; 
                  return (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="6" fill={phase === 2 ? "#ec4899" : "#cbd5e1"} />
                      {phase === 2 && <text x={p.x - 20} y={p.y + 5} fontWeight="bold" fill="#be123c" fontSize="14">{labels[i]}</text>}
                    </g>
                  );
                })}

                {phase === 2 && highlightedSegment && highlightedSegment.type === 'row' && (
                   <line 
                    x1={getPoints(highlightedSegment.start, 0).x} 
                    y1={getPoints(highlightedSegment.start, 0).y} 
                    x2={getPoints(highlightedSegment.end, 0).x} 
                    y2={getPoints(highlightedSegment.end, 0).y} 
                    stroke="#be123c" strokeWidth="6" strokeLinecap="round"
                  />
                )}
              </g>
           )}
        </svg>
      </div>

      {/* Controller Area - Compact Layout */}
      <div className="w-full max-w-lg bg-white p-3 rounded-xl border border-indigo-100 shadow-lg min-h-[120px] flex flex-col justify-center transition-all">
        
        {phase === 0 && (
           <div className="text-center">
             <p className="text-gray-600 mb-3 text-sm font-medium">很多图形交织在一起，试试用<span className="text-indigo-600 font-bold">“数端点法”</span>！</p>
             <button 
               onClick={() => setPhase(1)}
               className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2 mx-auto text-sm"
             >
               <Play size={16} fill="white" /> 第一步：分析底边
             </button>
           </div>
        )}

        {phase === 1 && (
          <div className="text-center animate-fade-in">
            <h4 className="font-bold text-indigo-800 text-sm mb-1">步骤 1：底边有几条线段？</h4>
            
            {animating && currentSegmentName ? (
                 <div className="text-2xl font-bold text-indigo-600 h-10 flex items-center justify-center animate-pulse">
                    {currentSegmentName}
                 </div>
            ) : (
                <div className="bg-indigo-50 px-4 py-1.5 rounded-lg mb-2 inline-block">
                  <span className="text-xs text-gray-500 mr-2">4个端点(A-D)</span>
                  <span className="text-lg font-mono font-bold text-indigo-700">3 + 2 + 1 = 6 (条)</span>
                </div>
            )}
            
            <button 
               disabled={animating}
               onClick={() => setPhase(2)}
               className="block mx-auto bg-pink-500 text-white px-5 py-2 rounded-full font-bold hover:bg-pink-600 disabled:opacity-50 text-sm mt-1"
             >
               下一步：分析侧边 <ArrowRight className="inline ml-1" size={14}/>
             </button>
          </div>
        )}

        {phase === 2 && (
          <div className="text-center animate-fade-in">
            <h4 className="font-bold text-pink-800 text-sm mb-1">步骤 2：侧边有几条线段？</h4>
            
             {animating && currentSegmentName ? (
                 <div className="text-2xl font-bold text-pink-600 h-10 flex items-center justify-center animate-pulse">
                    {currentSegmentName}
                 </div>
            ) : (
                <div className="bg-pink-50 px-4 py-1.5 rounded-lg mb-2 inline-block">
                  <span className="text-xs text-gray-500 mr-2">3个端点(A-F)</span>
                  <span className="text-lg font-mono font-bold text-pink-700">2 + 1 = 3 (条)</span>
                </div>
            )}
            
            <button 
               disabled={animating}
               onClick={() => setPhase(3)}
               className="block mx-auto bg-green-500 text-white px-5 py-2 rounded-full font-bold hover:bg-green-600 disabled:opacity-50 text-sm mt-1"
             >
               最后一步：计算总数 <Star className="inline ml-1" size={14}/>
             </button>
          </div>
        )}

        {phase === 3 && (
          <div className="text-center animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 text-xl font-bold bg-slate-50 p-2 rounded-xl border border-slate-100">
               <div className="flex flex-col items-center leading-none">
                 <span className="text-indigo-600">6</span>
                 <span className="text-[9px] text-gray-400 font-normal">底边</span>
               </div>
               <span className="text-gray-400">×</span>
               <div className="flex flex-col items-center leading-none">
                 <span className="text-pink-600">3</span>
                 <span className="text-[9px] text-gray-400 font-normal">侧边</span>
               </div>
               <span className="text-gray-400">=</span>
               <span className="text-green-600">18 个</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- Module 3.3: 优化分割 (Garden Path - Step-by-Step) ---
export const GardenPath: React.FC = () => {
  // flowStep: 
  // 0: Intro
  // 1: Option A revealed (pending calc)
  // 2: Option A result (34)
  // 3: Option B revealed (pending calc)
  // 4: Option B result (54)
  // 5: Option C revealed (pending calc)
  // 6: Option C result (48) + Final conclusion
  const [flowStep, setFlowStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when step changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [flowStep]);

  return (
    <div className="flex flex-col w-full h-full max-h-[600px]">
      <div className="p-4 bg-white border-b border-slate-100 flex-shrink-0">
          <h3 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <Map size={24}/> 最短小路挑战
          </h3>
          <p className="text-slate-500 text-sm">
             一步步计算，找到最优方案！
          </p>
      </div>
      
      {/* Scrollable Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        
        {/* Problem Statement - Always Visible */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
             <div className="flex gap-4 items-start">
                 <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                    <Ruler className="text-emerald-600" size={24} />
                 </div>
                 <div>
                    <p className="text-slate-700 font-medium mb-1">
                       一块平行四边形菜地，底长 <span className="font-bold text-emerald-600">16米</span>，斜边长 <span className="font-bold text-emerald-600">18米</span>。
                    </p>
                    <p className="text-slate-600 text-sm">
                       目标：修路分成<span className="font-bold text-orange-500">四个完全相同</span>的小平行四边形。
                       <br/>要求：小路<span className="font-bold text-purple-600">总长度最短</span>。
                    </p>
                    {flowStep === 0 && (
                      <button 
                        onClick={() => setFlowStep(1)}
                        className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-emerald-700 transition-all text-sm"
                      >
                        开始探索方案
                      </button>
                    )}
                 </div>
             </div>
        </div>

        {/* Option A: Grid Cut */}
        {flowStep >= 1 && (
            <div className="bg-white rounded-xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                    <span className="font-bold text-emerald-800 text-sm">方案 A：一横一竖</span>
                </div>
                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <svg viewBox="0 0 160 100" className="w-40 h-24 shrink-0">
                      <path d="M30 10 L130 10 L100 90 L0 90 Z" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                      <text x="70" y="25" fontSize="10" fill="#047857">16m</text>
                      <text x="5" y="60" fontSize="10" fill="#047857">18m</text>
                      <line x1="15" y1="50" x2="115" y2="50" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="80" y1="10" x2="50" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                    </svg>
                    <div className="flex-1 text-center md:text-left">
                        {flowStep === 1 ? (
                            <button 
                                onClick={() => setFlowStep(2)}
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mx-auto md:mx-0 hover:bg-slate-900"
                            >
                                <Calculator size={16}/> 计算长度
                            </button>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="text-slate-500 text-xs">计算公式：</p>
                                <p className="text-xl font-bold text-slate-800">16 + 18 = <span className="text-emerald-600">34 米</span></p>
                            </div>
                        )}
                    </div>
                </div>
                {flowStep === 2 && (
                    <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                        <button onClick={() => setFlowStep(3)} className="text-sm text-emerald-600 font-bold hover:underline">
                            还有其他分法吗？ 👇
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Option B: Vertical Cuts */}
        {flowStep >= 3 && (
            <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex justify-between items-center">
                    <span className="font-bold text-red-800 text-sm">方案 B：全部分隔底边 (3条竖线)</span>
                </div>
                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <svg viewBox="0 0 160 100" className="w-40 h-24 shrink-0">
                      <path d="M30 10 L130 10 L100 90 L0 90 Z" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                      <line x1="55" y1="10" x2="25" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="80" y1="10" x2="50" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="105" y1="10" x2="75" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                    </svg>
                    <div className="flex-1 text-center md:text-left">
                        {flowStep === 3 ? (
                            <button 
                                onClick={() => setFlowStep(4)}
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mx-auto md:mx-0 hover:bg-slate-900"
                            >
                                <Calculator size={16}/> 计算长度
                            </button>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="text-slate-500 text-xs">计算公式 (18米 × 3条)：</p>
                                <p className="text-xl font-bold text-slate-800">18 × 3 = <span className="text-red-500">54 米</span></p>
                                <div className="flex items-center gap-1 text-xs text-red-500 font-bold mt-1 justify-center md:justify-start">
                                   <XCircle size={12}/> 比 34米 长多了！
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {flowStep === 4 && (
                    <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                        <button onClick={() => setFlowStep(5)} className="text-sm text-emerald-600 font-bold hover:underline">
                            再试最后一种！ 👇
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Option C: Horizontal Cuts */}
        {flowStep >= 5 && (
            <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex justify-between items-center">
                    <span className="font-bold text-red-800 text-sm">方案 C：全部分隔斜边 (3条横线)</span>
                </div>
                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <svg viewBox="0 0 160 100" className="w-40 h-24 shrink-0">
                      <path d="M30 10 L130 10 L100 90 L0 90 Z" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                      <line x1="26" y1="30" x2="126" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="22" y1="50" x2="122" y2="50" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="18" y1="70" x2="118" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                    </svg>
                    <div className="flex-1 text-center md:text-left">
                        {flowStep === 5 ? (
                            <button 
                                onClick={() => setFlowStep(6)}
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mx-auto md:mx-0 hover:bg-slate-900"
                            >
                                <Calculator size={16}/> 计算长度
                            </button>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="text-slate-500 text-xs">计算公式 (16米 × 3条)：</p>
                                <p className="text-xl font-bold text-slate-800">16 × 3 = <span className="text-red-500">48 米</span></p>
                                <div className="flex items-center gap-1 text-xs text-red-500 font-bold mt-1 justify-center md:justify-start">
                                   <XCircle size={12}/> 还是比 34米 长！
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Conclusion */}
        {flowStep >= 6 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg text-center animate-bounce-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 size={28} className="text-white"/>
                    <h4 className="text-xl font-bold">最终赢家：方案 A</h4>
                </div>
                <p className="opacity-90">
                    最短小路长度是 <span className="font-bold text-yellow-300 text-lg">34米</span>
                </p>
                <button 
                    onClick={() => setFlowStep(0)}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2 rounded-full transition-colors"
                >
                    <RotateCcw size={12} className="inline mr-1"/> 再玩一次
                </button>
            </div>
        )}

        {/* Spacer for scrolling */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};