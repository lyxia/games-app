import React, { useState } from 'react';
import { WeatherType } from '../types';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StageOneProps {
  onComplete: () => void;
}

export const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [counts, setCounts] = useState<Record<WeatherType, number>>({
    [WeatherType.Sunny]: 0,
    [WeatherType.Cloudy]: 0,
    [WeatherType.Rainy]: 0,
    [WeatherType.Thunder]: 0
  });
  
  const [showCharts, setShowCharts] = useState(false);

  const incrementCount = (type: WeatherType) => {
    if (showCharts) return;
    setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const chartData = [
    { name: '晴', value: counts[WeatherType.Sunny], type: WeatherType.Sunny, color: '#f59e0b' },
    { name: '阴', value: counts[WeatherType.Cloudy], type: WeatherType.Cloudy, color: '#9ca3af' },
    { name: '雨', value: counts[WeatherType.Rainy], type: WeatherType.Rainy, color: '#3b82f6' },
    { name: '雷', value: counts[WeatherType.Thunder], type: WeatherType.Thunder, color: '#6366f1' },
  ];

  const totalCount = Object.values(counts).reduce((a: number, b: number) => a + b, 0);
  const isTargetReached = totalCount >= 12;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">第1关：从数日子开始</h2>
        <p className="text-gray-600">点击下方的天气图标，记录8月的天气情况吧！(试着点满12天)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interactive Input Area */}
        <div className="bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-200">
          <h3 className="font-bold text-lg mb-4 text-center">8月日历 (模拟)</h3>
          <div className="grid grid-cols-4 gap-4">
             {Object.values(WeatherType).map((type) => (
               <button
                 key={type}
                 onClick={() => incrementCount(type)}
                 className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors active:scale-95"
                 disabled={showCharts}
               >
                 {type === WeatherType.Sunny && <Sun className="w-8 h-8 text-orange-400" />}
                 {type === WeatherType.Cloudy && <Cloud className="w-8 h-8 text-gray-400" />}
                 {type === WeatherType.Rainy && <CloudRain className="w-8 h-8 text-blue-400" />}
                 {type === WeatherType.Thunder && <CloudLightning className="w-8 h-8 text-indigo-500" />}
                 <span className="mt-2 font-bold text-gray-700">
                    {type === WeatherType.Sunny && '晴'}
                    {type === WeatherType.Cloudy && '阴'}
                    {type === WeatherType.Rainy && '雨'}
                    {type === WeatherType.Thunder && '雷'}
                 </span>
                 <div className="mt-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">
                   {counts[type]} 天
                 </div>
               </button>
             ))}
          </div>
          
          <div className="mt-6 flex justify-center">
             {!showCharts ? (
               <button 
                 onClick={() => setShowCharts(true)}
                 disabled={!isTargetReached}
                 className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-colors ${isTargetReached ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
               >
                 {isTargetReached ? '生成图表 ✨' : `再点 ${12 - totalCount} 天`}
               </button>
             ) : (
                <div className="text-center text-green-600 font-bold">图表已生成！观察右侧 👉</div>
             )}
          </div>
        </div>

        {/* Charts Display Area */}
        {showCharts && (
          <div className="space-y-6">
             {/* Pictogram */}
             <div className="bg-white p-4 rounded-3xl border-2 border-pink-200 relative">
                <div className="absolute top-2 right-2 bg-pink-100 text-pink-600 px-2 py-1 rounded-lg text-xs font-bold">象形图</div>
                <h4 className="text-center font-bold mb-4">用图形表示</h4>
                <div className="flex justify-around items-end h-64 border-b-2 border-gray-400 pb-2 px-2">
                  {chartData.map((d) => (
                    <div key={d.name} className="flex flex-col items-center justify-end h-full w-12">
                      <div className="flex flex-col-reverse gap-1 h-full justify-start pb-2">
                        {Array.from({ length: d.value }).map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-600 bg-white flex items-center justify-center text-xs">O</div>
                        ))}
                      </div>
                      <span className="font-bold text-gray-700">{d.name}</span>
                    </div>
                  ))}
                </div>
             </div>

             {/* Bar Chart */}
             <div className="bg-white p-4 rounded-3xl border-2 border-blue-200 relative">
               <div className="absolute top-2 right-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold">条形统计图</div>
               <h4 className="text-center font-bold mb-4">用条形表示</h4>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" />
                     <YAxis allowDecimals={false} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Bar dataKey="value" name="天数" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
             
             <div className="flex justify-center pt-4">
                <button 
                  onClick={onComplete}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors"
                >
                  我知道了，条形图更清楚！下一关 →
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};