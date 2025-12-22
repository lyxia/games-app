import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StageThreeProps {
  onComplete: () => void;
}

export const StageThree: React.FC<StageThreeProps> = ({ onComplete }) => {
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);

  const data = [
    { name: '晴', aug: 9, sept: 18 },
    { name: '阴', aug: 6, sept: 4 },
    { name: '多云', aug: 9, sept: 2 },
    { name: '雨', aug: 7, sept: 6 },
  ];

  const questions = [
    {
      id: 1,
      text: "9月和8月比较，天气有什么变化？",
      options: [
        "A. 9月晴天变多了，雨天变少了",
        "B. 9月阴天变多了",
        "C. 没有任何变化"
      ],
      correct: 0 // A
    },
    {
      id: 2,
      text: "9月A市已正式进入秋季，你认为A市9月的天气有什么特点？",
      options: [
        "A. 经常下雨，很潮湿",
        "B. 晴空万里，凉爽舒适",
        "C. 天天都是阴天"
      ],
      correct: 1 // B
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === questions[quizStep].correct) {
      setScore(s => s + 10);
      alert("回答正确！+10分");
    } else {
      alert("不对哦，再看一看图表~");
    }

    if (quizStep < questions.length - 1) {
      setQuizStep(p => p + 1);
    } else {
      setQuizStep(p => p + 1);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-green-200">
        <h2 className="text-2xl font-bold text-green-600 mb-2">第3关：天气变了吗？</h2>
        <p className="text-gray-600">这是8月和9月的天气对比图。仔细观察，回答机器人的问题！</p>
        <div className="absolute top-6 right-6 bg-yellow-400 text-white font-bold px-4 py-2 rounded-full shadow-md">
          得分: {score}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-4 rounded-3xl border-2 border-gray-100 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: '天数', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="aug" name="8月" fill="#fca5a5" radius={[4,4,0,0]} />
                <Bar dataKey="sept" name="9月" fill="#93c5fd" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-blue-50 p-6 rounded-3xl border border-blue-200 flex flex-col justify-center">
            {quizStep < questions.length ? (
              <>
                <div className="mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">问题 {quizStep + 1}</span>
                </div>
                <h3 className="font-bold text-lg mb-6 text-gray-800">{questions[quizStep].text}</h3>
                <div className="space-y-3">
                  {questions[quizStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left p-4 bg-white rounded-xl border border-blue-100 hover:border-blue-400 hover:bg-blue-50 transition-colors shadow-sm active:scale-95 text-gray-700 font-medium"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">挑战完成！</h3>
                <p className="text-gray-600 mb-6">你已经学会了通过对比条形图来分析数据！</p>
                <button
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
                >
                  领取"终极笔记本" →
                </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};