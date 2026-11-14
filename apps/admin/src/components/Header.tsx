import React from 'react';
import { Bell, Search, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, userName }) => {
  const titles: Record<string, string> = {
    overview: 'Operations Dashboard',
    customers: 'Customer Accounts & Organizations',
    leads: 'CRM Sales Pipelines & Leads',
    enquiries: 'Website Enquiries & Inbound Leads',
    tickets: 'Support Tickets & SLA Tracking',
    projects: 'Projects, Milestones & Tasks',
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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-base font-bold text-slate-900">{titles[currentTab] || 'Management'}</h1>
        <p className="text-[11px] text-slate-500">Digikhojindia Centralized Operations Platform</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, tickets, clients..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* External Portals Quick Links */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="http://localhost:4321"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <span>Customer Portal</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
        </button>

        {/* D1 Connection Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>D1 SQLite Live</span>
        </div>
      </div>
    </header>
  );
};
