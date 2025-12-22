import React from 'react';
import { MessageCircle } from 'lucide-react';

interface RobotProps {
  message: string;
  emotion?: 'happy' | 'thinking' | 'excited';
  onClick?: () => void;
}

export const Robot: React.FC<RobotProps> = ({ message, emotion = 'happy', onClick }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end animate-fade-in" onClick={onClick}>
      <div className="bg-white border-2 border-red-500 rounded-2xl p-4 shadow-lg mb-8 mr-2 max-w-[250px] relative bubble-triangle">
        <p className="text-gray-800 font-bold text-sm md:text-base">{message}</p>
        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-red-500 transform rotate-45"></div>
      </div>
      <div className="relative cursor-pointer transition-transform hover:scale-105">
        <div className={`w-20 h-24 rounded-t-full rounded-b-lg border-4 border-red-600 bg-red-500 flex flex-col items-center justify-center shadow-xl ${emotion === 'excited' ? 'animate-bounce-short' : ''}`}>
          {/* Eyes */}
          <div className="flex gap-2 mb-1">
             <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-black rounded-full"></div>
             </div>
             <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-black rounded-full"></div>
             </div>
          </div>
          {/* Mouth */}
          <div className="w-8 h-3 bg-white rounded-full mt-1"></div>
        </div>
        {/* Antenna */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gray-400"></div>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};