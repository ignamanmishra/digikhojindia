import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Laptop,
  FolderGit2,
  AlertCircle,
  LifeBuoy,
  ShieldCheck,
  Receipt,
  FileDown,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BrandLogo } from '@digikhojindia/ui';
import { motion } from 'framer-motion';

interface PortalSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  orgName: string;
  userName: string;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  onLogout,
  orgName,
  userName,
}) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'company', label: 'My Company', icon: Building2 },
    { id: 'software', label: 'My Software', icon: Laptop },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'raise-ticket', label: 'Raise Complaint', icon: AlertCircle, highlight: true },
    { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
    { id: 'amc', label: 'AMC Details', icon: ShieldCheck },
    { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
    { id: 'documents', label: 'Authorized Documents', icon: FileDown },
    { id: 'profile', label: 'Profile & Password', icon: User },
  ];

  return (
    <aside
      className={`relative h-screen bg-[#080D20]/85 backdrop-blur-2xl border-r border-white/10 text-slate-300 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 shadow-[4px_0_30px_rgba(0,0,0,0.5)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Subtle Right Luminous Edge */}
      <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-cyan-400/40 via-violet-500/30 to-transparent pointer-events-none" />

      <div>
        {/* Brand Header with Official Emblem */}
        <div className="h-20 px-4 border-b border-white/10 flex items-center justify-between">
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

        {/* Menu Items */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-200 ${
                  isActive
                    ? 'text-white font-bold'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={17} className={`shrink-0 ${isActive ? 'text-cyan-300' : ''}`} />
                {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

                {/* Animated Liquid Pill Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activePortalSidebarPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#287BFF]/35 via-[#42DDF5]/25 to-[#9B70FF]/30 border border-cyan-400/40 shadow-[0_0_20px_rgba(66,221,245,0.25)] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Organization Footer Card */}
      <div className="p-3 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#287BFF] to-[#42DDF5] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(66,221,245,0.4)] border border-white/20">
              {orgName ? orgName.charAt(0).toUpperCase() : 'C'}
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate font-heading">{orgName}</p>
                <p className="text-[10px] text-cyan-400 truncate">{userName}</p>
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
