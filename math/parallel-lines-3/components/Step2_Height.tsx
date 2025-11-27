import React, { useState } from 'react';
import { ArrowDown, PenTool, AlertTriangle, MousePointerClick } from 'lucide-react';

// --- Module 2.1: 高线发射器 (Height Launcher) ---
export const HeightLauncher: React.FC = () => {
  const [heightDropped, setHeightDropped] = useState(false);
  const [selectedBase, setSelectedBase] = useState<'bottom' | 'side' | null>(null);

  const dropHeight = () => {
    if (!selectedBase) return;
    setHeightDropped(true);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-blue-600 mb-4">🚀 高线发射器</h3>
      
      <p className="text-gray-600 mb-4 text-sm">第一步：点击选择一条边作为“底”。第二步：发射高线！</p>

      <div className="mb-4 flex gap-4">
        <button 
          onClick={() => { setSelectedBase('bottom'); setHeightDropped(false); }}
          className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${selectedBase === 'bottom' ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-300'}`}
        >
          选择底边 (下)
        </button>
         <button 
          onClick={() => { setSelectedBase('side'); setHeightDropped(false); }}
          className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${selectedBase === 'side' ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-300'}`}
        >
          选择底边 (右)
        </button>
      </div>

      <div className="relative w-full max-w-md h-72 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
        {/* Parallelogram */}
        <div className="relative w-full h-full flex items-center justify-center">
             <svg width="350" height="250" viewBox="0 0 350 250" className="overflow-visible">
                {/* Shape */}
                <polygon 
                  points="100,200 250,200 280,80 130,80" 
                  fill="rgba(59, 130, 246, 0.2)" 
                  stroke="#2563EB" 
                  strokeWidth="3"
                />
                
                {/* Vertex Labels */}
                <text x="90" y="215" fill="#666">A</text>
                <text x="260" y="215" fill="#666">B</text>
                <text x="290" y="75" fill="#666">C</text>
                <text x="120" y="75" fill="#666">D</text>

                {/* Highlight Base */}
                {selectedBase === 'bottom' && (
                  <line x1="100" y1="200" x2="250" y2="200" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                )}
                {selectedBase === 'side' && (
                  <line x1="250" y1="200" x2="280" y2="80" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                )}

                {/* Dropped Height Animation - Bottom Base */}
                {selectedBase === 'bottom' && heightDropped && (
                  <g className="animate-fade-in">
                    {/* The Triangle Ruler */}
                    <path d="M130 80 L130 200 L180 200 Z" fill="rgba(255,255,0,0.3)" stroke="orange" strokeDasharray="4"/>
                    
                    <line x1="130" y1="80" x2="130" y2="200" stroke="#10B981" strokeWidth="3" strokeDasharray="5,5">
                       <animate attributeName="y2" from="80" to="200" dur="0.5s" fill="freeze" />
                    </line>
                    <rect x="130" y="190" width="10" height="10" fill="none" stroke="#10B981" strokeWidth="2" />
                    <text x="135" y="140" fill="#10B981" fontSize="14" fontWeight="bold">高</text>
                  </g>
                )}

                 {/* Dropped Height Animation - Side Base */}
                {selectedBase === 'side' && heightDropped && (
                  <g className="animate-fade-in">
                     {/* Perpendicular to side BC from D. BC slope is roughly (80-200)/(280-250) = -120/30 = -4. 
                         Perp slope is 1/4. Line from D(130,80). 
                         y - 80 = 0.25(x - 130) => y = 0.25x + 47.5.
                         Line BC: y - 200 = -4(x - 250) => y = -4x + 1200.
                         Intersect: 0.25x + 47.5 = -4x + 1200 => 4.25x = 1152.5 => x approx 271.
                         y = -4(271) + 1200 = 116.
                     */}
                     <line x1="130" y1="80" x2="265" y2="114" stroke="#10B981" strokeWidth="3" strokeDasharray="5,5">
                        <animate attributeName="x2" from="130" to="265" dur="0.5s" fill="freeze" />
                        <animate attributeName="y2" from="80" to="114" dur="0.5s" fill="freeze" />
                     </line>
                     <text x="200" y="90" fill="#10B981" fontSize="14" fontWeight="bold">高</text>
                     {/* Right angle marker approx */}
                     <path d="M258 112 L262 100 L271 102" fill="none" stroke="#10B981" strokeWidth="2" />
                  </g>
                )}
             </svg>
        </div>
      </div>

      <button 
        onClick={dropHeight}
        disabled={!selectedBase}
        className="mt-6 px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-transform hover:scale-105"
      >
        <ArrowDown className="mr-2" /> 发射三角尺！
      </button>
      
      {heightDropped && (
        <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200 animate-bounce">
          <p className="text-green-700 font-bold text-center">
            成功！高线必须垂直（90°）于底边！
          </p>
        </div>
      )}
    </div>
  );
};

// --- Module 2.2: 高线的秘密 (Drawing Height) ---
export const HeightDrawing: React.FC = () => {
  const [mode, setMode] = useState<'inside' | 'outside'>('inside');
  const [drawn, setDrawn] = useState(false);
  
  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-teal-600 mb-4"><PenTool className="mr-2 inline"/>游戏：寻找高线</h3>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => { setMode('inside'); setDrawn(false); }} 
          className={`px-4 py-2 rounded-full border font-bold ${mode === 'inside' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-gray-500'}`}
        >
          平缓的平行四边形
        </button>
        <button 
          onClick={() => { setMode('outside'); setDrawn(false); }} 
          className={`px-4 py-2 rounded-full border font-bold ${mode === 'outside' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-gray-500'}`}
        >
          倾斜的平行四边形
        </button>
      </div>

      <div className="w-full h-72 bg-white rounded-xl shadow-inner flex items-center justify-center border-2 border-teal-100 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
         
         <svg width="350" height="250" viewBox="0 0 350 250" className="relative z-10">
            {mode === 'inside' ? (
              <g>
                <polygon points="50,200 200,200 240,50 90,50" fill="rgba(20, 184, 166, 0.2)" stroke="#0D9488" strokeWidth="3" />
                <text x="125" y="220" fill="#EF4444" fontWeight="bold">底边</text>
                <line x1="50" y1="200" x2="200" y2="200" stroke="#EF4444" strokeWidth="4" />
                
                {drawn && (
                  <>
                    <line x1="90" y1="50" x2="90" y2="200" stroke="#000" strokeWidth="2" strokeDasharray="5,5">
                       <animate attributeName="y2" from="50" to="200" dur="0.8s" fill="freeze" />
                    </line>
                    <rect x="90" y="190" width="10" height="10" fill="none" stroke="#000" />
                    <text x="95" y="130" className="text-sm font-bold bg-white fill-teal-800">形内高</text>
                  </>
                )}
              </g>
            ) : (
              <g>
                {/* Very slanted parallelogram */}
                <polygon points="120,200 200,200 280,50 200,50" fill="rgba(20, 184, 166, 0.2)" stroke="#0D9488" strokeWidth="3" />
                <line x1="120" y1="200" x2="200" y2="200" stroke="#EF4444" strokeWidth="4" />
                <text x="140" y="220" fill="#EF4444" fontWeight="bold">底边</text>
                
                {drawn && (
                  <>
                    {/* Extension Line */}
                    <line x1="200" y1="200" x2="280" y2="200" stroke="#999" strokeWidth="2" strokeDasharray="4" />
                    
                    {/* Outside Height */}
                    <line x1="280" y1="50" x2="280" y2="200" stroke="#000" strokeWidth="2" strokeDasharray="4">
                       <animate attributeName="y2" from="50" to="200" dur="0.8s" fill="freeze" />
                    </line>
                    <rect x="270" y="190" width="10" height="10" fill="none" stroke="#000" />
                    <text x="285" y="130" className="text-sm font-bold fill-teal-800">形外高</text>
                  </>
                )}
              </g>
            )}
         </svg>
      </div>

      <button 
        onClick={() => setDrawn(true)} 
        className={`mt-6 flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-lg transition-transform hover:scale-105 ${drawn ? 'bg-gray-400 cursor-default' : 'bg-teal-600 hover:bg-teal-700'}`}
        disabled={drawn}
      >
        <PenTool size={18} /> {drawn ? "已绘制" : mode === 'inside' ? "画出形内高" : "画出形外高"}
      </button>

      {drawn && (
         <p className="mt-4 text-center text-teal-800 font-medium bg-teal-50 p-2 rounded">
          {mode === 'inside' 
            ? "高线落在了底边上（形内高）。" 
            : "注意！因为形状太斜，高线落在了底边的延长线上（形外高）！但它们的长度是一样的。"}
        </p>
      )}
    </div>
  );
};

// --- Module 2.3: 高只能有一条 (Unique Height) ---
export const UniqueHeight: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-red-500 mb-4"><AlertTriangle className="inline mr-2"/>挑战：高只能有一条？</h3>
      
      <div className="relative w-full h-64 bg-red-50 rounded-xl flex items-center justify-center overflow-hidden border border-red-100">
        <svg width="350" height="250">
           {/* Line L */}
           <line x1="20" y1="200" x2="330" y2="200" stroke="#000" strokeWidth="4" />
           <text x="310" y="190" fontWeight="bold" fontSize="16">直线 L (底边)</text>

           {/* Point P */}
           <circle cx="175" cy="50" r="6" fill="#EF4444" />
           <text x="165" y="40" fontWeight="bold" fill="#EF4444" fontSize="16">点 P</text>

           {/* Wrong Lines */}
           <g className="opacity-50 hover:opacity-100 transition-opacity">
             <line x1="175" y1="50" x2="50" y2="200" stroke="#AAA" strokeWidth="2" strokeDasharray="5,5" />
             <text x="40" y="190" fontSize="10" fill="#999">太远了</text>
           </g>
           <g className="opacity-50 hover:opacity-100 transition-opacity">
             <line x1="175" y1="50" x2="110" y2="200" stroke="#AAA" strokeWidth="2" strokeDasharray="5,5" />
           </g>
           <g className="opacity-50 hover:opacity-100 transition-opacity">
             <line x1="175" y1="50" x2="240" y2="200" stroke="#AAA" strokeWidth="2" strokeDasharray="5,5" />
           </g>
           <g className="opacity-50 hover:opacity-100 transition-opacity">
             <line x1="175" y1="50" x2="300" y2="200" stroke="#AAA" strokeWidth="2" strokeDasharray="5,5" />
             <text x="290" y="190" fontSize="10" fill="#999">斜了</text>
           </g>

           {/* Correct Height */}
           <line x1="175" y1="50" x2="175" y2="200" stroke="#EF4444" strokeWidth="4" />
           <rect x="175" y="190" width="10" height="10" fill="none" stroke="#EF4444" strokeWidth="2"/>
           <text x="180" y="130" fill="#EF4444" fontWeight="bold">垂直！</text>
        </svg>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
        <p className="text-center font-medium text-lg">
          <span className="text-2xl mr-2">☝️</span>
          过直线外一点，只能画<span className="text-red-600 font-bold mx-1">一条</span>垂线！
        </p>
        <p className="text-center text-gray-500 text-sm mt-1">
          所以针对同一条底，平行四边形的高也只有一条哦。
        </p>
      </div>
    </div>
  );
};