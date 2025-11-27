
import React, { useState, useRef, useEffect } from 'react';
import { LabTab, Concept } from '../types';
import { conceptList } from '../constants';
import { Play, RotateCcw, CheckCircle, Ruler, MousePointer2, Pencil, Eraser, MoveHorizontal, Hand, Square, ArrowRight, Columns } from 'lucide-react';

// --- Embedded Concept Card Component ---
const ConceptCard: React.FC<{ concept: Concept }> = ({ concept }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-40 w-full cursor-pointer perspective-1000 group mb-6"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
           style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>
        
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md border-2 border-macaron-blue flex flex-row items-center justify-between p-4 px-6 hover:bg-blue-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{concept.icon}</div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-macaron-text">{concept.title}</h3>
              <p className="text-xs text-blue-400 font-bold mt-1">点击查看知识点 ✨</p>
            </div>
          </div>
          <ArrowRight className="text-gray-300 animate-pulse" />
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-macaron-blue rounded-xl shadow-md flex flex-col items-center justify-center p-4 text-center rotate-y-180 overflow-y-auto"
             style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          <p className="text-base font-bold text-white leading-relaxed">
            {concept.content}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Lab A: Rubber Band (Shortest Path) ---
const LabAShortestPath = () => {
  const [mousePos, setMousePos] = useState({ x: 300, y: 250 });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointP = { x: 200, y: 50 };
  const lineY = 250;
  const viewBoxWidth = 400; // SVG internal coordinate width

  const updatePosition = (clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Calculate scale factor: SVG internal width / Displayed CSS width
    const scaleX = viewBoxWidth / rect.width; 
    
    // Transform CSS coordinates to SVG coordinates
    const rawX = (clientX - rect.left) * scaleX;
    const x = Math.max(20, Math.min(380, rawX)); // Clamp within SVG boundaries
    
    // Check if vertical (with increased tolerance for kids: 12px)
    const isVertical = Math.abs(x - pointP.x) < 12;

    if (isVertical) {
      setMousePos({ x: pointP.x, y: lineY }); // Snap to vertical
      setIsSuccess(true);
    } else {
      setMousePos({ x, y: lineY });
      setIsSuccess(false);
    }
  };

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    updatePosition(clientX);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMove = (clientX: number) => {
    if (isDragging) { 
       updatePosition(clientX);
    }
  };

  const distance = Math.round(Math.sqrt(Math.pow(mousePos.x - pointP.x, 2) + Math.pow(lineY - pointP.y, 2)));

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-macaron-purple relative overflow-hidden select-none">
      <div className="absolute top-4 left-4 bg-macaron-yellow px-4 py-2 rounded-full shadow-sm z-10 pointer-events-none">
        <span className="font-bold text-macaron-text">距离: {distance} 像素</span>
      </div>
      
      {isSuccess && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-macaron-green px-6 py-4 rounded-xl shadow-2xl z-20 animate-bounce text-center border-4 border-white pointer-events-none">
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-bold text-lg text-green-800">成功找到最短距离！</div>
          <div className="text-sm text-green-700">这就是“点到直线的距离”</div>
        </div>
      )}

      <svg 
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} 300`}
        className="w-full h-64 md:h-96 bg-macaron-cream touch-none cursor-ew-resize"
        style={{ touchAction: 'none' }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => {
          if (isDragging || e.buttons === 1) handleMove(e.clientX);
        }}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* The Line L */}
        <line x1="20" y1={lineY} x2="380" y2={lineY} stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" />
        <text x="350" y={lineY - 10} fontSize="16" fill="#4A4A4A" fontWeight="bold">直线 L</text>

        {/* Connecting Line (Rubber band) */}
        <line 
          x1={pointP.x} y1={pointP.y} 
          x2={mousePos.x} y2={lineY} 
          stroke={isSuccess ? "#FF6B6B" : "#A2D2FF"} 
          strokeWidth={isSuccess ? 6 : 4}
          strokeDasharray={isSuccess ? "0" : "5,5"}
          className="transition-all duration-200"
        />

        {/* Right Angle Symbol if success */}
        {isSuccess && (
           <path d={`M ${pointP.x + 15} ${lineY} L ${pointP.x + 15} ${lineY - 15} L ${pointP.x} ${lineY - 15}`} fill="none" stroke="#FF6B6B" strokeWidth="2" />
        )}

        {/* Point P */}
        <circle cx={pointP.x} cy={pointP.y} r="8" fill="#FFC8DD" stroke="#4A4A4A" strokeWidth="2" />
        <text x={pointP.x - 10} y={pointP.y - 15} fontSize="18" fontWeight="bold">P</text>

        {/* Moving Point Handle */}
        <g style={{ transform: `translate(${mousePos.x}px, ${lineY}px)` }} className="cursor-grab active:cursor-grabbing">
           {/* Larger hit area for touch */}
           <circle r="25" fill="transparent" /> 
           <circle r="12" fill={isSuccess ? "#4ADE80" : "#A2D2FF"} stroke="#fff" strokeWidth="3" className="shadow-sm" />
           {!isSuccess && <circle r="20" fill="#A2D2FF" opacity="0.3" className="animate-ping" />}
           <MoveHorizontal size={16} x="-8" y="-8" color="white" className="pointer-events-none" />
        </g>
      </svg>
      <div className="flex justify-center items-center mt-4 gap-2 text-gray-500 font-medium bg-purple-50 p-2 rounded-lg">
         <Hand size={20} className="animate-pulse text-macaron-purple" />
         <span>按住蓝色圆点左右拖动，看看什么时候线最短？</span>
      </div>
    </div>
  );
};

// --- Lab B: Parallel Tracks ---
const LabBParallelTracks = () => {
  const [lines, setLines] = useState<{x: number, isVertical: boolean, slantDir: number}[]>([]);
  const [tool, setTool] = useState<'vertical' | 'slant'>('vertical');
  const svgRef = useRef<SVGSVGElement>(null);
  
  const trackY1 = 80;
  const trackY2 = 220;
  const trackHeight = trackY2 - trackY1;
  const viewBoxWidth = 400; // SVG internal coordinate width

  // Unified handler for Mouse and Touch
  const handleInput = (clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Calculate scale factor: SVG internal width / Displayed CSS width
    const scaleX = viewBoxWidth / rect.width;

    // Transform CSS coordinates to SVG coordinates
    const rawX = (clientX - rect.left) * scaleX;
    const x = Math.max(20, Math.min(380, rawX)); // Clamp within SVG
    
    const isVertical = tool === 'vertical';
    // Random slant direction for variety (+60 or -60 pixels offset)
    const slantDir = Math.random() > 0.5 ? 60 : -60;

    setLines([...lines, { x, isVertical, slantDir }]);
  };

  const clearLines = () => setLines([]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-macaron-green relative">
       {/* Toolbar */}
       <div className="flex flex-wrap justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg gap-2">
         <div className="flex gap-2">
            <button 
              onClick={() => setTool('vertical')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${tool === 'vertical' ? 'bg-macaron-green text-green-900 shadow-sm ring-2 ring-green-200 transform scale-105' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
            >
              <Ruler size={18} />
              画垂线
            </button>
            <button 
              onClick={() => setTool('slant')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${tool === 'slant' ? 'bg-gray-200 text-gray-700 shadow-sm ring-2 ring-gray-300 transform scale-105' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
            >
              <Pencil size={18} />
              画斜线
            </button>
         </div>
         <button onClick={clearLines} className="flex items-center gap-1 text-gray-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors ml-auto">
            <Eraser size={18} />
            <span className="text-sm">清空</span>
         </button>
       </div>

      <svg 
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} 300`} 
        className={`w-full h-64 md:h-96 bg-macaron-cream touch-none ${tool === 'vertical' ? 'cursor-cell' : 'cursor-crosshair'}`}
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => handleInput(e.clientX)}
      >
        {/* Tracks */}
        <defs>
          <pattern id="sleeper" width="40" height="300" patternUnits="userSpaceOnUse">
             <rect x="10" y={trackY1} width="20" height={trackHeight} fill="#E5E7EB" opacity="0.3" rx="4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sleeper)" />
        
        <line x1="0" y1={trackY1} x2="400" y2={trackY1} stroke="#4A4A4A" strokeWidth="6" />
        <line x1="0" y1={trackY2} x2="400" y2={trackY2} stroke="#4A4A4A" strokeWidth="6" />
        
        {/* User Lines */}
        {lines.map((l, i) => {
          const slantOffset = l.isVertical ? 0 : l.slantDir;
          const length = Math.round(Math.sqrt(Math.pow(slantOffset, 2) + Math.pow(trackHeight, 2)));
          const color = l.isVertical ? "#4ADE80" : "#9CA3AF";
          
          return (
            <g key={i} className="animate-fade-in">
              <line 
                x1={l.x} y1={trackY1} 
                x2={l.x + slantOffset} y2={trackY2} 
                stroke={color} 
                strokeWidth="4" 
                strokeLinecap="round"
              />
              <rect x={l.x - 20} y={(trackY1 + trackY2)/2 - 10} width="40" height="20" fill="white" rx="4" opacity="0.9" />
              <text x={l.x} y={(trackY1 + trackY2)/2 + 5} fill={l.isVertical ? "#166534" : "#4B5563"} fontSize="12" fontWeight="bold" textAnchor="middle">
                {length}
              </text>
              {l.isVertical && (
                 <rect x={l.x} y={trackY2 - 15} width="15" height="15" fill="none" stroke={color} strokeWidth="2" />
              )}
            </g>
          )
        })}
      </svg>
      <div className={`mt-4 p-3 rounded-lg text-center font-medium text-sm transition-colors ${tool === 'vertical' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {tool === 'vertical' ? '✨ 看！无论在哪里画，垂直线段的长度都是一样的 (最短)。' : '👀 试一试！你会发现斜着的线永远比垂直线段长。'}
      </div>
    </div>
  );
};

// --- Lab C: Animation ---
const LabCAnimation = () => {
  const [step, setStep] = useState(0); 
  
  useEffect(() => {
    let timer: any;
    if (step > 0 && step < 4) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 2500);
    } else if (step === 4) {
        timer = setTimeout(() => {
            setStep(0);
        }, 4000); 
    }
    return () => clearTimeout(timer);
  }, [step]);

  const startAnimation = () => setStep(1);

  const getRulerTransform = () => {
    // Exact calculation to make ruler align with the line:
    // Ruler path height = 120px, Scaled by 1.2 = 144px.
    // Line Y = 250px.
    // Translate Y = 250 - 144 = 106px.
    const targetY = 106;

    switch (step) {
      case 0: return 'translate(320px, 40px) rotate(15deg)'; // Resting
      case 1: return `translate(200px, ${targetY}px) rotate(0deg)`; // 1. Align (贴合)
      case 2: return `translate(100px, ${targetY}px) rotate(0deg)`; // 2. Move to point (平移)
      case 3: return `translate(100px, ${targetY}px) rotate(0deg)`; // 3. Draw
      case 4: return `translate(300px, ${targetY}px) rotate(0deg)`; // 4. Move away (移开)
      default: return 'translate(320px, 40px)';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-macaron-pink flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="font-bold text-macaron-text">三角尺画垂线演示</h3>
        <button 
          onClick={startAnimation}
          disabled={step !== 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transition-all ${step === 0 ? 'bg-macaron-pink hover:bg-pink-300 active:scale-95' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {step === 0 ? <><Play size={16} /> 播放演示</> : <><RotateCcw size={16} className="animate-spin" /> 演示中...</>}
        </button>
      </div>

      <div className="relative w-full h-64 md:h-80 bg-macaron-cream rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
        
        {/* Step Indicators */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
             {[
               {id: 1, text: "1. 贴紧直线"},
               {id: 2, text: "2. 移动找点"},
               {id: 3, text: "3. 沿尺画线"},
               {id: 4, text: "4. 标直角号"}
             ].map((s) => (
                <div key={s.id} className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${step === s.id ? 'bg-macaron-pink text-white scale-110 shadow-md' : 'bg-white/50 text-gray-400'}`}>
                  {s.text}
                </div>
             ))}
        </div>

        <svg viewBox="0 0 400 300" className="w-full h-full">
           <line x1="20" y1="250" x2="380" y2="250" stroke="#4A4A4A" strokeWidth="4" />
           <circle cx="100" cy="100" r="6" fill="#4A4A4A" />
           <text x="80" y="95" fontSize="16" fontWeight="bold" fill="#4A4A4A">点 A</text>

           {/* Drawn Line */}
           <line 
             x1="100" y1="100" x2="100" y2="250" 
             stroke="#FF6B6B" 
             strokeWidth="4" 
             strokeDasharray="150"
             strokeDashoffset={step >= 3 ? 0 : 150}
             className="transition-all duration-1000 ease-linear"
           />
           
           {/* Right Angle Mark */}
           <g style={{ opacity: step === 4 ? 1 : 0 }} className="transition-opacity duration-500 delay-500">
              <path d="M 100 230 L 120 230 L 120 250" fill="none" stroke="#FF6B6B" strokeWidth="2" />
           </g>

           {/* Ruler */}
           <g style={{ transform: getRulerTransform(), transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
             <path d="M 0 0 L 0 120 L 70 120 Z" fill="rgba(162, 210, 255, 0.9)" stroke="#4A90E2" strokeWidth="2" transform="scale(1.2)" filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.2))" />
             {/* Simple marks */}
             <line x1="0" y1="20" x2="10" y2="20" stroke="white" strokeWidth="2" transform="scale(1.2)" />
             <line x1="0" y1="40" x2="10" y2="40" stroke="white" strokeWidth="2" transform="scale(1.2)" />
             <line x1="0" y1="60" x2="10" y2="60" stroke="white" strokeWidth="2" transform="scale(1.2)" />
             <line x1="0" y1="80" x2="10" y2="80" stroke="white" strokeWidth="2" transform="scale(1.2)" />
             <line x1="0" y1="100" x2="10" y2="100" stroke="white" strokeWidth="2" transform="scale(1.2)" />
           </g>
        </svg>
      </div>
    </div>
  );
};

// --- Lab D: Rectangle Builder ---
const LabDRectangleBuilder = () => {
  // Steps: 
  // 0: Init
  // 1: Bottom Line
  // 2: Left Vertical Line + Ruler at Left
  // 3: Right Vertical Line + Ruler at Right
  // 4: Top Line + Finish
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: any;
    if (step > 0 && step < 4) {
      // Steps 1->2, 2->3, 3->4
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 3000); 
    } else if (step === 4) {
      // Reset after showing the final result for a while
      timer = setTimeout(() => {
        setStep(0);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const startDemo = () => setStep(1);

  // Helper for text instructions
  const getInstruction = () => {
    switch(step) {
      case 0: return "点击播放，看长方形是如何画出来的！";
      case 1: return "第一步：画一条长长的水平线段（长）。";
      case 2: return "第二步：在左端点向上画第一条垂线段（宽）。";
      case 3: return "第三步：在右端点向上画第二条垂线段（宽）。";
      case 4: return "第四步：连接上方两个端点，长方形建成啦！";
      default: return "";
    }
  };

  // Helper for ruler position
  const getRulerTransform = () => {
    // Point A (Left) is at (100, 200). Ruler height 120.
    // To align ruler bottom-left (0, 120) with (100, 200), we need translate(100, 80).
    const leftPos = 'translate(100px, 80px)';
    
    // Point B (Right) is at (300, 200). 
    // To align vertical edge at x=300, we translate to (300, 80).
    const rightPos = 'translate(300px, 80px)';
    
    // Offscreen position
    const hidden = 'translate(450px, 80px)';

    switch(step) {
      case 0: return hidden;
      case 1: return hidden; // Wait for bottom line
      case 2: return leftPos; // Move to Left
      case 3: return rightPos; // Move to Right
      case 4: return hidden; // Move away
      default: return hidden;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-macaron-blue flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4 bg-blue-50 p-3 rounded-lg">
        <p className="font-bold text-macaron-text text-sm md:text-base flex-1 transition-all">{getInstruction()}</p>
        <button 
          onClick={startDemo}
          disabled={step !== 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transition-all ml-4 whitespace-nowrap ${step === 0 ? 'bg-macaron-blue hover:bg-blue-400 active:scale-95' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {step === 0 ? <><Play size={18} /> 播放构建演示</> : <><RotateCcw size={18} className="animate-spin" /> 构建中...</>}
        </button>
      </div>

      <div className="relative w-full h-64 md:h-80 bg-white rounded-lg overflow-hidden border-2 border-gray-100">
        
        {/* Step Indicators */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-none">
             {[
               {id: 1, text: "1. 画底边"},
               {id: 2, text: "2. 左垂线"},
               {id: 3, text: "3. 右垂线"},
               {id: 4, text: "4. 连顶边"}
             ].map((s) => (
                <div key={s.id} className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${step === s.id ? 'bg-macaron-blue text-white scale-110 shadow-md' : 'bg-white/80 text-gray-400'}`}>
                  {s.text}
                </div>
             ))}
        </div>

        <svg viewBox="0 0 400 300" className="w-full h-full">
           <defs>
             <marker id="dot" markerWidth="8" markerHeight="8" refX="4" refY="4">
               <circle cx="4" cy="4" r="3" fill="#4A4A4A" />
             </marker>
           </defs>
           
           {/* Grid background */}
           <path d="M 0 50 H 400 M 0 100 H 400 M 0 150 H 400 M 0 200 H 400 M 0 250 H 400" stroke="#f0f0f0" strokeWidth="1" />
           <path d="M 50 0 V 300 M 100 0 V 300 M 150 0 V 300 M 200 0 V 300 M 250 0 V 300 M 300 0 V 300 M 350 0 V 300" stroke="#f0f0f0" strokeWidth="1" />

           {/* Step 1: Bottom Line (A-B) */}
           <g>
             <line 
                x1="100" y1="200" x2="300" y2="200" 
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" 
                strokeDasharray="200"
                strokeDashoffset={step >= 1 ? 0 : 200}
                className="transition-all duration-1000 ease-out"
             />
             <text x="90" y="215" fontSize="14" fontWeight="bold" opacity={step >= 1 ? 1 : 0} className="transition-opacity">A</text>
             <text x="305" y="215" fontSize="14" fontWeight="bold" opacity={step >= 1 ? 1 : 0} className="transition-opacity">B</text>
           </g>

           {/* Step 2: Left Vertical Line (A-D) */}
           <g>
             {/* Note: Drawing UP means y1=200, y2=100. Length 100. */}
             <line 
                x1="100" y1="200" x2="100" y2="100" 
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" 
                strokeDasharray="100"
                strokeDashoffset={step >= 2 ? 0 : 100}
                className="transition-all duration-1000 ease-out delay-500" // delay slightly so ruler arrives first
             />
             <path d="M 100 185 L 115 185 L 115 200" fill="none" stroke="#FF6B6B" strokeWidth="2" opacity={step >= 2 ? 1 : 0} className="transition-opacity delay-1000" />
             <text x="90" y="95" fontSize="14" fontWeight="bold" opacity={step >= 2 ? 1 : 0} className="transition-opacity">D</text>
           </g>

           {/* Step 3: Right Vertical Line (B-C) */}
           <g>
             <line 
                x1="300" y1="200" x2="300" y2="100" 
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" 
                strokeDasharray="100"
                strokeDashoffset={step >= 3 ? 0 : 100}
                className="transition-all duration-1000 ease-out delay-500"
             />
             <path d="M 300 185 L 285 185 L 285 200" fill="none" stroke="#FF6B6B" strokeWidth="2" opacity={step >= 3 ? 1 : 0} className="transition-opacity delay-1000" />
             <text x="305" y="95" fontSize="14" fontWeight="bold" opacity={step >= 3 ? 1 : 0} className="transition-opacity">C</text>
           </g>

           {/* Step 4: Top Line (C-D) & Fill */}
           <g>
             <line 
                x1="100" y1="100" x2="300" y2="100" 
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" 
                strokeDasharray="200"
                strokeDashoffset={step >= 4 ? 0 : 200}
                className="transition-all duration-1000 ease-out"
             />
             <rect 
                x="100" y="100" width="200" height="100" 
                fill="rgba(162, 210, 255, 0.3)" 
                opacity={step >= 4 ? 1 : 0}
                className="transition-opacity duration-1000 delay-500"
             />
           </g>

           {/* The Magic Ruler */}
           <g 
             style={{ transform: getRulerTransform(), transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
             className="pointer-events-none"
           >
             <path d="M 0 0 L 0 120 L 70 120 Z" fill="rgba(162, 210, 255, 0.9)" stroke="#4A90E2" strokeWidth="2" filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.2))" />
             {/* Ruler marks */}
             {[20, 40, 60, 80, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="10" y2={y} stroke="white" strokeWidth="2" />
             ))}
           </g>

        </svg>
      </div>
    </div>
  );
};

// --- Lab E: Parallel Line Drawing Animation ---
const LabEParallelLineDrawing = () => {
  const [step, setStep] = useState(0);
  // step: 0=初始, 1=画已知直线, 2=标记点P, 3=三角尺贴直线, 4=直尺靠三角尺, 5=平移三角尺, 6=画平行线

  // 关键坐标
  const lineY = 220;                    // 已知直线 L 的 y 坐标
  const pointP = { x: 200, y: 80 };     // 点 P 的位置
  const triangleWidth = 80;             // 三角尺水平边长度
  const triangleHeight = 140;           // 三角尺竖直边长度（需要到达点P: 220-80=140）

  useEffect(() => {
    let timer: any;
    if (step > 0 && step < 6) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 2500);
    } else if (step === 6) {
      timer = setTimeout(() => {
        setStep(0);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const startAnimation = () => setStep(1);

  const getInstruction = () => {
    switch(step) {
      case 0: return "点击播放，看如何用三角尺画平行线！";
      case 1: return "第一步：画一条已知直线 L";
      case 2: return "第二步：在直线外标记一点 P";
      case 3: return "第三步：三角尺底边贴紧直线，垂直边经过点 P";
      case 4: return "第四步：直尺紧靠三角尺的垂直边";
      case 5: return "第五步：按住直尺，三角尺沿直尺向上平移到点 P";
      case 6: return "第六步：沿三角尺底边画出平行线，完成！";
      default: return "";
    }
  };

  // 三角尺位置（左下角直角处的坐标）
  // 垂直边 x = pointP.x，这样垂直边经过点P
  const getTriangleY = () => {
    switch(step) {
      case 0:
      case 1:
      case 2:
        return lineY; // 初始在直线位置（但opacity为0）
      case 3:
      case 4:
        return lineY; // 底边贴直线
      case 5:
      case 6:
        return pointP.y; // 向上平移，底边经过点P
      default:
        return lineY;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-orange-300 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4 bg-orange-50 p-3 rounded-lg">
        <p className="font-bold text-macaron-text text-sm md:text-base flex-1 transition-all">{getInstruction()}</p>
        <button
          onClick={startAnimation}
          disabled={step !== 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transition-all ml-4 whitespace-nowrap ${step === 0 ? 'bg-orange-400 hover:bg-orange-500 active:scale-95' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {step === 0 ? <><Play size={18} /> 播放演示</> : <><RotateCcw size={18} className="animate-spin" /> 演示中...</>}
        </button>
      </div>

      <div className="relative w-full h-64 md:h-80 bg-white rounded-lg overflow-hidden border-2 border-gray-100">

        {/* Step Indicators */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 z-10 pointer-events-none">
             {[
               {id: 1, text: "1. 画直线"},
               {id: 2, text: "2. 标记点"},
               {id: 3, text: "3. 放三角尺"},
               {id: 4, text: "4. 靠直尺"},
               {id: 5, text: "5. 平移"},
               {id: 6, text: "6. 画线"}
             ].map((s) => (
                <div key={s.id} className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${step === s.id ? 'bg-orange-400 text-white scale-110 shadow-md' : 'bg-white/80 text-gray-400'}`}>
                  {s.text}
                </div>
             ))}
        </div>

        <svg viewBox="0 0 400 300" className="w-full h-full">
           {/* Grid background */}
           <path d="M 0 50 H 400 M 0 100 H 400 M 0 150 H 400 M 0 200 H 400 M 0 250 H 400" stroke="#f0f0f0" strokeWidth="1" />
           <path d="M 50 0 V 300 M 100 0 V 300 M 150 0 V 300 M 200 0 V 300 M 250 0 V 300 M 300 0 V 300 M 350 0 V 300" stroke="#f0f0f0" strokeWidth="1" />

           {/* Step 1: 已知直线 L */}
           <g>
             <line
                x1="50" y1={lineY} x2="350" y2={lineY}
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset={step >= 1 ? 0 : 300}
                className="transition-all duration-1000 ease-out"
             />
             <text x="360" y={lineY + 5} fontSize="14" fontWeight="bold" opacity={step >= 1 ? 1 : 0} className="transition-opacity">L</text>
           </g>

           {/* Step 2: 点 P */}
           <g opacity={step >= 2 ? 1 : 0} className="transition-opacity duration-500">
             <circle cx={pointP.x} cy={pointP.y} r="6" fill="#FF6B6B" />
             <text x={pointP.x + 10} y={pointP.y - 5} fontSize="14" fontWeight="bold" fill="#FF6B6B">P</text>
           </g>

           {/* Step 4: 直尺（竖直，贴着三角尺的垂直边） */}
           <g opacity={step >= 4 ? 1 : 0} className="transition-opacity duration-500">
             <rect
                x={pointP.x - 20}
                y={30}
                width="20"
                height="210"
                fill="#E5E7EB"
                stroke="#9CA3AF"
                strokeWidth="2"
                rx="2"
             />
             {/* 直尺刻度 */}
             {[50, 80, 110, 140, 170, 200, 230].map(y => (
                <line key={y} x1={pointP.x - 20} y1={y} x2={pointP.x - 10} y2={y} stroke="#9CA3AF" strokeWidth="1" />
             ))}
           </g>

           {/* Step 3-6: 三角尺 */}
           <g
             className="pointer-events-none"
             opacity={step >= 3 ? 1 : 0}
             style={{ transition: 'opacity 0.5s' }}
           >
             {/* 三角尺：直角在左下角，水平边向右贴着当前y位置，竖直边向上经过点P */}
             <path
                d={`M ${pointP.x} ${getTriangleY()} L ${pointP.x + triangleWidth} ${getTriangleY()} L ${pointP.x} ${getTriangleY() - triangleHeight} Z`}
                fill="rgba(162, 210, 255, 0.9)"
                stroke="#4A90E2"
                strokeWidth="2"
                filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.2))"
                style={{ transition: 'd 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
             />
             {/* 直角标记 */}
             <path
                d={`M ${pointP.x} ${getTriangleY() - 15} L ${pointP.x + 15} ${getTriangleY() - 15} L ${pointP.x + 15} ${getTriangleY()}`}
                fill="none"
                stroke="#4A90E2"
                strokeWidth="1.5"
                style={{ transition: 'd 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
             />
           </g>

           {/* Step 6: 画出的平行线（沿三角尺底边） */}
           <line
              x1="50" y1={pointP.y} x2="350" y2={pointP.y}
              stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset={step >= 6 ? 0 : 300}
              className="transition-all duration-1000 ease-out"
           />

           {/* 平行线标记 */}
           {step === 6 && (
              <g className="animate-fade-in">
                 <text x="30" y={(lineY + pointP.y) / 2 + 5} fontSize="14" fill="#666">∥</text>
                 <text x="365" y={(lineY + pointP.y) / 2 + 5} fontSize="14" fill="#666">∥</text>
              </g>
           )}
        </svg>
      </div>

      {step === 6 && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg text-center">
          <span className="text-orange-700 font-bold">平行线画好了！两条线永不相交。</span>
        </div>
      )}
    </div>
  );
};

// --- Lab F: Square Builder ---
const LabFSquareBuilder = () => {
  const [step, setStep] = useState(0);
  // step: 0=初始, 1=画底边, 2=左垂线, 3=右垂线, 4=连顶边

  useEffect(() => {
    let timer: any;
    if (step > 0 && step < 4) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 3000);
    } else if (step === 4) {
      timer = setTimeout(() => {
        setStep(0);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const startDemo = () => setStep(1);

  const getInstruction = () => {
    switch(step) {
      case 0: return "点击播放，看正方形是如何画出来的！";
      case 1: return "第一步：画一条线段作为底边（边长相等）";
      case 2: return "第二步：在左端点画一条相同长度的垂线";
      case 3: return "第三步：在右端点画一条相同长度的垂线";
      case 4: return "第四步：连接上方两点，正方形完成！";
      default: return "";
    }
  };

  // 正方形顶点 (边长 120)
  // A(140, 220), B(260, 220), C(260, 100), D(140, 100)
  const sideLength = 120;
  const A = { x: 140, y: 220 };
  const B = { x: 260, y: 220 };
  const C = { x: 260, y: 100 };
  const D = { x: 140, y: 100 };

  const getRulerTransform = () => {
    const leftPos = `translate(${A.x}px, ${D.y}px)`;
    const rightPos = `translate(${B.x}px, ${C.y}px)`;
    const hidden = 'translate(400px, 100px)';

    switch(step) {
      case 0:
      case 1:
        return hidden;
      case 2:
        return leftPos;
      case 3:
        return rightPos;
      case 4:
        return hidden;
      default:
        return hidden;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-yellow-300 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4 bg-yellow-50 p-3 rounded-lg">
        <p className="font-bold text-macaron-text text-sm md:text-base flex-1 transition-all">{getInstruction()}</p>
        <button
          onClick={startDemo}
          disabled={step !== 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transition-all ml-4 whitespace-nowrap ${step === 0 ? 'bg-yellow-500 hover:bg-yellow-600 active:scale-95' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {step === 0 ? <><Play size={18} /> 播放构建演示</> : <><RotateCcw size={18} className="animate-spin" /> 构建中...</>}
        </button>
      </div>

      <div className="relative w-full h-64 md:h-80 bg-white rounded-lg overflow-hidden border-2 border-gray-100">

        {/* Step Indicators */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-none">
             {[
               {id: 1, text: "1. 画底边"},
               {id: 2, text: "2. 左垂线"},
               {id: 3, text: "3. 右垂线"},
               {id: 4, text: "4. 连顶边"}
             ].map((s) => (
                <div key={s.id} className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${step === s.id ? 'bg-yellow-500 text-white scale-110 shadow-md' : 'bg-white/80 text-gray-400'}`}>
                  {s.text}
                </div>
             ))}
        </div>

        <svg viewBox="0 0 400 300" className="w-full h-full">
           {/* Grid background */}
           <path d="M 0 50 H 400 M 0 100 H 400 M 0 150 H 400 M 0 200 H 400 M 0 250 H 400" stroke="#f0f0f0" strokeWidth="1" />
           <path d="M 50 0 V 300 M 100 0 V 300 M 150 0 V 300 M 200 0 V 300 M 250 0 V 300 M 300 0 V 300 M 350 0 V 300" stroke="#f0f0f0" strokeWidth="1" />

           {/* Step 1: 底边 (A-B) */}
           <g>
             <line
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={sideLength}
                strokeDashoffset={step >= 1 ? 0 : sideLength}
                className="transition-all duration-1000 ease-out"
             />
             <text x={A.x - 15} y={A.y + 5} fontSize="14" fontWeight="bold" opacity={step >= 1 ? 1 : 0} className="transition-opacity">A</text>
             <text x={B.x + 5} y={B.y + 5} fontSize="14" fontWeight="bold" opacity={step >= 1 ? 1 : 0} className="transition-opacity">B</text>
             {/* 底边长度标记 */}
             <text x={(A.x + B.x) / 2 - 10} y={A.y + 25} fontSize="12" fill="#666" opacity={step >= 1 ? 1 : 0} className="transition-opacity">{sideLength}</text>
           </g>

           {/* Step 2: 左垂线 (A-D) */}
           <g>
             <line
                x1={A.x} y1={A.y} x2={D.x} y2={D.y}
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={sideLength}
                strokeDashoffset={step >= 2 ? 0 : sideLength}
                className="transition-all duration-1000 ease-out delay-500"
             />
             {/* 直角标记 */}
             <path d={`M ${A.x + 15} ${A.y} L ${A.x + 15} ${A.y - 15} L ${A.x} ${A.y - 15}`} fill="none" stroke="#FF6B6B" strokeWidth="2" opacity={step >= 2 ? 1 : 0} className="transition-opacity delay-1000" />
             <text x={D.x - 15} y={D.y - 5} fontSize="14" fontWeight="bold" opacity={step >= 2 ? 1 : 0} className="transition-opacity">D</text>
             {/* 左边长度标记 */}
             <text x={A.x - 30} y={(A.y + D.y) / 2 + 5} fontSize="12" fill="#666" opacity={step >= 2 ? 1 : 0} className="transition-opacity">{sideLength}</text>
           </g>

           {/* Step 3: 右垂线 (B-C) */}
           <g>
             <line
                x1={B.x} y1={B.y} x2={C.x} y2={C.y}
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={sideLength}
                strokeDashoffset={step >= 3 ? 0 : sideLength}
                className="transition-all duration-1000 ease-out delay-500"
             />
             {/* 直角标记 */}
             <path d={`M ${B.x - 15} ${B.y} L ${B.x - 15} ${B.y - 15} L ${B.x} ${B.y - 15}`} fill="none" stroke="#FF6B6B" strokeWidth="2" opacity={step >= 3 ? 1 : 0} className="transition-opacity delay-1000" />
             <text x={C.x + 5} y={C.y - 5} fontSize="14" fontWeight="bold" opacity={step >= 3 ? 1 : 0} className="transition-opacity">C</text>
             {/* 右边长度标记 */}
             <text x={B.x + 10} y={(B.y + C.y) / 2 + 5} fontSize="12" fill="#666" opacity={step >= 3 ? 1 : 0} className="transition-opacity">{sideLength}</text>
           </g>

           {/* Step 4: 顶边 (D-C) 和填充 */}
           <g>
             <line
                x1={D.x} y1={D.y} x2={C.x} y2={C.y}
                stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={sideLength}
                strokeDashoffset={step >= 4 ? 0 : sideLength}
                className="transition-all duration-1000 ease-out"
             />
             {/* 顶边长度标记 */}
             <text x={(D.x + C.x) / 2 - 10} y={D.y - 10} fontSize="12" fill="#666" opacity={step >= 4 ? 1 : 0} className="transition-opacity">{sideLength}</text>
             {/* 上方直角标记 */}
             <path d={`M ${D.x + 15} ${D.y} L ${D.x + 15} ${D.y + 15} L ${D.x} ${D.y + 15}`} fill="none" stroke="#FF6B6B" strokeWidth="2" opacity={step >= 4 ? 1 : 0} className="transition-opacity delay-500" />
             <path d={`M ${C.x - 15} ${C.y} L ${C.x - 15} ${C.y + 15} L ${C.x} ${C.y + 15}`} fill="none" stroke="#FF6B6B" strokeWidth="2" opacity={step >= 4 ? 1 : 0} className="transition-opacity delay-500" />
             {/* 填充 */}
             <rect
                x={A.x} y={D.y} width={sideLength} height={sideLength}
                fill="rgba(253, 224, 71, 0.3)"
                opacity={step >= 4 ? 1 : 0}
                className="transition-opacity duration-1000 delay-500"
             />
           </g>

           {/* 三角尺 */}
           <g
             style={{ transform: getRulerTransform(), transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
             className="pointer-events-none"
           >
             <path d="M 0 0 L 0 120 L 70 120 Z" fill="rgba(162, 210, 255, 0.9)" stroke="#4A90E2" strokeWidth="2" filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.2))" />
             {[20, 40, 60, 80, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="10" y2={y} stroke="white" strokeWidth="2" />
             ))}
           </g>

        </svg>
      </div>

      {step === 4 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
          <span className="text-yellow-700 font-bold">正方形画好了！四条边都是 {sideLength}，四个角都是直角 90°。</span>
        </div>
      )}
    </div>
  );
};

export const LabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>(LabTab.SHORTEST_PATH);

  // Map tabs to Concept IDs (see constants.ts)
  const conceptMap = {
    [LabTab.SHORTEST_PATH]: 1,        // 点到直线的距离
    [LabTab.PARALLEL_TRACKS]: 2,      // 平行线间的距离
    [LabTab.DRAWING_ANIMATION]: 3,    // 画垂线四步法
    [LabTab.RECTANGLE_BUILDER]: 4,    // 几何图形的应用
    [LabTab.PARALLEL_LINE_DRAWING]: 5, // 画平行线
    [LabTab.SQUARE_BUILDER]: 6         // 画正方形
  };
  
  const currentConcept = conceptList.find(c => c.id === conceptMap[activeTab]);

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center mb-6 gap-2 md:gap-4">
        <button 
          onClick={() => setActiveTab(LabTab.SHORTEST_PATH)}
          className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === LabTab.SHORTEST_PATH ? 'bg-macaron-purple text-white shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          <MousePointer2 size={18} />
          实验 A
        </button>
        <button 
          onClick={() => setActiveTab(LabTab.PARALLEL_TRACKS)}
          className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === LabTab.PARALLEL_TRACKS ? 'bg-macaron-green text-green-800 shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          <MoveHorizontal size={18} />
          实验 B
        </button>
        <button 
          onClick={() => setActiveTab(LabTab.DRAWING_ANIMATION)}
          className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === LabTab.DRAWING_ANIMATION ? 'bg-macaron-pink text-white shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          <Play size={18} />
          实验 C
        </button>
        <button
          onClick={() => setActiveTab(LabTab.RECTANGLE_BUILDER)}
          className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === LabTab.RECTANGLE_BUILDER ? 'bg-macaron-blue text-white shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          <Square size={18} />
          实验 D
        </button>
        <button
          onClick={() => setActiveTab(LabTab.PARALLEL_LINE_DRAWING)}
          className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === LabTab.PARALLEL_LINE_DRAWING ? 'bg-orange-400 text-white shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          <Columns size={18} />
          实验 E
        </button>
        <button
          onClick={() => setActiveTab(LabTab.SQUARE_BUILDER)}
          className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === LabTab.SQUARE_BUILDER ? 'bg-yellow-500 text-white shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          <Square size={18} />
          实验 F
        </button>
      </div>
      
      {/* Concept Card Integrated Area */}
      {currentConcept && (
        <div className="animate-fade-in mb-2">
           <ConceptCard concept={currentConcept} />
        </div>
      )}

      <div className="animate-fade-in transition-all duration-300">
        {activeTab === LabTab.SHORTEST_PATH && <LabAShortestPath />}
        {activeTab === LabTab.PARALLEL_TRACKS && <LabBParallelTracks />}
        {activeTab === LabTab.DRAWING_ANIMATION && <LabCAnimation />}
        {activeTab === LabTab.RECTANGLE_BUILDER && <LabDRectangleBuilder />}
        {activeTab === LabTab.PARALLEL_LINE_DRAWING && <LabEParallelLineDrawing />}
        {activeTab === LabTab.SQUARE_BUILDER && <LabFSquareBuilder />}
      </div>
    </div>
  );
};
