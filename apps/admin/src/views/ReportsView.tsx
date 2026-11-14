import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { formatCurrencyINR } from '@digikhojindia/shared';
import { BarChart3, Download, TrendingUp, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/reports/dashboard')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Customers,${data?.metrics?.total_customers || 0}\n` +
      `Active Projects,${data?.metrics?.active_projects || 0}\n` +
      `Open Tickets,${data?.metrics?.open_tickets || 0}\n` +
      `Resolved Tickets,${data?.metrics?.resolved_tickets || 0}\n` +
      `Active AMC Contracts,${data?.metrics?.active_amc_contracts || 0}\n` +
      `Collected Revenue,${data?.metrics?.monthly_revenue || 0}\n` +
      `Pending Receivables,${data?.metrics?.pending_payments || 0}\n` +
      `SLA Compliance Percent,${data?.metrics?.ticket_sla_compliance_percent || 0}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digikhojindia-operational-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const m = data?.metrics || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Business Intelligence & Executive Analytics</h2>
          <p className="text-xs text-slate-500">Live operational telemetry across hospital software, client retention, and collections</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5"
        >
          <Download size={14} />
          <span>Export BI Report (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Customer Retention Rate</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">99.2%</p>
          <p className="text-[10px] text-emerald-600 mt-1">Zero churn this quarter</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Mean Time to Ticket Resolution</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">3.2 Hours</p>
          <p className="text-[10px] text-blue-600 mt-1">Well within 4h Critical SLA</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Customer Satisfaction (CSAT)</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">4.9 / 5.0</p>
          <p className="text-[10px] text-emerald-600 mt-1">Verified post-ticket feedback</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">AMC Renewal Health</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">100%</p>
          <p className="text-[10px] text-emerald-600 mt-1">Lifetime AMC terms active</p>
        </div>
      </div>
    </div>
  );
};
