import React, { useState } from 'react';
import { LOGIC_CHALLENGE } from '../constants';
import { Siren, ThumbsUp, ThumbsDown, ArrowRight, AlertTriangle } from 'lucide-react';

interface StageLogicProps {
  onComplete: (success: boolean) => void;
}

const StageLogic: React.FC<StageLogicProps> = ({ onComplete }) => {
  const [answered, setAnswered] = useState(false);
  const [userSaidCorrect, setUserSaidCorrect] = useState(false);
  
  const handleAnswer = (choice: boolean) => { // choice is True (Yes it's correct) or False (No it's wrong)
    setAnswered(true);
    setUserSaidCorrect(choice);
  };

  const isUserCorrect = answered && (userSaidCorrect === LOGIC_CHALLENGE.isCorrect);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
       <div className="bg-red-50 shadow-2xl rounded-3xl max-w-2xl w-full p-8 border-4 border-red-200 relative overflow-visible">
          
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-pulse">
             <AlertTriangle /> 逻辑大挑战 <AlertTriangle />
          </div>

          <div className="mt-8 text-center">
            <p className="text-red-800/70 mb-4 font-bold text-lg">请侦探判断，这句话是对还是错？</p>
            <div className="bg-white border-4 border-dashed border-red-300 p-8 text-4xl font-bold rounded-xl mb-10 text-gray-800 shadow-sm">
                "{LOGIC_CHALLENGE.text}"
            </div>
          </div>

          {!answered ? (
              <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="flex flex-col items-center justify-center gap-3 bg-green-100 hover:bg-green-200 border-b-4 border-green-500 p-6 rounded-2xl transition transform hover:-translate-y-1 group"
                  >
                      <ThumbsUp size={48} className="text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-green-800 text-2xl">它是对的</span>
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="flex flex-col items-center justify-center gap-3 bg-red-100 hover:bg-red-200 border-b-4 border-red-500 p-6 rounded-2xl transition transform hover:-translate-y-1 group"
                  >
                      <ThumbsDown size={48} className="text-red-600 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-red-800 text-2xl">它有错误</span>
                  </button>
              </div>
          ) : (
              <div className="animate-fade-in bg-white p-6 rounded-xl border shadow-inner">
                  <h3 className={`text-2xl font-bold mb-2 ${isUserCorrect ? 'text-green-600' : 'text-red-500'}`}>
                      {isUserCorrect ? "判断正确！🎉" : "判断失误！😱"}
                  </h3>
                  <p className="text-lg text-gray-800 mb-4">
                      {isUserCorrect 
                        ? "火眼金睛！这句话确实有语法错误。" 
                        : "哎呀，你被骗了！这句话其实是错的。"}
                  </p>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left border-l-4 border-detective-accent">
                      <p className="font-bold text-detective-brown text-sm mb-1">案情分析：</p>
                      <p className="text-gray-800">{LOGIC_CHALLENGE.explanation}</p>
                      <div className="mt-3 font-bold text-lg bg-white p-2 rounded border border-yellow-200">
                        修正: <span className="line-through text-red-400 mx-1">{LOGIC_CHALLENGE.text.split(' ')[1]}</span> <ArrowRight className="inline w-5 h-5 text-gray-400"/> <span className="text-green-600">{LOGIC_CHALLENGE.correction}</span>
                      </div>
                  </div>

                  <button 
                    onClick={() => onComplete(isUserCorrect)}
                    className="w-full bg-detective-brown text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-lg text-lg"
                  >
                      生成结案报告
                  </button>
              </div>
          )}

       </div>
    </div>
  );
};

export default StageLogic;