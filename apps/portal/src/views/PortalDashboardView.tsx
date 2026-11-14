import React, { useEffect, useState } from 'react';
import { portalRequest } from '../api';
import { formatCurrencyINR } from '@digikhojindia/shared';
import {
  Laptop,
  LifeBuoy,
  CheckCircle2,
  FolderGit2,
  ShieldCheck,
  Receipt,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { GlassCard, GlassButton, GlassStatusBadge } from '@digikhojindia/ui';

export const PortalDashboardView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalRequest('/reports/portal-summary')
      .then((res) => setSummary(res.summary))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <div className="inline-flex items-center gap-2 text-cyan-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading client dashboard telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Liquid Glass Client Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#102B50]/80 via-[#080D20]/90 to-[#102B50]/70 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(66,221,245,0.2)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              <span>Enterprise Client Cockpit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {summary?.organization_name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Customer ID: <span className="font-mono font-bold text-cyan-400">{summary?.customer_id}</span> • 24/7 Dedicated Priority Technical Support Desk
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="md"
            onClick={() => onNavigate('raise-ticket')}
            className="shrink-0"
          >
            <PlusCircle size={15} />
            <span>Raise Technical Complaint</span>
          </GlassButton>
        </div>
      </div>

      {/* Customer Dashboard Widgets (Liquid Glass Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Active Software */}
        <GlassCard glowColor="electric" interactive={true} onClick={() => onNavigate('software')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Active Apps</span>
            <Laptop size={16} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white font-heading">{summary?.active_software_count || 1}</p>
          <p className="text-[10px] text-cyan-300 font-medium mt-1">Operational</p>
        </GlassCard>

        {/* Open Complaints */}
        <GlassCard glowColor="cyan" interactive={true} onClick={() => onNavigate('tickets')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Open Tickets</span>
            <LifeBuoy size={16} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400 font-heading">{summary?.open_complaints || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">In Progress</p>
        </GlassCard>

        {/* Resolved Issues */}
        <GlassCard glowColor="emerald" interactive={true} onClick={() => onNavigate('tickets')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Resolved</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-heading">{summary?.resolved_complaints || 0}</p>
          <p className="text-[10px] text-emerald-300/80 mt-1">Closed Issues</p>
        </GlassCard>

        {/* Project Progress */}
        <GlassCard glowColor="violet" interactive={true} onClick={() => onNavigate('projects')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Sprints</span>
            <FolderGit2 size={16} className="text-violet-400" />
          </div>
          <p className="text-3xl font-black text-white font-heading">{summary?.project_progress_percent}%</p>
          <p className="text-[10px] text-slate-400 mt-1">On Schedule</p>
        </GlassCard>

        {/* AMC Status */}
        <GlassCard glowColor="emerald" interactive={true} onClick={() => onNavigate('amc')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">AMC Validity</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <p className="text-xs font-bold text-emerald-300 leading-tight mt-1">{summary?.amc_validity}</p>
          <p className="text-[10px] text-slate-400 mt-1">Lifetime Eligible</p>
        </GlassCard>

        {/* Pending Invoices */}
        <GlassCard glowColor="electric" interactive={true} onClick={() => onNavigate('invoices')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Balance Due</span>
            <Receipt size={16} className="text-cyan-400" />
          </div>
          <p className="text-sm font-bold text-white font-heading mt-1">
            {formatCurrencyINR(summary?.pending_payments_amount || 0)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">GST Statements</p>
        </GlassCard>
      </div>

      {/* Recent Tickets Section (Liquid Glass Table) */}
      <GlassCard glowColor="cyan" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white font-heading">Recent Support Complaints</h3>
            <p className="text-xs text-slate-400">Live ticket resolution queue for your organization</p>
          </div>
          <button
            onClick={() => onNavigate('tickets')}
            className="text-xs text-cyan-400 font-semibold hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All Tickets</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-heading font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {(summary?.recent_tickets || []).map((t: any) => (
                <tr key={t.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{t.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{t.subject}</td>
                  <td className="py-3.5 px-4">
                    <GlassStatusBadge status={t.priority} label={t.priority} pulse={t.priority === 'Critical'} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{t.category}</td>
                  <td className="py-3.5 px-4">
                    <GlassStatusBadge status={t.status} label={t.status} pulse={false} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {new Date(t.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
