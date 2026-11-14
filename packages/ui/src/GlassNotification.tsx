import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface GlassNotificationProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

export const GlassNotification: React.FC<GlassNotificationProps> = ({
  type = 'info',
  title,
  message,
  isOpen,
  onClose,
  className = '',
}) => {
  const config = {
    success: {
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_10px_35px_rgba(16,185,129,0.3)]',
      icon: <CheckCircle2 size={18} className="text-emerald-400" />,
      text: 'text-emerald-300',
    },
    warning: {
      border: 'border-amber-500/40',
      glow: 'shadow-[0_10px_35px_rgba(245,158,11,0.3)]',
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      text: 'text-amber-300',
    },
    error: {
      border: 'border-rose-500/40',
      glow: 'shadow-[0_10px_35px_rgba(244,63,94,0.3)]',
      icon: <AlertCircle size={18} className="text-rose-400" />,
      text: 'text-rose-300',
    },
    info: {
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_10px_35px_rgba(66,221,245,0.3)]',
      icon: <Info size={18} className="text-cyan-400" />,
      text: 'text-cyan-300',
    },
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className={`rounded-2xl bg-[#080D20]/90 backdrop-blur-2xl border p-4 ${config.border} ${config.glow} flex items-start gap-3 select-none ${className}`}
        >
          <div className="shrink-0 mt-0.5">{config.icon}</div>
          <div className="flex-1 min-w-0">
            {title && <h5 className={`text-xs font-bold font-heading mb-0.5 ${config.text}`}>{title}</h5>}
            <p className="text-xs text-slate-200 leading-relaxed">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

