import React from 'react';
import { Bell, ExternalLink, Activity } from 'lucide-react';
import { ThemeToggle, GlassSearchBar } from '@digikhojindia/ui';

interface HeaderProps {
  currentTab: string;
  userName: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  userName,
  searchQuery = '',
  onSearchChange,
}) => {
  const titles: Record<string, string> = {
    overview: 'Operations Dashboard',
    customers: 'Customer Accounts & Organizations',
    leads: 'CRM Sales Pipelines & Deals',
    enquiries: 'Website Enquiries & Inbound Leads',
    tickets: 'Support Tickets & SLA Tracking',
    projects: 'Projects, Milestones & Sprints',
    'employee-panel': 'Employee Workload & Performance',
    software: 'Software Products & Client Deployments',
    amc: 'Annual Maintenance Contracts (AMC)',
    invoices: 'Invoices, GST Billing & Payments',
    reports: 'Business Intelligence & Performance Analytics',
    cms: 'Website CMS & Article Publishing',
    gbp: 'Google Business Profile & SEO Management',
    automation: 'Event-driven Business Automation',
    integrations: 'Integrations & External APIs',
    employees: 'Employee Roles & RBAC Permissions',
    audit: 'System Audit Logs & Security History',
    settings: 'Platform Settings & Configurations',
  };

  return (
    <header className="h-16 bg-[#080D20]/80 backdrop-blur-2xl border-b border-white/10 px-6 flex items-center justify-between shrink-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div>
        <h1 className="text-base font-bold text-white font-heading tracking-tight">
          {titles[currentTab] || 'Management'}
        </h1>
        <p className="text-[11px] text-slate-400">Digikhojindia Liquid Glass Operations Platform</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="hidden md:block w-64">
          <GlassSearchBar
            value={searchQuery}
            onChange={onSearchChange || (() => {})}
            placeholder="Quick search..."
            showShortcut={true}
          />
        </div>

        {/* External Portals Quick Links */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="http://localhost:4321"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <span>Public Site</span>
            <ExternalLink size={12} className="text-cyan-400" />
          </a>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <span>Client Portal</span>
            <ExternalLink size={12} className="text-violet-400" />
          </a>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          onClick={() => alert('No unread notifications at this time.')}
          className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl transition-colors backdrop-blur-md"
          title="Notification Center"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(66,221,245,0.8)] animate-pulse" />
        </button>

        {/* Cloudflare D1 Live Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Cloudflare Edge D1</span>
        </div>
      </div>
    </header>
  );
};
