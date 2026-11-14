import React from 'react';
import { Search, X } from 'lucide-react';

export interface GlassSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showShortcut?: boolean;
  className?: string;
}

export const GlassSearchBar: React.FC<GlassSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search records, tickets, customers...',
  showShortcut = true,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center w-full max-w-md rounded-xl bg-[#080D20]/50 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/25 transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${className}`}
    >
      <Search size={15} className="ml-3.5 text-slate-400 shrink-0 pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
      />

      {value ? (
        <button
          onClick={() => onChange('')}
          className="mr-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>
      ) : showShortcut ? (
        <kbd className="mr-3 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white/5 border border-white/10 rounded pointer-events-none">
          ⌘K
        </kbd>
      ) : null}
    </div>
  );
};
