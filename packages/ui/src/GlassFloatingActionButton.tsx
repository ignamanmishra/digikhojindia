import React from 'react';
import { motion } from 'framer-motion';

export interface GlassFloatingActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export const GlassFloatingActionButton: React.FC<GlassFloatingActionButtonProps> = ({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  className = '',
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  }[position];

  return (
    <div className={`fixed z-40 ${positionClasses} ${className}`}>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className="relative group p-4 rounded-full bg-gradient-to-r from-[#287BFF] via-[#42DDF5] to-[#9B70FF] text-white shadow-[0_0_30px_rgba(66,221,245,0.5)] border border-white/30 flex items-center justify-center overflow-hidden"
        title={label}
      >
        {/* Ambient Pulsing Aura */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity -z-10 animate-pulse-slow" />

        {/* Top reflection shine */}
        <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          {icon}
          {label && <span className="hidden group-hover:inline text-xs font-bold font-heading whitespace-nowrap pr-1">{label}</span>}
        </div>
      </motion.button>
    </div>
  );
};

