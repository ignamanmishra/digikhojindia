import React from 'react';
import { ShieldCheck, PhoneCall, PlusCircle } from 'lucide-react';

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
    projects: 'Deployment Projects & Progress',
    'raise-ticket': 'Raise Technical Complaint',
    tickets: 'Support Tickets & History',
    amc: 'Annual Maintenance Contract (AMC)',
    invoices: 'Invoices & Billing Statements',
    documents: 'Authorized Documentation & Manuals',
    profile: 'Profile & Security Settings',
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-base font-bold text-white">{titles[currentTab] || 'Customer Portal'}</h1>
        <p className="text-[11px] text-slate-400">
          Organization: <strong className="text-slate-200">{orgName}</strong> ({customerId})
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRaiseTicket}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <PlusCircle size={14} /> Raise Complaint
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          <PhoneCall size={13} className="text-blue-400" />
          <span>Priority Tech Desk: <strong className="text-white">+91 9876543212</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Tenant Isolated</span>
        </div>
      </div>
    </header>
  );
};
