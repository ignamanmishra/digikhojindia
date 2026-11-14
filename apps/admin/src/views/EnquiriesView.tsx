import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { WebsiteEnquiry } from '@digikhojindia/types';
import { Mail, ArrowUpRight } from 'lucide-react';

export const EnquiriesView: React.FC = () => {
  const [enquiries, setEnquiries] = useState<WebsiteEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/crm/enquiries')
      .then((res) => setEnquiries(res.enquiries || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Website Inbound Enquiries</h2>
          <p className="text-xs text-slate-500">Live submissions captured from public website contact, demo & quote forms</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Date</th>
                <th className="p-3.5 border-b border-slate-200">Type</th>
                <th className="p-3.5 border-b border-slate-200">Prospect / Company</th>
                <th className="p-3.5 border-b border-slate-200">Service Interest</th>
                <th className="p-3.5 border-b border-slate-200">Message / Requirement</th>
                <th className="p-3.5 border-b border-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">
                    {new Date(e.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      e.type === 'demo' ? 'bg-blue-100 text-blue-700' :
                      e.type === 'quote' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-900">{e.name}</p>
                    <p className="text-[11px] text-slate-500">{e.company || e.email}</p>
                    <p className="text-[10px] text-slate-400">{e.phone}</p>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">
                    {e.service_interest}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-sm truncate" title={e.message}>
                    {e.message}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {e.status}
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
