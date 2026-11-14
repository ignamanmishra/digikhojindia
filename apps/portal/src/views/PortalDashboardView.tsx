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
} from 'lucide-react';

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
    return <div className="p-8 text-center text-slate-500 text-xs">Loading customer dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/50 px-2.5 py-1 rounded border border-blue-500/30">
            Client Portal Dashboard
          </span>
          <h2 className="text-xl font-bold mt-2">{summary?.organization_name}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Account ID: <span className="font-mono font-bold text-blue-400">{summary?.customer_id}</span> • Dedicated 24/7 SLA Technical Desk
          </p>
        </div>
        <button
          onClick={() => onNavigate('raise-ticket')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={15} />
          <span>Raise New Complaint</span>
        </button>
      </div>

      {/* Customer Dashboard Widgets (Section 8) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Software</span>
            <Laptop size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary?.active_software_count || 1}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Operational</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Open Complaints</span>
            <LifeBuoy size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{summary?.open_complaints || 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">In Progress</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Resolved</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary?.resolved_complaints || 0}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Closed Issues</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Project Progress</span>
            <FolderGit2 size={16} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary?.project_progress_percent}%</p>
          <p className="text-[10px] text-slate-500 mt-1">On Schedule</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">AMC Status</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-emerald-700 leading-tight mt-1">{summary?.amc_validity}</p>
          <p className="text-[10px] text-slate-400 mt-1">Free AMC Policy</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Pending Dues</span>
            <Receipt size={16} className="text-slate-600" />
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1">{formatCurrencyINR(summary?.pending_payments_amount || 0)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Tax Invoices</p>
        </div>

      </div>

      {/* Recent Tickets Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Support Complaints</h3>
            <p className="text-xs text-slate-500">Live ticket resolution queue for your organization</p>
          </div>
          <button onClick={() => onNavigate('tickets')} className="text-xs text-blue-600 font-semibold hover:underline">
            View All Tickets →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3 border-b border-slate-200">Ticket ID</th>
                <th className="p-3 border-b border-slate-200">Subject</th>
                <th className="p-3 border-b border-slate-200">Priority</th>
                <th className="p-3 border-b border-slate-200">Category</th>
                <th className="p-3 border-b border-slate-200">Status</th>
                <th className="p-3 border-b border-slate-200">SLA Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(summary?.recent_tickets || []).map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-600">{t.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{t.subject}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      t.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{t.category}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">
                    {new Date(t.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
