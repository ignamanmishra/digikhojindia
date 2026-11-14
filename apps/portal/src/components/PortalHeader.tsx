import React from 'react';
import { ShieldCheck, PhoneCall, PlusCircle, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@digikhojindia/ui';

interface PortalHeaderProps {
  currentTab: string;
  orgName: string;
  customerId: string;
  onRaiseTicket: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  currentTab,
  orgName,
  customerId,
  onRaiseTicket,
}) => {
  const titles: Record<string, string> = {
    dashboard: 'Client Overview',
    company: 'Organization Profile & Facilities',
    software: 'Active Software Modules',
    projects: 'Deployment Projects & Sprints',
    'raise-ticket': 'Raise Technical Complaint',
    tickets: 'Support Tickets & History',
    amc: 'Annual Maintenance Contract (AMC)',
    invoices: 'Invoices & Billing Statements',
    documents: 'Authorized Documentation & Manuals',
    profile: 'Profile & Security Settings',
  };

  return (
    <header className="h-16 bg-[#080D20]/80 backdrop-blur-2xl border-b border-white/10 px-6 flex items-center justify-between shrink-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div>
        <h1 className="text-base font-bold text-white font-heading tracking-tight">
          {titles[currentTab] || 'Customer Portal'}
        </h1>
        <p className="text-[11px] text-slate-400">
          Organization: <strong className="text-cyan-300 font-medium">{orgName}</strong> ({customerId})
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Raise Complaint Action */}
        <button
          onClick={onRaiseTicket}
          className="relative group hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#287BFF] via-[#42DDF5] to-[#9B70FF] shadow-[0_0_20px_rgba(66,221,245,0.35)] hover:shadow-[0_0_30px_rgba(40,123,255,0.5)] border border-white/20 transition-all transform hover:scale-[1.02] overflow-hidden"
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
          <PlusCircle size={14} />
          <span>Raise Complaint</span>
        </button>

        {/* Priority Phone Helpline */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-white/[0.04] backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl shadow-sm">
          <PhoneCall size={13} className="text-cyan-400" />
          <span>Priority Tech Desk: <a href="tel:+918989828902" className="text-cyan-300 hover:underline font-bold">+91 89898 28902</a></span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Tenant Isolated Shield */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Tenant Isolated</span>
        </div>
      </div>
    </header>
  );
};
