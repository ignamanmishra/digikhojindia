import React from 'react';
import { History, Shield } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const sampleLogs = [
    {
      id: 'log-001',
      action: 'CUSTOMER_CREATED',
      resource_type: 'Customer',
      resource_id: 'DKI-100001',
      user_name: 'Naman Mishra (Super Admin)',
      ip_address: '127.0.0.1',
      timestamp: '2026-11-14 10:00:00',
    },
    {
      id: 'log-002',
      action: 'SOFTWARE_ASSIGNED',
      resource_type: 'SoftwareProduct',
      resource_id: 'prod-hmis',
      user_name: 'Naman Mishra (Super Admin)',
      ip_address: '127.0.0.1',
      timestamp: '2026-11-14 10:15:00',
    },
    {
      id: 'log-003',
      action: 'TICKET_STATUS_UPDATED',
      resource_type: 'Ticket',
      resource_id: 'DKI-2026-00001',
      user_name: 'Aakash Verma (Support Lead)',
      ip_address: '127.0.0.1',
      timestamp: '2026-11-14 10:20:00',
    },
    {
      id: 'log-004',
      action: 'INVOICE_GENERATED',
      resource_type: 'Invoice',
      resource_id: 'INV-2026-00001',
      user_name: 'Naman Mishra (Super Admin)',
      ip_address: '127.0.0.1',
      timestamp: '2026-11-14 11:00:00',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">System Security Audit Logs</h2>
        <p className="text-xs text-slate-500">Immutable chronological record of administrative actions and security events</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
            <tr>
              <th className="p-3.5 border-b border-slate-200">Timestamp</th>
              <th className="p-3.5 border-b border-slate-200">Action</th>
              <th className="p-3.5 border-b border-slate-200">Resource</th>
              <th className="p-3.5 border-b border-slate-200">Actor</th>
              <th className="p-3.5 border-b border-slate-200">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sampleLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 text-slate-500 font-mono">{log.timestamp}</td>
                <td className="p-3.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 text-slate-700">
                  {log.resource_type}: <span className="font-mono font-semibold">{log.resource_id}</span>
                </td>
                <td className="p-3.5 text-slate-800 font-medium">{log.user_name}</td>
                <td className="p-3.5 font-mono text-slate-500">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

