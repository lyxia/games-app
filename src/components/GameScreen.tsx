import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Volume2, CheckCircle, XCircle, ArrowRight, RefreshCw, Star, Download, Lightbulb } from 'lucide-react';

export interface PhonicsPart {
  part: string;
  type: 'vowel' | 'consonant' | 'silent' | 'pattern';
}

export interface LessonItem {
  id: string;
  word: string;
  phonics: string; // IPA
  phonicsBreakdown: PhonicsPart[]; // For natural phonics coloring
  definition: string; // Chinese definition
  phrase: string;
  phraseTranslation: string;
  phraseMissingWord: string; // The phrase with the target word replaced by underscores
  sentence: string;
  sentenceTranslation: string;
  scrambledSentence: string[]; // Array of words
  sentenceHint?: string; // Hint sentence for writing imitation stage
}

export interface LessonPlan {
  title: string;
  items: LessonItem[];
}

interface GameScreenProps {
  lesson: LessonPlan;
  onExit?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ lesson, onExit }) => {
  // Flatten the lesson into a sequence of steps
  // Each item has 4 steps: Phonics, Phrase, Sentence, Writing
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  
  // Current Item Logic
  const currentItemIndex = Math.floor(currentStepIndex / 4);
  const stepInItem = currentStepIndex % 4; // 0, 1, 2, 3
  const currentItem = lesson.items[currentItemIndex];
  
  const isFinished = currentStepIndex >= lesson.items.length * 4;

  // Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState('');
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [checkResult, setCheckResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCheckingAI, setIsCheckingAI] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const resetStepState = useCallback(() => {
    setSelectedOption(null);
    setInputAnswer('');
    setCheckResult('idle');
    setFeedbackMessage('');
    setSentenceWords([]);
    setShowHint(false);
  }, [stepInItem]);

  // Initialize step specific state
  useEffect(() => {
    if (isFinished) return;
    resetStepState();
  }, [currentStepIndex, isFinished, resetStepState]);

  // 获取女声的辅助函数
  const getFemaleVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // 优先选择英文女声
    const femaleVoice = voices.find(voice => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      return lang.startsWith('en') && (
        name.includes('female') || 
        name.includes('woman') || 
        name.includes('samantha') || 
        name.includes('karen') || 
        name.includes('victoria') ||
        name.includes('susan') ||
        name.includes('zira') ||
        name.includes('tessa')
      );
    });
    return femaleVoice || null;
  }, []);

  useEffect(() => {
    // 确保语音列表已加载
    if (window.speechSynthesis && window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        // 语音列表已加载
      });
    }

    return () => {
      // 清理时停止所有语音播放
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playAudio = useCallback((text: string) => {
    if (!text) return;

    // 停止当前正在播放的语音
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // 使用浏览器自带的语音合成
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.3; // 更慢的语速，适合小学1年级学生听清楚
    utterance.pitch = 1.0; // 正常音调，保持清晰度
    utterance.volume = 1; // 最大音量

    // 尝试选择女声
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [getFemaleVoice]);

  const downloadLesson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lesson, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `lingoflow_lesson_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCheck = async () => {
    if (checkResult !== 'idle') {
      // Move to next
      setCurrentStepIndex(prev => prev + 1);
      return;
    }

    let isCorrect = false;
    let msg = '';

    // LOGIC PER STEP
    if (stepInItem === 0) {
      // Phonics/Word - Simple acknowledge for this demo
      isCorrect = true; 
      msg = "发音很棒！继续加油！";
    } 
    else if (stepInItem === 1) {
      // Phrase Fill in blank
      if (selectedOption === currentItem.word) {
        isCorrect = true;
        msg = "搭配正确！";
      } else {
        isCorrect = false;
        msg = `正确答案是: ${currentItem.word}`;
      }
    }
    else if (stepInItem === 2) {
      // Sentence Unscramble
      const builtSentence = sentenceWords.join(' ');
      // Simple check: strip punctuation for leniency
      const normalize = (s: string) => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().trim();
      
      if (normalize(builtSentence) === normalize(currentItem.sentence)) {
        isCorrect = true;
        msg = "句子结构完美！";
      } else {
        isCorrect = false;
        msg = "不太对哦，请参考下方的正确顺序。";
      }
    }
    else if (stepInItem === 3) {
      // Writing Imitation - AI Check
      if (inputAnswer.length < 5) {
        setCheckResult('incorrect');
        setFeedbackMessage("请写一个完整的句子。");
        return;
      }
      isCorrect = true;
    }

    if (isCorrect) {
      setCheckResult('correct');
      setCorrectCount(p => p + 1);
      setFeedbackMessage(msg);
      // Play success sound logic here (optional)
    } else {
      setCheckResult('incorrect');
      setHearts(h => Math.max(0, h - 1));
      setFeedbackMessage(msg);
      // Play error sound logic here (optional)
    }
  };

  // RENDER HELPERS
  const renderProgressBar = () => {
    const totalSteps = lesson.items.length * 4;
    const progress = ((currentStepIndex) / totalSteps) * 100;
    return (
      <div className="w-full h-4 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  const renderFooter = () => {
    const isError = checkResult === 'incorrect';
    const isSuccess = checkResult === 'correct';
    
    if (checkResult === 'idle') {
      return (
        <div className="fixed bottom-0 left-0 w-full p-4 border-t bg-white safe-area-bottom z-20">
           <div className="max-w-xl mx-auto">
            <button 
              onClick={handleCheck}
              disabled={isCheckingAI || (stepInItem === 2 && sentenceWords.length === 0) || (stepInItem === 1 && !selectedOption) || (stepInItem === 3 && !inputAnswer)}
              className="w-full py-4 rounded-xl bg-green-500 text-white font-extrabold text-lg shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:bg-green-400 active:shadow-none active:translate-y-1 transition-all disabled:bg-gray-300 disabled:shadow-none disabled:text-gray-500"
            >
              {isCheckingAI ? 'AI 批改中...' : '检查'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`fixed bottom-0 left-0 w-full p-4 border-t animate-slide-up safe-area-bottom z-20 ${isSuccess ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
             {isSuccess ? <CheckCircle className="text-green-600 w-8 h-8 flex-shrink-0" /> : <XCircle className="text-red-600 w-8 h-8 flex-shrink-0" />}
             <div>
               <h3 className={`font-bold text-xl ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                 {isSuccess ? '太棒了！' : '正确答案：'}
               </h3>
               <p className={`${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                 {isError && stepInItem === 2 ? currentItem.sentence : feedbackMessage}
                 {isSuccess && feedbackMessage}
               </p>
             </div>
          </div>
          <button 
            onClick={() => {
              if (isError) {
                resetStepState();
                return;
              }
              
              if (hearts === 0 && isError) {
                 // Game Over state logic could go here, for now just continue
              }
              setCurrentStepIndex(prev => prev + 1);
            }}
            className={`w-full py-3 rounded-xl font-extrabold text-lg shadow-sm active:translate-y-1 transition-all ${
              isSuccess 
                ? 'bg-green-500 text-white shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:bg-green-400' 
                : 'bg-red-500 text-white shadow-[0_4px_0_0_rgba(220,38,38,1)] hover:bg-red-400'
            }`}
          >
            {isSuccess ? '继续' : '再来一次'}
          </button>
        </div>
      </div>
    );
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Star className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">课程完成！</h2>
        <p className="text-xl text-gray-600 mb-8">
          你掌握了 {correctCount} / {lesson.items.length * 4} 个知识点。
        </p>
        <div className="space-y-4 w-full max-w-sm">
          <button 
            onClick={downloadLesson}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-[0_4px_0_0_rgba(59,130,246,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            <Download className="w-6 h-6" />
            导出课程数据 (JSON)
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW STEPS ---

  // 1. Phonics / Introduction
  const renderStep0 = () => {
    // Helper for phonics coloring
    const getPartColor = (type: string) => {
      switch (type) {
        case 'vowel': return 'text-red-500';
        case 'consonant': return 'text-gray-800';
        case 'silent': return 'text-gray-300';
        case 'pattern': return 'text-blue-600';
        default: return 'text-gray-800';
      }
    };

    return (
      <div className="flex flex-col items-center text-center mt-10 animate-fade-in">
        <h2 className="text-gray-500 font-bold mb-4 uppercase tracking-widest">自然拼读 & 新词</h2>
        
        <div className="p-8 border-2 border-gray-200 rounded-3xl w-full max-w-sm mb-8 shadow-sm bg-white">
          <div className="text-5xl font-extrabold mb-4 flex justify-center flex-wrap gap-1">
            {currentItem.phonicsBreakdown && currentItem.phonicsBreakdown.length > 0 ? (
              currentItem.phonicsBreakdown.map((p: PhonicsPart, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => playAudio(p.part)}
                  className={`${getPartColor(p.type)} px-1 border-b-4 border-dashed border-gray-300 hover:border-blue-400 transition-colors`}
                >
                  {p.part}
                </button>
              ))
            ) : (
              <span className="text-gray-800">{currentItem.word}</span>
            )}
          </div>
          
          <p className="text-gray-400 font-mono text-xl mb-6">/{currentItem.phonics}/</p>
          
          <button 
            onClick={() => playAudio(currentItem.word)}
            className="p-4 bg-blue-100 text-blue-500 rounded-2xl hover:bg-blue-200 transition-colors"
          >
            <Volume2 className="w-8 h-8" />
          </button>
        </div>
        
        <div className="max-w-sm bg-gray-50 p-6 rounded-2xl w-full border border-gray-100">
          <h3 className="font-bold text-xl mb-2 text-gray-700">中文释义</h3>
          <p className="text-gray-800 text-2xl font-bold mb-4">{currentItem.definition}</p>
          
          <div className="flex justify-center gap-4 text-sm mt-4">
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> 元音</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800"></span> 辅音</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300"></span> 不发音</div>
          </div>
        </div>
      </div>
    );
  };

  // 固定补全短语选项的顺序，避免每次渲染重新打乱
  const phraseOptions = useMemo(() => {
    return [currentItem.word, 'is', 'the', 'at'].sort(() => 0.5 - Math.random());
  }, [currentItem.word]);

  // 2. Phrase Match / Fill blank
  const renderStep1 = () => {
    return (
      <div className="mt-6 animate-fade-in max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">补全短语</h2>
        
        <div className="bg-white border-2 border-gray-200 p-6 rounded-2xl mb-8 flex items-center gap-4 shadow-sm">
           <button onClick={() => playAudio(currentItem.phrase)} className="text-blue-500 flex-shrink-0">
             <Volume2 className="w-6 h-6" />
           </button>
           <div className="flex-1">
             <p className="text-xl font-medium text-gray-800 leading-relaxed">
               {currentItem.phraseMissingWord.split('_____').map((part, i) => (
                  <span key={i}>
                    {part}
                    {i === 0 && (
                       <span className="inline-block min-w-[80px] border-b-2 border-gray-300 mx-1 text-center text-blue-600 font-bold">
                         {selectedOption || '_____'}
                       </span>
                    )}
                  </span>
               ))}
             </p>
             <p className="text-gray-500 text-sm mt-2">{currentItem.phraseTranslation}</p>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {phraseOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                playAudio(opt);
                setSelectedOption(opt);
              }}
              className={`p-4 rounded-xl border-2 border-b-4 font-bold text-lg transition-all ${
                selectedOption === opt 
                ? 'border-blue-500 bg-blue-50 text-blue-600' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 3. Sentence Unscramble
  const renderStep2 = () => {
    // Helper to toggle word between bank and sentence
    const toggleWord = (word: string, index: number, fromBank: boolean) => {
      // 每次点击都播放单词音频
      playAudio(word);
      
      if (fromBank) {
        setSentenceWords([...sentenceWords, word]);
      } else {
        setSentenceWords(sentenceWords.filter((_, i) => i !== index));
      }
    };

    return (
      <div className="mt-6 animate-fade-in max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">连词成句</h2>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => playAudio(currentItem.sentence)}
              className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
              aria-label="播放英文句子"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <p className="text-gray-500 text-lg">{currentItem.sentenceTranslation}</p>
          </div>
          <button
            onClick={() => setSentenceWords([])}
            disabled={sentenceWords.length === 0}
            className="text-sm font-bold text-red-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            重置
          </button>
        </div>

        {/* Construction Area */}
        <div className="min-h-[80px] border-b-2 border-gray-200 mb-8 flex flex-wrap gap-2 py-2">
           {sentenceWords.map((word, idx) => (
             <button
               key={`sent-${idx}`}
               onClick={() => toggleWord(word, idx, false)}
               className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-800 font-bold"
             >
               {word}
             </button>
           ))}
        </div>

        {/* Word Bank */}
        <div className="flex flex-wrap justify-center gap-3">
          {currentItem.scrambledSentence.map((word, idx) => {
             const countInSent = sentenceWords.filter(w => w === word).length;
             const countInBank = currentItem.scrambledSentence.filter(w => w === word).length;
             const isExhausted = countInSent >= countInBank;

             if (isExhausted) return <div key={idx} className="w-[80px] h-[40px] bg-gray-100 rounded-xl" />;

             return (
               <button
                 key={`bank-${idx}`}
                 onClick={() => toggleWord(word, -1, true)}
                 className="px-4 py-3 bg-white border-2 border-gray-200 border-b-4 rounded-xl text-gray-700 font-bold active:border-b-2 active:translate-y-[2px] transition-all"
               >
                 {word}
               </button>
             );
          })}
        </div>
      </div>
    );
  };

  // 4. Writing Imitation
  const renderStep3 = () => (
    <div className="mt-6 animate-fade-in max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">仿写造句</h2>
      
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-orange-800 uppercase">目标短语</p>
          <button
            onClick={() => playAudio(currentItem.phrase)}
            className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
            aria-label="播放短语"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xl font-extrabold text-orange-900">{currentItem.phrase}</p>
        <p className="text-sm text-orange-700 mt-1">{currentItem.phraseTranslation}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm">参考例句:</p>
          {currentItem.sentenceHint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors text-sm font-medium"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? '隐藏提示' : '显示提示'}
            </button>
          )}
        </div>
        <div className="flex items-start gap-2">
          <button
            onClick={() => playAudio(currentItem.sentence)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0 mt-1"
            aria-label="播放例句"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className="text-gray-700 italic border-l-4 border-gray-300 pl-3">"{currentItem.sentence}"</p>
            <p className="text-gray-400 text-xs ml-3 mt-1">{currentItem.sentenceTranslation}</p>
          </div>
        </div>
        
        {showHint && currentItem.sentenceHint && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                造句提示:
              </p>
              <button
                onClick={() => playAudio(currentItem.sentenceHint!)}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                aria-label="播放提示例句"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-blue-900 font-medium italic">"{currentItem.sentenceHint}"</p>
          </div>
        )}
      </div>

      <label className="block text-lg font-bold text-gray-700 mb-2">
        请使用短语 "{currentItem.phrase}" 模仿例句写一个新句子:
      </label>
      <textarea
        value={inputAnswer}
        onChange={(e) => setInputAnswer(e.target.value)}
        className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 text-lg resize-none"
        placeholder="在此输入你的句子..."
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b flex items-center justify-between max-w-2xl mx-auto w-full">
         <button
           onClick={onExit}
           disabled={!onExit}
           className={`text-gray-400 hover:text-gray-600 transition-colors ${onExit ? '' : 'opacity-30 cursor-not-allowed'}`}
         >
           <XCircle className="w-6 h-6" />
         </button>
         <div className="flex-1 px-4">
           {renderProgressBar()}
         </div>
         <div className="flex items-center gap-3">
           <button 
             onClick={downloadLesson}
             className="text-gray-400 hover:text-green-600 transition-colors p-1"
             title="导出课程 JSON"
           >
              <Download className="w-6 h-6" />
           </button>
           <div className="flex items-center text-red-500 font-bold">
             <span className="mr-1 text-xl">♥</span> {hearts}
           </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 max-w-2xl mx-auto">
        {stepInItem === 0 && renderStep0()}
        {stepInItem === 1 && renderStep1()}
        {stepInItem === 2 && renderStep2()}
        {stepInItem === 3 && renderStep3()}
      </div>

      {/* Footer controls */}
      {renderFooter()}
    </div>
  );
};

export default GameScreen;