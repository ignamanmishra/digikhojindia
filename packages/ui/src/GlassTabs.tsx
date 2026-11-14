import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface GlassTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1.5 rounded-2xl bg-[#080D20]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.3)] ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold select-none transition-colors duration-200 z-10 ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            )}

            {/* Sliding animated luminous pill */}
            {isActive && (
              <motion.div
                layoutId="activeGlassTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-violet-600/80 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_20px_rgba(66,221,245,0.4)] -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

