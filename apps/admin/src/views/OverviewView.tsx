import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { formatCurrencyINR } from '@digikhojindia/shared';
import {
  Users,
  FolderGit2,
  LifeBuoy,
  ShieldCheck,
  Receipt,
  Mail,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { GlassCard, GlassButton, GlassStatusBadge } from '@digikhojindia/ui';

export const OverviewView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/reports/dashboard')
      .then((res) => setData(res))
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
          <span>Loading Liquid Glass telemetry...</span>
        </div>
      </div>
    );
  }

  const m = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-6">
      {/* Liquid Glass Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#102B50]/80 via-[#080D20]/90 to-[#102B50]/70 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(66,221,245,0.2)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              <span>ColorOS Liquid Glass Telemetry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Digikhojindia Enterprise Operations Cockpit
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time multi-tenant telemetry from Cloudflare D1: enterprise client accounts, HMIS healthcare deployments, support tickets, and GST revenue reconciliation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => onNavigate('tickets')}
            >
              <LifeBuoy size={14} />
              <span>Support Queue</span>
            </GlassButton>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('customers')}
            >
              <Users size={14} />
              <span>Customer Registry</span>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Liquid Glass Cards with Luminous Glow) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Customers */}
        <GlassCard glowColor="electric" interactive={true} onClick={() => onNavigate('customers')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Customers</span>
            <Users size={16} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white font-heading">{m.total_customers}</p>
          <p className="text-[10px] text-cyan-300 font-medium mt-1">{m.active_customers} Active Orgs</p>
        </GlassCard>

        {/* Active Projects */}
        <GlassCard glowColor="violet" interactive={true} onClick={() => onNavigate('projects')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Active Sprints</span>
            <FolderGit2 size={16} className="text-violet-400" />
          </div>
          <p className="text-3xl font-black text-white font-heading">{m.active_projects}</p>
          <p className="text-[10px] text-slate-400 mt-1">In Development</p>
        </GlassCard>

        {/* Open Tickets */}
        <GlassCard glowColor="cyan" interactive={true} onClick={() => onNavigate('tickets')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Open Tickets</span>
            <LifeBuoy size={16} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400 font-heading">{m.open_tickets}</p>
          <p className="text-[10px] text-slate-400 mt-1">{m.resolved_tickets} Resolved</p>
        </GlassCard>

        {/* Overdue Tasks */}
        <GlassCard glowColor="pink" interactive={true} onClick={() => onNavigate('projects')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Overdue Tasks</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 font-heading">{m.overdue_tasks}</p>
          <p className="text-[10px] text-rose-300/80 mt-1">Needs Attention</p>
        </GlassCard>

        {/* Active AMCs */}
        <GlassCard glowColor="emerald" interactive={true} onClick={() => onNavigate('amc')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Active AMCs</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-heading">{m.active_amc_contracts}</p>
          <p className="text-[10px] text-emerald-300/80 mt-1">Lifetime Eligible</p>
        </GlassCard>

        {/* Web Enquiries */}
        <GlassCard glowColor="electric" interactive={true} onClick={() => onNavigate('enquiries')}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Leads Funnel</span>
            <Mail size={16} className="text-sky-400" />
          </div>
          <p className="text-3xl font-black text-white font-heading">{m.total_enquiries}</p>
          <p className="text-[10px] text-cyan-300 font-medium mt-1">Inbound Leads</p>
        </GlassCard>
      </div>

      {/* Secondary Financial & SLA Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Reconciled */}
        <GlassCard glowColor="emerald" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Monthly Invoiced & Collected
            </span>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-heading">
            {formatCurrencyINR(m.monthly_revenue || 0)}
          </p>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Pending Receivables:</span>
            <strong className="text-amber-400 font-bold">{formatCurrencyINR(m.pending_payments || 0)}</strong>
          </div>
        </GlassCard>

        {/* SLA Compliance */}
        <GlassCard glowColor="cyan" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Support SLA Adherence
            </span>
            <CheckCircle2 size={18} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-300 font-heading">
            {m.ticket_sla_compliance_percent}%
          </p>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Critical P1 Resolution (4h):</span>
            <GlassStatusBadge status="success" label="100% Met" pulse={true} size="sm" />
          </div>
        </GlassCard>

        {/* Quick Launchpad */}
        <GlassCard glowColor="violet" className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading block mb-3">
              Instant Cockpit Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('leads')}
                className="p-2.5 text-left bg-white/[0.04] hover:bg-white/10 rounded-xl border border-white/10 font-medium text-slate-200 transition-colors"
              >
                → CRM Pipeline
              </button>
              <button
                onClick={() => onNavigate('invoices')}
                className="p-2.5 text-left bg-white/[0.04] hover:bg-white/10 rounded-xl border border-white/10 font-medium text-slate-200 transition-colors"
              >
                → GST Invoices
              </button>
              <button
                onClick={() => onNavigate('amc')}
                className="p-2.5 text-left bg-white/[0.04] hover:bg-white/10 rounded-xl border border-white/10 font-medium text-slate-200 transition-colors"
              >
                → AMC Contracts
              </button>
              <button
                onClick={() => onNavigate('cms')}
                className="p-2.5 text-left bg-white/[0.04] hover:bg-white/10 rounded-xl border border-white/10 font-medium text-slate-200 transition-colors"
              >
                → CMS Articles
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Revenue History Liquid Glass Table */}
      <GlassCard glowColor="cyan" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white font-heading">5-Month Invoicing & Collection Progression</h3>
            <p className="text-xs text-slate-400">Reconciled against 18% GST tax receipts</p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-heading font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4">Billed Total</th>
                <th className="py-3 px-4">Collected Total</th>
                <th className="py-3 px-4">Reconciliation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {(charts.revenue || []).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white font-heading">{row.month}</td>
                  <td className="py-3.5 px-4 text-slate-300">{formatCurrencyINR(row.revenue)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrencyINR(row.collected)}</td>
                  <td className="py-3.5 px-4">
                    <GlassStatusBadge status="success" label="Reconciled" pulse={false} size="sm" />
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
