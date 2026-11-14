import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'aurora';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glow = true,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
    md: 'px-4.5 py-2.5 text-xs font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3 text-sm font-bold rounded-2xl gap-2.5',
    xl: 'px-8 py-3.5 text-base font-bold rounded-2xl gap-3',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#287BFF] via-[#42DDF5] to-[#9B70FF] text-white shadow-[0_0_20px_rgba(66,221,245,0.35)] hover:shadow-[0_0_30px_rgba(40,123,255,0.5)] border border-white/20',
    secondary:
      'bg-[#102B50]/60 hover:bg-[#102B50]/90 text-cyan-300 hover:text-white backdrop-blur-md border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-cyan-400/60',
    outline:
      'bg-white/5 hover:bg-white/10 text-slate-100 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 shadow-sm',
    danger:
      'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] border border-white/20',
    ghost:
      'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white',
    aurora:
      'bg-gradient-to-r from-[#9B70FF] via-[#F078C8] to-[#42DDF5] text-white shadow-[0_0_25px_rgba(240,120,200,0.4)] hover:shadow-[0_0_35px_rgba(155,112,255,0.6)] border border-white/30',
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center select-none overflow-hidden transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {/* Subtle top reflection shine */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      {/* Loading Spinner */}
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

