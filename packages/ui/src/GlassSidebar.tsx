import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export interface GlassSidebarProps {
  menu: SidebarMenuItem[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userName: string;
  userRole?: string;
  orgName?: string;
  onLogout: () => void;
  appTitle?: string;
  className?: string;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
  menu,
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  userName,
  userRole,
  orgName = 'Digikhojindia',
  onLogout,
  appTitle = 'Enterprise Cockpit',
  className = '',
}) => {
  return (
    <aside
      className={`relative h-screen bg-[#080D20]/80 backdrop-blur-2xl border-r border-white/10 text-slate-300 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 shadow-[4px_0_30px_rgba(0,0,0,0.4)] ${
        collapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Subtle Right Luminous Edge */}
      <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-cyan-400/30 via-violet-500/30 to-transparent pointer-events-none" />

      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <BrandLogo size="sm" variant={collapsed ? 'icon' : 'full'} withTagline={false} glow={true} />
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-amber-500/10 border border-amber-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={17} className={`shrink-0 ${isActive ? 'text-cyan-300' : ''}`} />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10">
                    {item.badge}
                  </span>
                )}

                {/* Animated Liquid Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlassSidebarItem"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#287BFF]/30 via-[#42DDF5]/20 to-[#9B70FF]/25 border border-cyan-400/40 shadow-[0_0_20px_rgba(66,221,245,0.25)] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User & Organization Footer Card */}
      <div className="p-3 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#287BFF] to-[#42DDF5] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(66,221,245,0.4)] border border-white/20">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>

            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate font-heading">{userName}</p>
                <p className="text-[10px] text-cyan-400 truncate">
                  {userRole ? userRole.replace('_', ' ') : orgName}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
