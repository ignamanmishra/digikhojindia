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
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              D
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-bold text-sm text-white tracking-tight block">Digikhojindia</span>
                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold block">Client Portal</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-amber-950/40 border border-amber-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={17} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Organization Footer Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
              {orgName.charAt(0)}
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{orgName}</p>
                <p className="text-[10px] text-slate-400 truncate">{userName}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
