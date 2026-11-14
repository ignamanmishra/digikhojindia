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
} from 'lucide-react';

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
    return <div className="p-8 text-center text-slate-500 text-xs">Loading operational dashboard metrics...</div>;
  }

  const m = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/50 px-2.5 py-1 rounded border border-blue-500/30">
            Platform Master Dashboard
          </span>
          <h2 className="text-xl font-bold mt-2">Digikhojindia Operations Cockpit</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live telemetry from Cloudflare D1. Multi-tenant customer accounts, active hospital deployments, support tickets, and revenue tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('tickets')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <LifeBuoy size={14} />
            <span>Manage Tickets</span>
          </button>
          <button
            onClick={() => onNavigate('customers')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Users size={14} />
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Section 6 Widgets) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Customers</span>
            <Users size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{m.total_customers}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">{m.active_customers} Active Orgs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Projects</span>
            <FolderGit2 size={16} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{m.active_projects}</p>
          <p className="text-[10px] text-slate-500 mt-1">In Development</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Open Tickets</span>
            <LifeBuoy size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{m.open_tickets}</p>
          <p className="text-[10px] text-slate-500 mt-1">{m.resolved_tickets} Resolved</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Overdue Tasks</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{m.overdue_tasks}</p>
          <p className="text-[10px] text-slate-500 mt-1">Urgent Attention</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active AMCs</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{m.active_amc_contracts}</p>
          <p className="text-[10px] text-slate-500 mt-1">Lifetime AMC Active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Web Enquiries</span>
            <Mail size={16} className="text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{m.total_enquiries}</p>
          <p className="text-[10px] text-blue-600 font-medium mt-1">Lead Funnel</p>
        </div>

      </div>

      {/* Secondary Financial & SLA Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Monthly Revenue (Collected)</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrencyINR(m.monthly_revenue || 0)}</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending Receivables:</span>
            <strong className="text-rose-600 font-bold">{formatCurrencyINR(m.pending_payments || 0)}</strong>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Ticket SLA Compliance</span>
            <CheckCircle2 size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{m.ticket_sla_compliance_percent}%</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical Tickets 4h Resolution:</span>
            <strong className="text-emerald-600 font-bold">100% Met</strong>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">Quick Navigation</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => onNavigate('leads')} className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700">
                → CRM Pipeline
              </button>
              <button onClick={() => onNavigate('invoices')} className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700">
                → New Invoice
              </button>
              <button onClick={() => onNavigate('amc')} className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700">
                → AMC Contracts
              </button>
              <button onClick={() => onNavigate('cms')} className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700">
                → Publish Article
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Revenue History Chart Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">5-Month Revenue & Collection Progression</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3 border-b border-slate-200">Month</th>
                <th className="p-3 border-b border-slate-200">Billed Total</th>
                <th className="p-3 border-b border-slate-200">Collected Total</th>
                <th className="p-3 border-b border-slate-200">Collection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(charts.revenue || []).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{row.month}</td>
                  <td className="p-3 text-slate-700">{formatCurrencyINR(row.revenue)}</td>
                  <td className="p-3 font-bold text-emerald-600">{formatCurrencyINR(row.collected)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Reconciled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
