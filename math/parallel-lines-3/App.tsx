import React, { useState } from 'react';
import { ChevronRight, MessageCircle, Volume2, Star, BookOpen, Menu } from 'lucide-react';
import { FeatureInspector, PropertyExplorer, InstabilityDemo } from './components/Step1_Basics';
import { HeightLauncher, HeightDrawing, UniqueHeight } from './components/Step2_Height';
import { PerimeterCalculator, ShapeCounter, GardenPath } from './components/Step3_Advanced';
import { askTeacher } from './services/geminiService';
import { LearningModule } from './types';

// Define the curriculum structure with Chinese Titles
const MODULES: Record<string, LearningModule[]> = {
  basics: [
    { id: '1.1', title: '特征侦探', description: '定义与识别', component: FeatureInspector },
    { id: '1.2', title: '性质总结', description: '尺子与量角器', component: PropertyExplorer },
    { id: '1.3', title: '不稳定性', description: '我是变形金刚', component: InstabilityDemo },
  ],
  height: [
    { id: '2.1', title: '概念区分', description: '高线发射器', component: HeightLauncher },
    { id: '2.2', title: '画高方法', description: '高线的秘密', component: HeightDrawing },
    { id: '2.3', title: '数量关系', description: '高只能有一条', component: UniqueHeight },
  ],
  advanced: [
    { id: '3.1', title: '周长计算', description: '测量周长', component: PerimeterCalculator },
    { id: '3.2', title: '组合图形', description: '火眼金睛', component: ShapeCounter },
    { id: '3.3', title: '优化分割', description: '最短小路', component: GardenPath },
  ]
};

const STEP_NAMES: Record<string, string> = {
  basics: "第一步：基础认知",
  height: "第二步：深入理解底和高",
  advanced: "第三步：综合运用"
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'basics' | 'height' | 'advanced'>('basics');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // AI Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "你好！我是Poly教授！关于平行四边形，有什么想问我的吗？" }
  ]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeModules = MODULES[currentStep];
  const CurrentComponent = activeModules[activeModuleIndex].component;
  const currentModuleData = activeModules[activeModuleIndex];

  const handleSendMessage = async () => {
    if (!userQuestion.trim()) return;
    
    const question = userQuestion;
    setUserQuestion("");
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);
    setIsLoading(true);

    // Context for AI
    const context = `当前学习内容: ${STEP_NAMES[currentStep]} - ${currentModuleData.title} (${currentModuleData.description}). 学生正在进行四年级数学互动学习。`;
    const answer = await askTeacher(context, question);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    setIsLoading(false);
  };

  const nextModule = () => {
    if (activeModuleIndex < activeModules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
    } else {
      // Logic to jump to next step
      if (currentStep === 'basics') { setCurrentStep('height'); setActiveModuleIndex(0); }
      else if (currentStep === 'height') { setCurrentStep('advanced'); setActiveModuleIndex(0); }
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">平行四边形伙伴</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu /></button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-slate-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-20 flex flex-col`}>
        <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
          <div className="flex items-center gap-2 mb-1">
             <Star className="fill-yellow-400 text-yellow-400" size={24}/>
             <h1 className="text-xl font-bold tracking-tight">平行四边形伙伴</h1>
          </div>
          <p className="text-indigo-100 text-xs opacity-80">四年级数学大冒险</p>
        </div>
        
        <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
          {(Object.keys(MODULES) as Array<keyof typeof MODULES>).map((step) => (
            <div key={step}>
              <button 
                onClick={() => { setCurrentStep(step); setActiveModuleIndex(0); setSidebarOpen(false); }}
                className={`uppercase text-xs font-bold tracking-wider mb-3 block ${currentStep === step ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                {STEP_NAMES[step]}
              </button>
              <div className="space-y-1">
                {MODULES[step].map((mod, idx) => (
                  <button
                    key={mod.id}
                    onClick={() => { setCurrentStep(step); setActiveModuleIndex(idx); setSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all flex items-center justify-between ${
                      currentStep === step && activeModuleIndex === idx 
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm translate-x-1' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{mod.id} {mod.title}</span>
                    {currentStep === step && activeModuleIndex === idx && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-slate-50 border-t text-xs text-center text-slate-400">
           © 2024 Math Adventure
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-sm">{currentModuleData.id}</span>
              {currentModuleData.title}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{currentModuleData.description}</p>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 min-h-[500px] flex flex-col">
             <CurrentComponent />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              disabled={activeModuleIndex === 0 && currentStep === 'basics'}
              onClick={() => setActiveModuleIndex(Math.max(0, activeModuleIndex - 1))}
              className="px-6 py-2 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30 font-medium transition-colors"
            >
              上一步
            </button>
            
            {/* Progress Dots */}
            <div className="flex gap-2">
              {activeModules.map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === activeModuleIndex ? 'bg-indigo-600 w-6' : 'bg-slate-300'}`} />
              ))}
            </div>

            <button 
               disabled={activeModuleIndex === activeModules.length - 1 && currentStep === 'advanced'}
               onClick={nextModule}
               className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all font-bold"
            >
              下一步 <ChevronRight size={18} />
            </button>
        </div>
      </main>

      {/* AI Chat Overlay */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border-4 border-yellow-300 flex flex-col overflow-hidden z-50 h-[500px] animate-fade-in-up">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-yellow-50">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-yellow-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-yellow-200 text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-white border-t border-yellow-100 flex gap-2">
            <input 
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="不懂就问..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 shadow-md transition-transform active:scale-95">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
