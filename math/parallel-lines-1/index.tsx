import React, { useState, useEffect, useRef } from 'react';
// import { createRoot } from 'react-dom/client'; // 已注释，因为现在通过路由系统使用
import { GoogleGenAI } from "@google/genai";

// --- Audio System (Singleton & Lazy Init) ---
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playSound = (type: 'correct' | 'wrong' | 'click' | 'win') => {
  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'correct') {
    // Ding!
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'wrong') {
    // Buzz
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'click') {
    // Soft Pop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'win') {
    // Victory Fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major Arpeggio
    notes.forEach((freq, i) => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'square';
      osc2.frequency.value = freq;
      const start = now + i * 0.1;
      gain2.gain.setValueAtTime(0.1, start);
      gain2.gain.linearRampToValueAtTime(0, start + 0.25);
      osc2.start(start);
      osc2.stop(start + 0.3);
    });
  }
};

// --- Data Constants ---

const MODULES = [
  { id: 1, title: "概念记忆卡", subtitle: "核心填空题库", color: "bg-blue-500", icon: "📇" },
  { id: 2, title: "陷阱大扫除", subtitle: "易错判断题", color: "bg-orange-500", icon: "🧹" },
  { id: 3, title: "火眼金睛", subtitle: "图形辨析", color: "bg-green-500", icon: "👀" },
  { id: 4, title: "奥数计算器", subtitle: "交点规律", color: "bg-purple-500", icon: "🧮" },
];

const FLASHCARDS = [
  { q: "在____内，不相交的两条直线叫做平行线。", a: "同一平面", hint: "重点！没有这句话就是错的" },
  { q: "两条直线相交成____时，这两条直线互相垂直。", a: "直角 (90度)", hint: "必须是直角哦" },
  { q: "两条直线互相垂直，交点叫做____。", a: "垂足", hint: "垂下来落到的脚" },
  { q: "平行可以用符号____表示。", a: "//", hint: "像倾斜的铁轨" },
  { q: "垂直可以用符号____表示。", a: "⊥", hint: "像倒过来的T" },
  { q: "同一平面内，两条直线的位置关系只有哪两种？", a: "相交 和 不相交", hint: "平行属于不相交" },
  { q: "能不能说“直线a是垂线”？", a: "不能！", hint: "要说“直线a是直线b的垂线” (这是相互的)" },
];

const TRAP_QUESTIONS = [
  { q: "“不相交的两条直线叫做平行线。”", a: false, explain: "漏了“在同一平面内”，如果在空间里一上一下也不相交但不是平行。" },
  { q: "“长方形相对的边互相平行，相邻的边互相垂直。”", a: true, explain: "正确！这是长方形的基本特征。" },
  { q: "“两条直线相交，它们就一定互相垂直。”", a: false, explain: "错！必须相交成90度才叫垂直，否则只是普通相交。" },
  { q: "“直线 a 垂直于 直线 b，那么直线 b 一定也垂直于直线 a。”", a: true, explain: "正确！垂直是互相的朋友关系。" },
  { q: "“在纸上画两条弯弯曲曲的线，它们不相交，所以是平行线。”", a: false, explain: "错！平行线必须是“直线”，曲线不算。" },
  { q: "“两条线看着没相交，但延长后会撞在一起，这不算平行。”", a: true, explain: "正确！平行必须是无限延长永不相交。" },
  { q: "“上午9点时，钟面上的时针和分针互相垂直。”", a: true, explain: "正确！9点整时针指9，分针指12，夹角90度。" },
  { q: "“把一张正方形纸对折两次，折痕一定互相垂直。”", a: false, explain: "错！可能互相垂直，也可能互相平行，看你怎么折。" },
  { q: "“过直线上一点，只能画一条直线与已知直线垂直。”", a: true, explain: "正确！垂线具有唯一性。" },
  { q: "“同一平面内，两条直线都和第三条直线垂直，那这两条直线互相平行。”", a: true, explain: "正确！这就是著名的“门框原理”。" },
];

// --- Components ---

const Card = ({ item, isFlipped, onClick }) => (
  <div 
    className="relative w-full h-64 cursor-pointer perspective-1000 group mb-6 select-none"
    onClick={onClick}
  >
    <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
      {/* Front */}
      <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border-2 border-blue-100 flex flex-col items-center justify-center p-6 text-center hover:shadow-2xl transition-shadow">
        <div className="text-sm text-blue-400 font-bold mb-4">☝️ 点击翻转</div>
        <h3 className="text-2xl font-bold text-gray-700 leading-relaxed">{item.q}</h3>
      </div>
      {/* Back */}
      <div className="absolute w-full h-full backface-hidden bg-blue-500 rounded-2xl shadow-xl rotate-y-180 flex flex-col items-center justify-center p-6 text-center text-white border-4 border-blue-300">
        <h3 className="text-3xl font-bold mb-4">{item.a}</h3>
        <p className="text-blue-100 bg-blue-700/50 px-4 py-2 rounded-lg text-sm">{item.hint}</p>
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, isCorrect, content, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in relative border-4 border-white ring-4 ring-opacity-50 ring-blue-300">
        <div className={`text-center text-6xl mb-4 transform transition-transform ${isCorrect ? 'scale-110' : 'animate-shake'}`}>
          {isCorrect ? '🎉' : '🤔'}
        </div>
        <h2 className={`text-3xl font-black text-center mb-3 ${isCorrect ? 'text-green-500' : 'text-orange-500'}`}>
          {isCorrect ? '答对啦！' : '哎呀，错了！'}
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <p className="text-lg text-gray-700 text-center leading-relaxed font-medium">
            {content}
          </p>
        </div>
        <button 
          onClick={onClose}
          className={`w-full font-black py-4 px-6 rounded-2xl shadow-lg transform transition active:scale-95 text-xl
            ${isCorrect ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200'}`}
        >
          继续挑战 ➜
        </button>
      </div>
    </div>
  );
};

// --- Interactive Graph Component for Module 4 ---

const InteractiveGraph = ({ lineCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Logic to generate lines and intersections
  const generateData = (n) => {
    const lines = [];
    // Generate n lines in "general position"
    // Using eq: x*cos(theta) + y*sin(theta) = dist
    for (let i = 0; i < n; i++) {
      // Spread angles but add randomness to avoid easy parallels
      const angleDeg = (i * 180 / n) + (Math.random() * 10 - 5); 
      const angleRad = angleDeg * Math.PI / 180;
      // Varied distance from center so they don't all cross at 0,0
      const dist = (i % 2 === 0 ? 1 : -1) * (15 + i * 12) + (Math.random() * 10);
      
      lines.push({
        a: Math.cos(angleRad),
        b: Math.sin(angleRad),
        c: dist,
        color: `hsl(${(i * 340 / n) + 20}, 80%, 45%)`
      });
    }

    const points = [];
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const l1 = lines[i];
        const l2 = lines[j];
        const det = l1.a * l2.b - l2.a * l1.b;
        if (Math.abs(det) > 0.0001) {
          const x = (l1.c * l2.b - l2.c * l1.b) / det;
          const y = (l1.a * l2.c - l2.a * l1.c) / det;
          points.push({x, y});
        }
      }
    }
    return { lines, points };
  };

  const [data, setData] = useState({ lines: [], points: [] });

  useEffect(() => {
    setData(generateData(lineCount));
    // Reset view on new count
    setTransform({ x: 0, y: 0, scale: 1 });
  }, [lineCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    
    // Resize handling
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };
    
    // Draw function
    const draw = () => {
      if (!ctx) return;
      const { width, height } = canvas;
      const { x: tx, y: ty, scale } = transform;
      const cx = width / 2;
      const cy = height / 2;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Background Grid
      ctx.save();
      ctx.translate(cx + tx, cy + ty);
      ctx.scale(scale, scale);

      // Draw Grid
      ctx.beginPath();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1 / scale;
      const gridSize = 50;
      // Draw enough grid lines to cover view (simplified large area)
      const range = 2000; 
      for (let i = -range; i <= range; i += gridSize) {
        ctx.moveTo(i, -range);
        ctx.lineTo(i, range);
        ctx.moveTo(-range, i);
        ctx.lineTo(range, i);
      }
      ctx.stroke();

      // Draw Lines
      data.lines.forEach(l => {
        // Draw large segment
        // We need two points far away.
        // ax + by = c. If b!=0, y = (c - ax)/b.
        const d = 2000; 
        let x1, y1, x2, y2;
        
        if (Math.abs(l.b) > Math.abs(l.a)) {
           x1 = -d; y1 = (l.c - l.a * x1) / l.b;
           x2 = d;  y2 = (l.c - l.a * x2) / l.b;
        } else {
           y1 = -d; x1 = (l.c - l.b * y1) / l.a;
           y2 = d;  x2 = (l.c - l.b * y2) / l.a;
        }

        ctx.beginPath();
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 2 / scale; // keep line width constant in screen pixels
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw Points
      data.points.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = '#FF3D00';
        ctx.arc(p.x, p.y, 4 / scale, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 61, 0, 0.4)';
        ctx.lineWidth = 2 / scale;
        ctx.arc(p.x, p.y, 8 / scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.restore();
      
      // Info Text Overlay
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`直线: ${lineCount} 条`, 10, 25);
      ctx.fillText(`交点: ${data.points.length} 个`, 10, 45);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [data, transform]);

  // Event Handlers
  const handleWheel = (e) => {
    e.preventDefault();
    // Standard Trackpad Zoom behavior:
    // e.ctrlKey is true on Pinch gestures on many browsers
    // OR if user specifically holds Ctrl + Wheel
    if (e.ctrlKey) {
      const zoomSensitivity = 0.005;
      const newScale = Math.max(0.1, Math.min(5, transform.scale - e.deltaY * zoomSensitivity));
      setTransform(prev => ({ ...prev, scale: newScale }));
    } else {
      // Pan (Scroll Wheel / Two Finger Move)
      setTransform(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-80 bg-white border-2 border-purple-100 rounded-xl relative overflow-hidden cursor-move touch-none shadow-inner group"
    >
      <canvas 
        ref={canvasRef} 
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full"
      />
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button 
          onClick={() => setTransform(t => ({...t, scale: t.scale * 1.2}))}
          className="bg-white/90 hover:bg-white text-gray-600 w-8 h-8 flex items-center justify-center rounded-full shadow border border-gray-200 font-bold text-lg"
        >
          +
        </button>
        <button 
          onClick={() => setTransform(t => ({...t, scale: t.scale / 1.2}))}
          className="bg-white/90 hover:bg-white text-gray-600 w-8 h-8 flex items-center justify-center rounded-full shadow border border-gray-200 font-bold text-lg"
        >
          -
        </button>
        <button 
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          className="bg-white/90 hover:bg-white text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow border border-gray-200"
        >
          复位
        </button>
      </div>
      <div className="absolute top-2 right-2 text-xs text-gray-400 pointer-events-none select-none bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm border border-gray-100">
        🖱️ 拖拽/双指滑动平移 | 🤏 捏合/Ctrl+滚轮缩放
      </div>
    </div>
  );
};


// --- Modules ---

// M1: Concept Cards
const Module1 = ({ onFinish }) => {
  const [flipped, setFlipped] = useState({});
  
  const toggleCard = (index) => {
    playSound('click');
    setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const allFlipped = Object.keys(flipped).length >= FLASHCARDS.length;

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="text-center mb-8">
        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">第一关</span>
        <h2 className="text-3xl font-black text-gray-800 hand-font mt-2">概念记忆卡</h2>
        <p className="text-gray-500 mt-2">点击卡片翻面，记住每一个知识点！</p>
      </div>
      <div className="grid gap-6">
        {FLASHCARDS.map((item, idx) => (
          <Card 
            key={idx} 
            item={item} 
            isFlipped={!!flipped[idx]} 
            onClick={() => toggleCard(idx)} 
          />
        ))}
      </div>
      <button 
        onClick={onFinish} 
        className="w-full mt-10 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-xl font-bold py-5 rounded-2xl shadow-xl transform transition hover:scale-105 active:scale-95"
      >
        我已全部掌握，完成打卡！ ✅
      </button>
    </div>
  );
};

// M2: Trap Sweeping
const Module2 = ({ onUpdateScore, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lastResult, setLastResult] = useState({ correct: false, text: '' });
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (userSaysYes) => {
    const q = TRAP_QUESTIONS[currentIdx];
    const isCorrect = userSaysYes === q.a;
    
    if (isCorrect) {
      playSound('correct');
      onUpdateScore(10);
      setLastResult({ correct: true, text: q.explain });
    } else {
      playSound('wrong');
      setLastResult({ correct: false, text: q.explain });
    }
    setShowModal(true);
  };

  const nextQuestion = () => {
    setShowModal(false);
    if (currentIdx < TRAP_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      playSound('win');
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto animate-bounce-in">
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-4xl font-black text-orange-600 mb-4 hand-font">扫雷完毕！</h2>
        <p className="text-xl text-gray-600 mb-10 font-medium">你已经成功避开了所有陷阱，太棒了！</p>
        <button onClick={onFinish} className="w-full bg-blue-500 text-white py-4 rounded-2xl text-xl font-bold shadow-xl hover:bg-blue-600 transform transition hover:-translate-y-1">
          返回主菜单
        </button>
      </div>
    );
  }

  const q = TRAP_QUESTIONS[currentIdx];
  const progressPercent = ((currentIdx) / TRAP_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6 text-gray-500 font-bold px-2">
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">第 {currentIdx + 1} / {TRAP_QUESTIONS.length} 题</span>
        <span>陷阱大扫除</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full mb-8 overflow-hidden shadow-inner">
        <div className="h-full bg-orange-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
      </div>
      
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 min-h-[300px] flex flex-col items-center justify-center relative border-b-8 border-orange-100">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 leading-relaxed mb-10">
          {q.q}
        </h3>
        
        <div className="grid grid-cols-2 gap-6 w-full">
          <button 
            onClick={() => handleAnswer(true)}
            className="bg-green-50 hover:bg-green-100 text-green-600 border-2 border-green-200 hover:border-green-400 py-6 rounded-2xl text-2xl font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-4xl">✔️</span> 
            <span>是对的</span>
          </button>
          <button 
            onClick={() => handleAnswer(false)}
            className="bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 hover:border-red-400 py-6 rounded-2xl text-2xl font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-4xl">❌</span> 
            <span>是错的</span>
          </button>
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        isCorrect={lastResult.correct} 
        content={lastResult.text} 
        onClose={nextQuestion} 
      />
    </div>
  );
};

// M3: Graphics Identification
const Module3 = ({ onUpdateScore, onFinish }) => {
  const [scenario, setScenario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ correct: false, text: '' });
  const [round, setRound] = useState(1);
  const TOTAL_ROUNDS = 5;

  // Generate a random scenario
  const generateScenario = () => {
    const types = ['parallel', 'perp_std', 'perp_t', 'perp_rot', 'intersect_trap', 'curve'];
    const type = types[Math.floor(Math.random() * types.length)];
    return { type, id: Math.random() };
  };

  useEffect(() => {
    setScenario(generateScenario());
  }, []);

  const renderGraphic = (type) => {
    const size = 300;
    const stroke = 6; // Thicker lines for kids
    const color = "#374151"; // Gray-700
    
    const svgProps = { 
      width: "100%", 
      height: size, 
      viewBox: `0 0 ${size} ${size}`, 
      className: "w-full h-full" 
    };

    let content;
    switch (type) {
      case 'parallel':
        content = (
          <>
            <line x1="50" y1="100" x2="250" y2="100" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <line x1="50" y1="200" x2="250" y2="200" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <text x="150" y="100" dy="-15" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">a</text>
            <text x="150" y="200" dy="30" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">b</text>
          </>
        );
        break;
      case 'perp_std':
        content = (
          <>
            <line x1="150" y1="50" x2="150" y2="250" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <line x1="50" y1="150" x2="250" y2="150" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <path d="M150 125 L175 125 L175 150" fill="none" stroke="red" strokeWidth="3" />
          </>
        );
        break;
      case 'perp_t':
        content = (
          <>
             <line x1="50" y1="200" x2="250" y2="200" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
             <line x1="150" y1="200" x2="150" y2="50" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
             <path d="M150 175 L175 175 L175 200" fill="none" stroke="red" strokeWidth="3" />
          </>
        );
        break;
      case 'perp_rot':
        content = (
          <g transform="rotate(45, 150, 150)">
            <line x1="150" y1="50" x2="150" y2="250" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <line x1="50" y1="150" x2="250" y2="150" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <rect x="150" y="130" width="20" height="20" fill="none" stroke="red" strokeWidth="3" />
          </g>
        );
        break;
      case 'intersect_trap':
        content = (
          <>
             {/* "Eight" shape, not touching in view but converging */}
             <line x1="60" y1="60" x2="130" y2="240" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
             <line x1="240" y1="60" x2="170" y2="240" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
             <line x1="130" y1="240" x2="135" y2="253" stroke={color} strokeWidth={2} strokeDasharray="4" opacity="0.5"/>
             <line x1="170" y1="240" x2="165" y2="253" stroke={color} strokeWidth={2} strokeDasharray="4" opacity="0.5"/>
          </>
        );
        break;
      case 'curve':
        content = (
          <>
            <path d="M50 150 Q150 50 250 150" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            <path d="M50 200 Q150 100 250 200" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
          </>
        );
        break;
      default: return null;
    }

    return (
      <div className="bg-white rounded-3xl border-4 border-dashed border-green-200 p-4 mb-6 shadow-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
        <svg {...svgProps}>{content}</svg>
      </div>
    );
  };

  const handleChoice = (choice) => {
    const type = scenario.type;
    let isCorrect = false;
    let msg = "";

    if (choice === 'parallel') {
      if (type === 'parallel') {
        isCorrect = true;
        msg = "火眼金睛！这就是平行线。";
      } else if (type === 'curve') {
        msg = "错啦！平行线必须是“直线”，这是曲线哦。";
      } else {
        msg = "不对哦，它们会相交或者已经相交了。";
      }
    } else if (choice === 'perp') {
      if (type.startsWith('perp')) {
        isCorrect = true;
        msg = "太棒了！不管怎么旋转，只要相交成90度就是垂直。";
      } else {
        msg = "不对哦，夹角不是90度。";
      }
    } else if (choice === 'intersect') {
      if (type === 'intersect_trap') {
        isCorrect = true;
        msg = "厉害！虽然现在没碰到，但延长后肯定会撞在一起，所以是相交。";
      } else {
        msg = "再仔细看看？";
      }
    } else if (choice === 'neither') {
      if (type === 'curve') {
        isCorrect = true;
        msg = "正确！弯弯曲曲的线不谈平行垂直。";
      } else {
        msg = "它们是直线哦，肯定有关系。";
      }
    }

    if (isCorrect) {
      playSound('correct');
      onUpdateScore(20);
      setModalContent({ correct: true, text: msg });
    } else {
      playSound('wrong');
      setModalContent({ correct: false, text: msg });
    }
    setShowModal(true);
  };

  const nextRound = () => {
    setShowModal(false);
    if (round < TOTAL_ROUNDS) {
      setRound(r => r + 1);
      setScenario(generateScenario());
    } else {
      onFinish();
    }
  };

  if (!scenario) return <div className="p-10 text-center">准备中...</div>;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
       <div className="flex justify-between items-center mb-6">
        <span className="font-black text-green-600 text-xl">第 {round} / {TOTAL_ROUNDS} 题</span>
        <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">火眼金睛模式</span>
      </div>
      
      {renderGraphic(scenario.type)}

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleChoice('parallel')} className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-2 rounded-2xl font-bold text-lg shadow-md transition-transform active:scale-95 border-b-4 border-blue-700">
          互相平行 //
        </button>
        <button onClick={() => handleChoice('perp')} className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-2 rounded-2xl font-bold text-lg shadow-md transition-transform active:scale-95 border-b-4 border-orange-700">
          互相垂直 ⊥
        </button>
        <button onClick={() => handleChoice('intersect')} className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-2 rounded-2xl font-bold text-lg shadow-md transition-transform active:scale-95 border-b-4 border-purple-700">
          相交 (不垂直)
        </button>
        <button onClick={() => handleChoice('neither')} className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-2 rounded-2xl font-bold text-lg shadow-md transition-transform active:scale-95 border-b-4 border-gray-700">
          都不是 (有曲线)
        </button>
      </div>

      <Modal 
        isOpen={showModal} 
        isCorrect={modalContent.correct} 
        content={modalContent.text} 
        onClose={nextRound} 
      />
    </div>
  );
};

// M4: Intersection Calculator
const Module4 = ({ onFinish }) => {
  const [visualN, setVisualN] = useState(3);
  const [inputN, setInputN] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const num = parseInt(inputN);
    if (!num || num < 2) return;
    playSound('click');
    
    const total = (num * (num - 1)) / 2;
    let text = '';
    
    if (num === 5) text = "1+2+3+4 = 10";
    else if (num === 10) text = "1+2+...+9 = 45 (常考!)";
    else if (num === 15) text = "1+2+...+14 = 105 (压轴题!)";
    else text = `${num} × ${num-1} ÷ 2 = ${total}`;

    setResult({ total, text });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
      
      <div className="bg-white p-6 rounded-[2rem] shadow-xl mb-6 border-b-8 border-purple-100">
        <h3 className="text-2xl font-black text-purple-600 mb-4 hand-font">👁️ 可视化探索</h3>
        <p className="text-gray-500 mb-4 text-sm">拖动滑块，亲眼看看直线怎么交朋友！</p>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="font-bold text-gray-700 w-20">直线数: {visualN}</span>
          <input 
            type="range" 
            min="2" 
            max="12" 
            value={visualN} 
            onChange={(e) => setVisualN(parseInt(e.target.value))}
            className="flex-1 accent-purple-500 h-4 rounded-full cursor-pointer"
          />
        </div>

        <InteractiveGraph lineCount={visualN} />
        
        <div className="mt-6 bg-orange-50 p-5 rounded-xl border-2 border-orange-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-orange-200 text-orange-800 text-xs font-bold px-2 py-1 rounded-bl-lg">满分秘籍</div>
           <h4 className="font-black text-orange-600 mb-2 text-lg">🤔 怎样才能画出最多交点？</h4>
           <p className="text-gray-700 text-sm mb-2">想要得到 <span className="font-mono font-bold bg-orange-200 px-1 rounded">n×(n-1)÷2</span> 个交点，必须遵守两条铁律：</p>
           <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
             <li><strong className="text-gray-800">拒绝平行：</strong> 任何两条线都不能平行，否则会少交点。</li>
             <li><strong className="text-gray-800">拒绝共点：</strong> 不能有3条或更多的线穿过同一个点。</li>
           </ul>
           <div className="mt-2 text-xs text-gray-400 text-center">（上面的画板会自动帮你避开这两种情况哦！）</div>
        </div>

        <div className="mt-4 text-center bg-purple-50 p-3 rounded-xl text-purple-800 font-bold border border-purple-100">
          {visualN} 条直线最多有 {visualN * (visualN - 1) / 2} 个交点
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl mb-8 border-b-8 border-purple-100">
        <h3 className="text-2xl font-black text-purple-600 mb-6 text-center hand-font">🧮 大数计算器</h3>
        
        <div className="bg-purple-100 p-4 rounded-xl text-center mb-8 border border-purple-200">
          <p className="font-bold text-purple-800 text-lg">🚀 超级公式：交点数 = n × (n-1) ÷ 2</p>
        </div>

        <div className="space-y-4">
          <label className="block text-gray-700 font-bold text-lg">输入任意直线数量：</label>
          <div className="flex gap-3">
            <input 
              type="number" 
              value={inputN}
              onChange={(e) => setInputN(e.target.value)}
              className="flex-1 border-2 border-purple-300 rounded-xl px-4 py-4 text-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
              placeholder="比如 100..."
            />
            <button 
              onClick={calculate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 text-lg"
            >
              计算
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl animate-bounce-in relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-bl-lg">解析</div>
            <h4 className="text-gray-500 text-sm uppercase font-bold mb-2 tracking-wider">计算过程</h4>
            <p className="text-xl md:text-2xl font-mono text-gray-800 font-bold mb-4 break-words">{result.text}</p>
            <div className="h-px bg-yellow-200 my-4"></div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-600">最多交点数：</span>
              <span className="text-5xl font-black text-purple-600 drop-shadow-sm">{result.total}</span>
            </div>
          </div>
        )}
      </div>

      <button onClick={onFinish} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-2xl text-lg transition-colors">
        ⬅️ 返回主菜单
      </button>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [view, setView] = useState('menu');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState([0, 0, 0, 0]);

  const updateProgress = (modIndex, val) => {
    const newProg = [...progress];
    newProg[modIndex] = val;
    setProgress(newProg);
  };

  const handleModuleStart = (modId) => {
    initAudio(); // Initialize audio context on first interaction
    playSound('click');
    setView(`module${modId}`);
  };

  const renderModule = () => {
    switch(view) {
      case 'module1': return <Module1 onFinish={() => { updateProgress(0, 100); setView('menu'); playSound('win'); }} />;
      case 'module2': return <Module2 onUpdateScore={(p) => setScore(s => s + p)} onFinish={() => { updateProgress(1, 100); setView('menu'); }} />;
      case 'module3': return <Module3 onUpdateScore={(p) => setScore(s => s + p)} onFinish={() => { updateProgress(2, 100); setView('menu'); playSound('win'); }} />;
      case 'module4': return <Module4 onFinish={() => { updateProgress(3, 100); setView('menu'); }} />;
      default: return renderMenu();
    }
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      {MODULES.map((m, idx) => (
        <div 
          key={m.id}
          onClick={() => handleModuleStart(m.id)}
          className="bg-white rounded-[2rem] p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer border-b-8 border-gray-50 group relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.color.replace('bg-', 'from-')} to-white opacity-10 rounded-bl-full -mr-4 -mt-4`}></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className={`w-16 h-16 rounded-2xl ${m.color} flex items-center justify-center text-4xl text-white shadow-md group-hover:scale-110 transition-transform`}>
              {m.icon}
            </div>
            {progress[idx] === 100 && (
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 animate-pulse">
                <span>✅</span> 已通关
              </div>
            )}
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors hand-font">{m.title}</h3>
          <p className="text-gray-500 font-medium text-sm">{m.subtitle}</p>
          
          <div className="mt-6 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`${m.color} h-full rounded-full transition-all duration-1000 ease-out`} 
              style={{ width: `${progress[idx]}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen paper-bg pb-12 selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => { playSound('click'); setView('menu'); }}
          >
             <div className="bg-blue-500 text-white p-2 rounded-xl font-bold shadow-md group-hover:rotate-12 transition-transform">🏠</div>
             <h1 className="text-lg md:text-2xl font-black text-gray-800 hand-font">
               平行与垂直 <span className="text-orange-500 bg-orange-50 px-2 rounded-lg">特训营</span>
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-50 px-4 py-2 rounded-2xl flex items-center gap-2 border-2 border-yellow-200 shadow-sm">
              <span className="text-xl">⭐</span>
              <span className="font-black text-yellow-700 text-lg">{score}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderModule()}
      </main>
      
      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs md:text-sm mt-8 font-medium pb-8">
        <p>小学数学满分计划 · 快乐学习每一天 🌟</p>
      </footer>
    </div>
  );
};

// 导出 App 组件供路由使用
export { App };

// 独立运行时挂载到 DOM
import { createRoot } from 'react-dom/client';

if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.hasChildNodes()) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}