import React, { forwardRef } from 'react';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
  containerClassName?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      label,
      error,
      helperText,
      iconPrefix,
      iconSuffix,
      containerClassName = '',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 tracking-wide">
            {label}
          </label>
        )}

        <div className="relative group">
          {iconPrefix && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
              {iconPrefix}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={`w-full bg-[#102B50]/40 dark:bg-[#080D20]/60 backdrop-blur-md border rounded-xl py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
              iconPrefix ? 'pl-10' : 'pl-3.5'
            } ${iconSuffix ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30'
                : 'border-white/10 dark:border-white/10 hover:border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {iconSuffix && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {iconSuffix}
            </div>
          )}

          {/* Bottom subtle glow highlight on focus */}
          <div className="absolute inset-x-2 -bottom-px h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full blur-[1px]" />
        </div>

        {error ? (
          <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium mt-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
