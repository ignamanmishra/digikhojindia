import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Animated Liquid Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#080D20]/80 backdrop-blur-md"
          />

          {/* Morphing Glass Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${sizeClasses} rounded-2xl bg-gradient-to-b from-[#102B50]/90 to-[#080D20]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(66,221,245,0.15)] overflow-hidden my-8 z-10 ${className}`}
          >
            {/* Top Shine Reflection */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

            {/* Header */}
            {title && (
              <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between">
                <div className="text-base font-bold text-white font-heading">{title}</div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
