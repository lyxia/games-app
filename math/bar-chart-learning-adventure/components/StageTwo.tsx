import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Cell, LabelList, Tooltip } from 'recharts';

interface StageTwoProps {
  onComplete: () => void;
}

export const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [scaleMode, setScaleMode] = useState<1 | 2>(1);
  const [showHalfGridChallenge, setShowHalfGridChallenge] = useState(false);
  const [cowMilkCount, setCowMilkCount] = useState(4);
  const [hasSolvedChallenge, setHasSolvedChallenge] = useState(false);

  const data = [
    { name: '牛奶', value: showHalfGridChallenge ? cowMilkCount : 6 },
    { name: '豆浆', value: 12 },
    { name: '粥', value: 24 },
  ];

  const handleScaleToggle = () => {
    setScaleMode(2);
    setTimeout(() => {
        setShowHalfGridChallenge(true);
    }, 1000);
  };

  const handleBarClick = (entry: any) => {
      if (!showHalfGridChallenge) return;
      if (entry.name === '牛奶') {
          setCowMilkCount(prev => prev === 5 ? 4 : 5);
          if (cowMilkCount !== 5) {
              setHasSolvedChallenge(true);
          }
      }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-purple-200">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">第2关：格子不够怎么办？</h2>
        <p className="text-gray-600">
            {scaleMode === 1 
                ? "这里有24个人喜欢喝粥，但是格子好像画不下了..." 
                : showHalfGridChallenge 
                    ? "挑战：如果有5个人喜欢牛奶，在1格代表2人的图里怎么画？(点击牛奶条形)"
                    : "哇！换成1格代表2人，就能画下了！"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* The Chart */}
        <div className="flex-1 w-full bg-white p-6 rounded-3xl border-2 border-gray-200 relative overflow-hidden transition-all duration-500" style={{ height: '500px' }}>
          
          {scaleMode === 1 && (
              <div className="absolute top-0 left-0 w-full h-12 bg-red-100 z-10 flex items-center justify-center border-b border-red-300 text-red-600 font-bold">
                  ⚠️ 警告：纸张不够长啦！最高只能画到15！
              </div>
          )}

          <h3 className="text-center font-bold mb-2">最喜欢的早餐统计图</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={data} 
                margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                onClick={(state: any) => {
                    if (state && state.activePayload && state.activePayload[0]) {
                        handleBarClick(state.activePayload[0].payload);
                    }
                }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                domain={[0, scaleMode === 1 ? 15 : 26]} 
                ticks={scaleMode === 1 ? [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] : [0,2,4,6,8,10,12,14,16,18,20,22,24,26]}
                label={{ value: '人数', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} isAnimationActive={true} cursor={showHalfGridChallenge ? "pointer" : "default"}>
                {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === '粥' ? '#f87171' : (entry.name === '牛奶' && showHalfGridChallenge ? '#34d399' : '#60a5fa')}
                        onClick={() => handleBarClick(entry)}
                        style={{ cursor: showHalfGridChallenge && entry.name === '牛奶' ? 'pointer' : 'default' }}
                    />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
              {scaleMode === 1 && (
                  <ReferenceLine y={15} stroke="red" strokeDasharray="3 3" label="纸张边界" />
              )}
            </BarChart>
          </ResponsiveContainer>
          
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              每格代表 {scaleMode} 人
          </div>
        </div>

        {/* Controls */}
        <div className="w-full md:w-64 flex flex-col gap-4">
             {scaleMode === 1 && (
                 <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                     <p className="mb-4 font-bold text-red-800">粥有24人，可是每格代表1人，格子不够了！</p>
                     <button 
                        onClick={handleScaleToggle}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all"
                     >
                        💡 试试1格代表2人
                     </button>
                 </div>
             )}

             {scaleMode === 2 && showHalfGridChallenge && (
                 <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                     <p className="mb-4 font-bold text-green-800">
                         提问：如果最喜欢牛奶的是5人，该怎么涂？<br/>
                         <span className="text-sm font-normal">(点击绿色条形，把它变成2格半)</span>
                     </p>
                     {cowMilkCount === 5 ? (
                         <div className="text-center">
                            <p className="text-xl font-bold text-green-600 mb-4">太棒了！<br/>半格代表1人！</p>
                            <button 
                                onClick={onComplete}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all"
                            >
                                下一关：实战对比 →
                            </button>
                         </div>
                     ) : (
                         <p className="text-sm text-center text-gray-500 mt-2">
                             当前: {cowMilkCount}人 ({cowMilkCount / 2} 格)
                         </p>
                     )}
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};