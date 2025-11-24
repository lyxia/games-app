import React, { useState } from 'react';
import { PRACTICE_QUESTIONS } from '../constants';
import { Footprints, ArrowRight, Check, X, AlertTriangle } from 'lucide-react';

interface StagePracticeProps {
  onComplete: (score: number) => void;
}

const StagePractice: React.FC<StagePracticeProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const currentQ = PRACTICE_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === PRACTICE_QUESTIONS.length - 1;

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent double click

    const correct = option === currentQ.correctAnswer;
    setSelectedOption(option);
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onComplete(score + (isCorrect ? 0 : 0)); // Score already updated
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full overflow-hidden flex flex-col relative border-4 border-gray-100">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-4">
            <div 
                className="bg-detective-success h-4 transition-all duration-500 ease-out rounded-r-full"
                style={{ width: `${((currentIndex + 1) / PRACTICE_QUESTIONS.length) * 100}%` }}
            ></div>
        </div>

        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-400 flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">案件 #{currentQ.id}</span>
                </h3>
                <div className="flex items-center gap-2 text-detective-brown font-bold bg-yellow-100 px-3 py-1 rounded-full">
                    <Footprints size={20} />
                    <span>{currentIndex + 1} / {PRACTICE_QUESTIONS.length}</span>
                </div>
            </div>

            {/* Question */}
            <div className="text-center mb-10 min-h-[120px] flex items-center justify-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed">
                   <span className="text-detective-highlight border-b-4 border-detective-highlight px-1">{currentQ.subject}</span>
                   <span className="mx-2">{currentQ.sentence_part_1}</span> 
                   <span className={`inline-block min-w-[100px] border-b-4 mx-2 px-2 transition-colors ${selectedOption ? (isCorrect ? 'text-green-600 border-green-600' : 'text-red-500 border-red-500') : 'border-gray-300 text-gray-300'}`}>
                        {selectedOption || "?"}
                   </span>
                   <span className="mx-2">{currentQ.sentence_part_2}</span>
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {currentQ.options.map((option) => {
                    let btnClass = "py-4 text-2xl font-bold rounded-xl border-b-4 transition-all transform hover:-translate-y-1 active:scale-95";
                    
                    if (selectedOption === null) {
                        btnClass += " bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-800";
                    } else if (option === currentQ.correctAnswer) {
                        btnClass += " bg-green-100 border-green-500 text-green-700";
                    } else if (selectedOption === option && !isCorrect) {
                        btnClass += " bg-red-100 border-red-500 text-red-700";
                    } else {
                        btnClass += " bg-gray-50 border-gray-200 text-gray-300 opacity-50 scale-95";
                    }

                    return (
                        <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            disabled={selectedOption !== null}
                            className={btnClass}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {/* Feedback Panel */}
            {selectedOption && (
                <div className={`p-4 rounded-xl border-2 flex items-start gap-4 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className={`rounded-full p-2 text-white shrink-0 shadow-sm ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isCorrect ? <Check size={24} /> : <X size={24} />}
                    </div>
                    <div className="flex-grow">
                        <h4 className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? "回答正确！" : "哎呀，错了！"}
                        </h4>
                        <p className="text-base text-gray-700 mt-1 leading-relaxed">{currentQ.explanation}</p>
                    </div>
                    <button 
                        onClick={nextQuestion}
                        className="bg-detective-brown text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg flex items-center gap-2 shrink-0 self-center font-bold"
                    >
                        {isLastQuestion ? "查看成绩" : "下一题"} <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StagePractice;