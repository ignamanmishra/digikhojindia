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
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

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
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Enterprise Admin</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
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
          ))}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
              {userName.charAt(0)}
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">{userRole.replace('_', ' ')}</p>
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
