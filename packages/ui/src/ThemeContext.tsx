import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dki_theme') as Theme;
      if (saved === 'light' || saved === 'dark') return saved;
      // Default to dark mode for premium midnight liquid glass feel
      return 'dark';
    }
    return 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dki_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for components used outside provider
    return {
      theme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};

/**
 * Liquid Glass Theme Toggle Button
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`relative p-2 rounded-xl backdrop-blur-md transition-all duration-300 border ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-white/10 text-cyan-300 hover:text-white hover:border-cyan-400/50 shadow-[0_0_15px_rgba(66,221,245,0.2)]'
          : 'bg-white/70 border-slate-200 text-violet-700 hover:text-violet-950 hover:border-violet-400/50 shadow-[0_0_15px_rgba(155,112,255,0.2)]'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Frosted Light Mode' : 'Switch to Midnight Glass Dark Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun size={18} className="animate-spin-slow text-amber-300 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
        ) : (
          <Moon size={18} className="text-violet-600 filter drop-shadow-[0_0_6px_rgba(155,112,255,0.6)]" />
        )}
      </div>
    </button>
  );
};

