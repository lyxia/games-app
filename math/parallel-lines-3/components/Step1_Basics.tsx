import React, { useState } from 'react';
import { Ruler, MoveHorizontal, MousePointer2, ScanSearch, scaling, ArrowRightLeft, ScanLine } from 'lucide-react';

// --- Module 1.1: 特征侦探 (The Inspector) ---
export const FeatureInspector: React.FC = () => {
  const [mode, setMode] = useState<'none' | 'sides' | 'angles' | 'parallel'>('none');

  // Coordinates for the parallelogram
  // A(TopLeft), B(TopRight), C(BottomRight), D(BottomLeft)
  // Let's position it centrally.
  const A = { x: 140, y: 80 };
  const B = { x: 300, y: 80 };
  const C = { x: 260, y: 200 };
  const D = { x: 100, y: 200 };

  const getInfoText = () => {
    switch (mode) {
      case 'sides': return "发现：上下边长度相等，左右边长度相等！(对边相等)";
      case 'angles': return "发现：对角的度数是一样的！(对角相等)";
      case 'parallel': return "发现：无限延长后，对边永远不相交！(两组对边分别平行)";
      default: return "点击上方按钮，开始侦探工作！";
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
        <ScanSearch size={24} /> 特征侦探：寻找隐藏的秘密
      </h3>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setMode('sides')}
          className={`px-5 py-2.5 rounded-full font-bold shadow-sm border-2 transition-all flex items-center gap-2 ${mode === 'sides' ? 'bg-indigo-500 text-white border-indigo-600 ring-2 ring-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          <Ruler size={18} /> 测量边
        </button>
        <button
          onClick={() => setMode('angles')}
          className={`px-5 py-2.5 rounded-full font-bold shadow-sm border-2 transition-all flex items-center gap-2 ${mode === 'angles' ? 'bg-indigo-500 text-white border-indigo-600 ring-2 ring-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          <ScanLine size={18} /> 测量角
        </button>
        <button
          onClick={() => setMode('parallel')}
          className={`px-5 py-2.5 rounded-full font-bold shadow-sm border-2 transition-all flex items-center gap-2 ${mode === 'parallel' ? 'bg-indigo-500 text-white border-indigo-600 ring-2 ring-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          <ArrowRightLeft size={18} /> 验证平行
        </button>
      </div>

      <div className="relative w-full max-w-md h-80 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Background Grid */}
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

        <svg width="400" height="300" viewBox="0 0 400 300" className="z-10 overflow-visible">
          <defs>
             <marker id="arrowEnd" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
               <path d="M0,0 L0,10 L10,5 z" fill="#94a3b8" />
             </marker>
             <marker id="arrowStart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
               <path d="M10,0 L10,10 L0,5 z" fill="#94a3b8" />
             </marker>
          </defs>

          {/* Parallel Extension Lines */}
          {mode === 'parallel' && (
            <g className="animate-fade-in">
              {/* Horizontal Extensions */}
              <line x1="0" y1="80" x2="400" y2="80" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6,4" markerEnd="url(#arrowEnd)" markerStart="url(#arrowStart)" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6,4" markerEnd="url(#arrowEnd)" markerStart="url(#arrowStart)" />
              
              {/* Slanted Extensions */}
              {/* Slope = (200-80)/(100-140) = 120/-40 = -3 */}
              <line x1={140 + 60} y1={80 - 180} x2={100 - 60} y2={200 + 180} stroke="#94a3b8" strokeWidth="1" strokeDasharray="6,4" />
              <line x1={300 + 60} y1={80 - 180} x2={260 - 60} y2={200 + 180} stroke="#94a3b8" strokeWidth="1" strokeDasharray="6,4" />
            </g>
          )}

          {/* Angles Arcs */}
          {mode === 'angles' && (
            <g className="animate-fade-in">
               {/* Angle A (Top Left) & C (Bottom Right) - Obtuse */}
               <path d={`M${A.x + 25},${A.y} A 25 25 0 0 1 ${A.x + 8} ${A.y + 24}`} fill="#c084fc" opacity="0.5" />
               <path d={`M${C.x - 25},${C.y} A 25 25 0 0 1 ${C.x - 8} ${C.y - 24}`} fill="#c084fc" opacity="0.5" />
               
               {/* Angle B (Top Right) & D (Bottom Left) - Acute */}
               <path d={`M${B.x - 25},${B.y} A 25 25 0 0 0 ${B.x - 8} ${B.y + 24}`} fill="#fb923c" opacity="0.5" />
               <path d={`M${D.x + 25},${D.y} A 25 25 0 0 0 ${D.x + 8} ${D.y - 24}`} fill="#fb923c" opacity="0.5" />
            </g>
          )}

          {/* The Main Shape */}
          <polygon 
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
            fill="rgba(99, 102, 241, 0.1)"
            stroke="#4f46e5"
            strokeWidth="3"
            className="transition-all duration-500"
          />

          {/* Labels for Vertices */}
          <text x={A.x - 15} y={A.y} fill="#64748b" fontWeight="bold">A</text>
          <text x={B.x + 10} y={B.y} fill="#64748b" fontWeight="bold">B</text>
          <text x={C.x + 10} y={C.y + 10} fill="#64748b" fontWeight="bold">C</text>
          <text x={D.x - 15} y={D.y + 10} fill="#64748b" fontWeight="bold">D</text>

          {/* Sides Info */}
          {mode === 'sides' && (
            <g className="animate-fade-in font-bold text-sm">
               {/* Top & Bottom */}
               <text x={(A.x + B.x)/2 - 15} y={A.y - 10} fill="#ef4444">10 cm</text>
               <text x={(D.x + C.x)/2 - 15} y={D.y + 20} fill="#ef4444">10 cm</text>
               <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#ef4444" strokeWidth="4" />
               <line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke="#ef4444" strokeWidth="4" />

               {/* Left & Right */}
               <text x={D.x - 35} y={(D.y + A.y)/2} fill="#059669">6 cm</text>
               <text x={C.x + 15} y={(C.y + B.y)/2} fill="#059669">6 cm</text>
               <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke="#059669" strokeWidth="4" />
               <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#059669" strokeWidth="4" />
            </g>
          )}

           {/* Angles Info */}
           {mode === 'angles' && (
            <g className="animate-fade-in font-bold text-xs">
               <text x={A.x + 10} y={A.y + 40} fill="#7e22ce">钝角</text>
               <text x={C.x - 40} y={C.y - 30} fill="#7e22ce">钝角</text>
               <text x={D.x + 30} y={D.y - 10} fill="#ea580c">锐角</text>
               <text x={B.x - 50} y={B.y + 20} fill="#ea580c">锐角</text>
            </g>
          )}

        </svg>
      </div>

      <div className={`mt-6 p-4 rounded-xl border text-center transition-all duration-500 transform ${mode !== 'none' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${
          mode === 'sides' ? 'bg-red-50 border-red-200 text-red-800' :
          mode === 'angles' ? 'bg-orange-50 border-orange-200 text-orange-800' :
          'bg-indigo-50 border-indigo-200 text-indigo-800'
      }`}>
        <p className="font-bold text-lg">{getInfoText()}</p>
      </div>
    </div>
  );
};

// --- Module 1.2: 尺子与量角器 (Properties) ---
export const PropertyExplorer: React.FC = () => {
  const [skew, setSkew] = useState(0);
  
  // Calculate coordinates based on skew
  const baseX = 80;
  const baseY = 200;
  const width = 190;
  const height = 120;
  const topY = baseY - height; // 80
  
  const skewOffset = skew * 2; // Multiplier for visual effect
  
  const Ax = baseX + skewOffset;
  const Ay = topY;
  const Bx = baseX + width + skewOffset;
  const By = topY;
  const Cx = baseX + width;
  const Cy = baseY;
  const Dx = baseX;
  const Dy = baseY;

  // Approximate angle calculation for display
  const angleD = 90 - skew; 
  const angleA = 180 - angleD;

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2">
        <Ruler size={24}/> 性质总结：拉一拉
      </h3>
      
      <p className="text-gray-500 mb-6 text-sm">拖动滑块，观察<span className="text-orange-600 font-bold">对边</span>和<span className="text-blue-600 font-bold">对角</span>的变化！</p>

      <div className="relative w-full max-w-md h-80 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
        <svg width="350" height="250" viewBox="0 0 350 250" className="overflow-visible">
           <defs>
             <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
               <path d="M0,0 L0,10 L10,5 z" fill="#f97316" />
             </marker>
           </defs>

           {/* The Parallelogram */}
           <path 
             d={`M${Ax},${Ay} L${Bx},${By} L${Cx},${Cy} L${Dx},${Dy} Z`} 
             fill="rgba(251, 146, 60, 0.2)" 
             stroke="#ea580c" 
             strokeWidth="3"
             className="transition-all duration-300 ease-out"
           />

           {/* Vertex Labels */}
           <text x={Ax - 15} y={Ay - 10} fill="#666" fontWeight="bold">A</text>
           <text x={Bx + 5} y={By - 10} fill="#666" fontWeight="bold">B</text>
           <text x={Cx + 5} y={Cy + 20} fill="#666" fontWeight="bold">C</text>
           <text x={Dx - 15} y={Dy + 20} fill="#666" fontWeight="bold">D</text>

           {/* Angle Arcs & Labels */}
           {/* Angle A */}
           <path d={`M${Ax + 20},${Ay} A 20 20 0 0 1 ${Ax + 15 * Math.cos((angleA-20)*0.017)} ${Ay + 15}`} fill="none" stroke="#2563eb" strokeWidth="2" />
           <text x={Ax + 10} y={Ay + 35} fill="#2563eb" fontSize="12" fontWeight="bold">∠A</text>

           {/* Angle C (Opposite to A) */}
           <path d={`M${Cx - 20},${Cy} A 20 20 0 0 1 ${Cx - 15} ${Cy - 10}`} fill="none" stroke="#2563eb" strokeWidth="2" />
           <text x={Cx - 30} y={Cy - 15} fill="#2563eb" fontSize="12" fontWeight="bold">∠C</text>

           {/* Side Labels */}
           <text x={(Ax+Bx)/2 - 20} y={Ay - 10} fill="#ea580c" fontSize="12" fontWeight="bold">上底 10cm</text>
           <text x={(Dx+Cx)/2 - 20} y={Dy + 20} fill="#ea580c" fontSize="12" fontWeight="bold">下底 10cm</text>
        </svg>

        {/* Floating properties info */}
        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow border border-orange-100 text-xs">
           <div className="text-blue-600 font-bold mb-1">∠A = {Math.round(angleA)}°</div>
           <div className="text-blue-600 font-bold">∠C = {Math.round(angleA)}°</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-8 w-full max-w-xs">
         <span className="text-xl">📐</span>
         <input 
          type="range" 
          min="-40" 
          max="40" 
          value={skew} 
          onChange={(e) => setSkew(parseInt(e.target.value))}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-200 w-full max-w-lg text-center">
        <p className="text-orange-900 font-medium">
          独家秘密：<span className="font-bold">对边相等</span>，<span className="font-bold text-blue-600">对角相等</span>！
        </p>
      </div>
    </div>
  );
};

// --- Module 1.3: 变形金刚 (Instability) ---
export const InstabilityDemo: React.FC = () => {
  const [isPulling, setIsPulling] = useState(false);

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h3 className="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
        <MoveHorizontal size={24}/> 易变性：我是变形金刚
      </h3>
      
      <p className="text-gray-500 mb-6 text-sm">长方形框架很不稳定，轻轻一拉就变身！</p>

      <div className="relative w-full max-w-md h-80 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Background Grid */}
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        {/* The Frame Animation */}
        <div 
          className="relative w-40 h-40 border-[12px] border-amber-700 bg-transparent transition-transform duration-700 ease-in-out origin-bottom-left shadow-2xl z-10 box-content"
          style={{ 
            transform: isPulling ? 'skewX(35deg) scaleY(0.85) translateX(30px)' : 'skewX(0deg)',
            borderRadius: '4px'
          }}
        >
          {/* Rivets (Joints) */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600 z-20"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600 z-20"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600 z-20"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600 z-20"></div>
          
          {/* Inner shade for depth */}
          <div className="absolute inset-0 bg-amber-900/5"></div>
        </div>

        {/* Real World Examples appearing */}
        <div className={`absolute right-4 top-8 transition-all duration-500 transform ${isPulling ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
           <div className="bg-white p-2 rounded shadow-lg border-l-4 border-purple-400 flex items-center gap-2">
              <span className="text-2xl">🚪</span>
              <span className="text-xs font-bold text-purple-700">伸缩门</span>
           </div>
        </div>
      </div>

      <button 
        onMouseDown={() => setIsPulling(true)}
        onMouseUp={() => setIsPulling(false)}
        onMouseLeave={() => setIsPulling(false)}
        onTouchStart={() => setIsPulling(true)}
        onTouchEnd={() => setIsPulling(false)}
        className={`mt-8 px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 ${isPulling ? 'bg-purple-600 text-white scale-105' : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'}`}
      >
        <MousePointer2 size={18} /> {isPulling ? "正在拉伸..." : "按住拉动"}
      </button>

      <div className={`mt-4 text-center transition-opacity duration-500 ${isPulling ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-purple-800 font-medium bg-purple-100 px-4 py-2 rounded-lg inline-block">
          这就叫平行四边形的<span className="font-bold">“不稳定性”</span>！
        </p>
      </div>
    </div>
  );
};
