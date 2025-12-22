import React, { useState } from 'react';
import { BookOpen, CheckCircle, X } from 'lucide-react';

interface StageFourProps {
    onRestart: () => void;
}

export const StageFour: React.FC<StageFourProps> = ({ onRestart }) => {
  const [filledBlanks, setFilledBlanks] = useState<Record<string, boolean>>({});
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const blanks = [
    { id: 'b1', answer: '数据', options: ['数字', '数据', '图片'] },
    { id: 'b2', answer: '条形统计图', options: ['象形图', '折线图', '条形统计图'] },
    { id: 'b3', answer: '直条', options: ['圆圈', '直条', '曲线'] },
    { id: 'b4', answer: '越大', options: ['越大', '越小', '不变'] },
    { id: 'b5', answer: '越短', options: ['越长', '越短', '消失'] },
  ];

  const handleBlankClick = (id: string, option: string, correct: string) => {
    if (option === correct) {
      setFilledBlanks(prev => ({ ...prev, [id]: true }));
      setOpenDropdownId(null);
    } else {
        alert("不对哦，再想想！");
    }
  };

  const isAllFilled = blanks.every(b => filledBlanks[b.id]);

  const NodeButton = ({ title, contentKey }: { title: string, contentKey: string }) => (
    <button 
        onClick={() => {
            setActivePopup(contentKey);
            setOpenDropdownId(null);
        }}
        className="w-full max-w-[180px] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors z-10 text-center leading-tight"
    >
        {title}
    </button>
  );

  const BlankSlot = ({ id, answer, options }: { id: string, answer: string, options: string[] }) => {
      const isFilled = filledBlanks[id];
      const isOpen = openDropdownId === id;

      if (isFilled) return <span className="text-blue-600 font-bold border-b-2 border-blue-500 px-2 mx-1 inline-block">{answer}</span>;
      
      return (
          <div className="inline-block relative align-middle">
              <span 
                  onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(isOpen ? null : id);
                  }}
                  className={`text-red-500 border-b-2 border-dashed border-red-400 cursor-pointer px-3 py-1 bg-red-50 hover:bg-red-100 mx-1 font-bold rounded transition-colors ${isOpen ? 'bg-red-100' : ''}`}
              >
                  ???
              </span>
              {isOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-2 rounded-xl shadow-2xl border border-gray-100 z-[100] min-w-[140px] flex flex-col gap-1">
                      {options.map(opt => (
                          <button 
                            key={opt} 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBlankClick(id, opt, answer);
                            }}
                            className="w-full p-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 cursor-pointer rounded-lg text-sm font-bold text-center transition-colors"
                          >
                              {opt}
                          </button>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  const contents: Record<string, React.ReactNode> = {
      recognize: (
          <div className="text-lg md:text-xl leading-loose text-gray-700">
              <div className="mb-6 flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</span>
                  <p>根据 <BlankSlot id="b1" answer="数据" options={blanks[0].options} /> 的多少画出长短不同的 <BlankSlot id="b3" answer="直条" options={blanks[2].options} />。</p>
              </div>
              <div className="flex items-start gap-3">
                   <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</span>
                   <p>这种图叫做 <BlankSlot id="b2" answer="条形统计图" options={blanks[1].options} />。</p>
              </div>
          </div>
      ),
      method: (
          <div className="text-lg md:text-xl leading-loose text-gray-700 space-y-4">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 1. 确定横轴和纵轴。</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 2. 确定1格代表几个单位。</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 3. 涂色，标数。</p>
          </div>
      ),
      features: (
          <div className="text-lg md:text-xl leading-loose text-gray-700 space-y-4">
              <p>能清楚、直观地看出各种数据的大小。</p>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="mb-2">直条越长，数据 <BlankSlot id="b4" answer="越大" options={blanks[3].options} />。</p>
                  <p>直条 <BlankSlot id="b5" answer="越短" options={blanks[4].options} />，数据越小。</p>
              </div>
          </div>
      )
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 relative" onClick={() => setOpenDropdownId(null)}>
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-yellow-400 mb-8">
            <h2 className="text-2xl font-bold text-yellow-600 mb-2 flex items-center gap-2">
                <BookOpen className="w-6 h-6"/> 终极笔记本
            </h2>
            <p className="text-gray-600">点击下方的蓝色按钮，在弹出的卡片中完成笔记！</p>
        </div>

        {/* Mind Map Layout */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-20 relative w-full max-w-4xl mx-auto">
            
            {/* Root Node */}
            <div className="relative z-10 mb-[-2px]">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-5 rounded-full text-2xl font-bold shadow-xl border-4 border-white ring-4 ring-blue-100 cursor-default">
                    条形统计图
                </div>
            </div>

            {/* Connecting Lines (SVG) */}
            <div className="w-full h-24 relative overflow-visible pointer-events-none">
                 <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Path to Left (Sigmoid Curve) */}
                    <path d="M 50 0 C 50 50, 16.5 50, 16.5 100" stroke="#94a3b8" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
                    {/* Path to Center (Straight Line) */}
                    <path d="M 50 0 L 50 100" stroke="#94a3b8" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
                    {/* Path to Right (Sigmoid Curve) */}
                    <path d="M 50 0 C 50 50, 83.5 50, 83.5 100" stroke="#94a3b8" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
                 </svg>
            </div>

            {/* Child Nodes Row */}
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex justify-center">
                    <NodeButton title="认识条形统计图" contentKey="recognize" />
                </div>
                <div className="flex justify-center">
                    <NodeButton title="制作方法" contentKey="method" />
                </div>
                <div className="flex justify-center">
                    <NodeButton title="特点" contentKey="features" />
                </div>
            </div>
        </div>

        {/* Modal Overlay for Active Content */}
        {activePopup && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActivePopup(null)}>
                <div 
                    className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border-4 border-blue-100" 
                    onClick={e => {
                        e.stopPropagation();
                        setOpenDropdownId(null);
                    }}
                >
                    <button 
                        onClick={() => setActivePopup(null)}
                        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center border-b pb-4">
                        {activePopup === 'recognize' && '认识条形统计图'}
                        {activePopup === 'method' && '制作方法'}
                        {activePopup === 'features' && '特点'}
                    </h3>
                    
                    <div className="min-h-[200px] flex flex-col justify-center">
                        {contents[activePopup]}
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        (点击空白处关闭)
                    </div>
                </div>
            </div>
        )}

        {isAllFilled && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-md">
                <div className="bg-white p-10 rounded-3xl text-center max-w-md mx-4 border-8 border-green-200 shadow-2xl">
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">挑战成功！</h2>
                    <p className="text-xl text-gray-600 mb-8">你已经成为了<br/>“条形统计图大师”！</p>
                    <button 
                        onClick={onRestart}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transition-transform hover:scale-105"
                    >
                        再玩一次
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};