import React from 'react';
import { motion } from 'framer-motion';

interface MagicButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
}

export const MagicButton: React.FC<MagicButtonProps> = ({
  onClick,
  children,
  className = '',
  variant = 'primary',
  disabled = false
}) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold text-xl shadow-[0_4px_0_rgb(0,0,0,0.2)] transition-all active:shadow-none active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 border-2 border-purple-400",
    secondary: "bg-white text-purple-900 hover:bg-purple-50 border-2 border-purple-200",
    success: "bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:brightness-110 border-2 border-green-300",
    danger: "bg-gradient-to-r from-red-500 to-orange-600 text-white hover:brightness-110 border-2 border-yellow-400",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};