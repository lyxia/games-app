import React, { useState } from 'react';
import { Search, CheckCircle2, ArrowRight, Hand } from 'lucide-react';

interface StageTutorialProps {
  onComplete: () => void;
}

type Step = 'FIND_SUBJECT' | 'JUDGE_IDENTITY' | 'CHOOSE_VERB' | 'COMPLETE';

const StageTutorial: React.FC<StageTutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('FIND_SUBJECT');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Data
  const subjectText = "My mother";
  const restOfSentence = "______ (cook) dinner.";
  const correctVerb = "cooks";
  const wrongVerb = "cook";

  const handleSubjectClick = () => {
    if (step === 'FIND_SUBJECT') {
      setFeedback("太棒了！'My mother' 就是主语！");
      setTimeout(() => {
        setStep('JUDGE_IDENTITY');
        setFeedback(null);
      }, 1000);
    }
  };

  const handleIdentityCheck = (isSingular: boolean) => {
    if (isSingular) {
      setFeedback("正确！妈妈是一个人，是三单！");
      setTimeout(() => {
        setStep('CHOOSE_VERB');
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback("再想想？妈妈是一个人，不是很多人哦。");
    }
  };

  const handleVerbSelection = (verb: string) => {
    if (verb === correctVerb) {
      setStep('COMPLETE');
    } else {
        setFeedback("哎呀！既然是三单，动词要变身（加s）才行！");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="bg-white shadow-2xl rounded-3xl max-w-3xl w-full p-6 md:p-10 border-4 border-detective-highlight min-h-[500px] flex flex-col relative overflow-hidden">
        
        {/* Decorative Badge */}
        <div className="absolute -top-4 -right-4 bg-yellow-300 text-yellow-800 font-bold px-6 py-2 rotate-12 shadow-md z-10 rounded-full">
            新兵训练营
        </div>

        {/* Header Progress */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b-2 border-dashed border-gray-200 pb-4">
          <h2 className="text-2xl font-fun font-bold text-detective-brown flex items-center gap-2">
            <Search className="w-7 h-7 text-detective-highlight" /> 案件演练
          </h2>
          <div className="flex gap-3 text-sm font-bold text-gray-400 mt-2 md:mt-0 bg-gray-50 p-2 rounded-full">
            <span className={`px-3 py-1 rounded-full ${step === 'FIND_SUBJECT' ? 'bg-detective-highlight text-white' : 'text-green-600'}`}>1. 找主语</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={`px-3 py-1 rounded-full ${step === 'JUDGE_IDENTITY' ? 'bg-detective-highlight text-white' : (step === 'CHOOSE_VERB' || step === 'COMPLETE') ? 'text-green-600' : ''}`}>2. 判三单</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={`px-3 py-1 rounded-full ${step === 'CHOOSE_VERB' ? 'bg-detective-highlight text-white' : step === 'COMPLETE' ? 'text-green-600' : ''}`}>3. 定动词</span>
          </div>
        </div>

        {/* Main Sentence Display Area */}
        <div className="flex-grow flex flex-col items-center justify-center mb-8">
            <div className="text-3xl md:text-5xl font-bold text-center text-gray-700">
                <span 
                    onClick={handleSubjectClick}
                    className={`
                        px-3 py-1 rounded-xl transition-all duration-300 cursor-pointer border-b-4 inline-block
                        ${step === 'FIND_SUBJECT' ? 'bg-yellow-100 hover:bg-yellow-200 border-yellow-400 animate-pulse shadow-lg scale-105' : ''}
                        ${step !== 'FIND_SUBJECT' ? 'bg-green-100 border-green-500 text-green-700' : 'border-transparent'}
                    `}
                >
                    {subjectText}
                </span>
                <span className="ml-3">
                    {step === 'COMPLETE' ? <span className="text-detective-accent font-bold underline">{correctVerb}</span> : restOfSentence}
                </span>
            </div>
            
            {/* Step 1 Instruction */}
            {step === 'FIND_SUBJECT' && (
                <div className="mt-10 bg-blue-100 text-blue-800 px-6 py-3 rounded-full flex items-center gap-3 animate-bounce text-lg font-bold shadow-sm">
                    <Hand size={24} />
                    请点击句子中的 <span className="text-red-500">主语</span>
                </div>
            )}
        </div>

        {/* Interaction Area */}
        <div className="h-36 flex items-center justify-center w-full">
            
            {/* Step 2: Judge Identity */}
            {step === 'JUDGE_IDENTITY' && (
                 <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200 w-full max-w-lg text-center animate-pop shadow-lg">
                    <h3 className="font-bold text-xl mb-4 text-detective-brown">"{subjectText}" 是三单（单人）吗？</h3>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => handleIdentityCheck(true)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105 text-lg"
                        >
                            YES (是) ✅
                        </button>
                        <button 
                            onClick={() => handleIdentityCheck(false)}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105 text-lg"
                        >
                            NO (否) ❌
                        </button>
                    </div>
                 </div>
            )}

            {/* Step 3: Choose Verb */}
            {step === 'CHOOSE_VERB' && (
                 <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 w-full max-w-lg text-center animate-pop shadow-lg">
                    <h3 className="font-bold text-xl mb-4 text-detective-brown">是三单，动词选哪个？</h3>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => handleVerbSelection(wrongVerb)}
                            className="flex-1 bg-white border-b-4 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-sm transition text-xl"
                        >
                            {wrongVerb}
                        </button>
                        <button 
                            onClick={() => handleVerbSelection(correctVerb)}
                            className="flex-1 bg-detective-accent border-b-4 border-orange-700 text-white hover:bg-orange-600 font-bold py-3 px-6 rounded-xl shadow-md transition text-xl"
                        >
                            {correctVerb}
                        </button>
                    </div>
                 </div>
            )}

            {/* Complete */}
            {step === 'COMPLETE' && (
                <div className="text-center animate-pop">
                     <div className="text-green-600 font-bold text-2xl mb-2 flex items-center justify-center gap-2">
                        <CheckCircle2 size={32} /> 破案成功！
                     </div>
                     <p className="text-gray-600 mb-6 text-lg">妈妈是单人，所以动词要加 S！</p>
                     <button 
                        onClick={onComplete}
                        className="bg-detective-brown hover:bg-brown-700 text-white font-bold py-3 px-10 rounded-full shadow-lg flex items-center gap-2 mx-auto text-lg transform hover:scale-105 transition"
                     >
                        开始实战抓捕 <ArrowRight size={20} />
                     </button>
                </div>
            )}

            {/* Feedback Toast */}
            {feedback && step !== 'COMPLETE' && (
                <div className="absolute bottom-4 bg-detective-error text-white px-6 py-3 rounded-xl shadow-xl animate-bounce font-bold text-lg">
                    {feedback}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default StageTutorial;