import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  glowColor?: 'cyan' | 'violet' | 'electric' | 'pink' | 'emerald' | 'none';
  interactive?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  glowColor = 'cyan',
  interactive = false,
  blur = 'md',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-xl',
    xl: 'backdrop-blur-2xl',
  }[blur];

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  }[padding];

  const glowBorderClasses = {
    cyan: 'hover:border-cyan-400/50 hover:shadow-[0_10px_35px_rgba(66,221,245,0.25)]',
    violet: 'hover:border-violet-400/50 hover:shadow-[0_10px_35px_rgba(155,112,255,0.25)]',
    electric: 'hover:border-blue-400/50 hover:shadow-[0_10px_35px_rgba(40,123,255,0.3)]',
    pink: 'hover:border-pink-400/50 hover:shadow-[0_10px_35px_rgba(240,120,200,0.25)]',
    emerald: 'hover:border-emerald-400/50 hover:shadow-[0_10px_35px_rgba(16,185,129,0.25)]',
    none: 'hover:border-white/20',
  }[glowColor];

  const content = (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-white/[0.08] via-[#102B50]/30 to-white/[0.02] border border-white/10 dark:border-white/10 light:border-slate-300/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden transition-all duration-300 ${blurClasses} ${paddingClasses} ${
        interactive ? `${glowBorderClasses} cursor-pointer` : ''
      } ${className}`}
    >
      {/* Subtle top reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Ambient corner light gradient */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </div>
  );

  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.008 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
