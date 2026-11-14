import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Mail,
  Layers,
  FolderGit2,
  LifeBuoy,
  ShieldCheck,
  Receipt,
  FileText,
  MapPin,
  Bot,
  BarChart3,
  UserCog,
  Cpu,
  History,
  Settings,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { BrandLogo } from '@digikhojindia/ui';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  onLogout,
  userName,
  userRole,
}) => {
  const navSections = [
    {
      title: 'Operations',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'leads', label: 'Leads (CRM)', icon: Target },
        { id: 'enquiries', label: 'Website Enquiries', icon: Mail },
        { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
        { id: 'projects', label: 'Projects & Tasks', icon: FolderGit2 },
        { id: 'employee-panel', label: 'Employee Cockpit', icon: Briefcase, highlight: true },
      ],
    },
    {
      title: 'Products & Revenue',
      items: [
        { id: 'software', label: 'Software Products', icon: Layers },
        { id: 'amc', label: 'AMC Contracts', icon: ShieldCheck },
        { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Growth & Automation',
      items: [
        { id: 'cms', label: 'Website CMS', icon: FileText },
        { id: 'gbp', label: 'Google Business & SEO', icon: MapPin },
        { id: 'automation', label: 'Business Automation', icon: Bot },
        { id: 'integrations', label: 'Integrations', icon: Cpu },
      ],
    },
    {
      title: 'Governance',
      items: [
        { id: 'employees', label: 'Employees & Roles', icon: UserCog },
        { id: 'audit', label: 'Audit Logs', icon: History },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ],
    },
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

        {/* Navigation List */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-heading mb-1.5">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold select-none transition-all duration-200 ${
                        isActive
                          ? 'text-white font-bold'
                          : item.highlight
                          ? 'text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={16} className={`shrink-0 ${isActive ? 'text-cyan-300' : ''}`} />
                      {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

                      {/* Animated Liquid Pill Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeAdminSidebarPill"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#287BFF]/35 via-[#42DDF5]/25 to-[#9B70FF]/30 border border-cyan-400/40 shadow-[0_0_20px_rgba(66,221,245,0.25)] -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#287BFF] to-[#42DDF5] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(66,221,245,0.4)] border border-white/20">
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate font-heading">{userName}</p>
                <p className="text-[10px] text-cyan-400 uppercase tracking-wider truncate font-mono">
                  {userRole.replace('_', ' ')}
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
