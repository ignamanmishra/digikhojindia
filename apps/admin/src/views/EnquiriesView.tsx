import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { WebsiteEnquiry } from '@digikhojindia/types';
import { Mail, Phone, MessageSquare, CheckCircle, ShieldCheck, BellRing } from 'lucide-react';
import { GlassCard, GlassStatusBadge } from '@digikhojindia/ui';

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
      {/* Header & Alert Notification Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white font-heading">Inbound Leads & Website Enquiries</h2>
          <p className="text-xs text-slate-400">Live submissions captured from public contact, demo & quote forms</p>
        </div>

        {/* Dual Email Dispatch Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#102B50]/60 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_20px_rgba(66,221,245,0.2)]">
          <BellRing size={16} className="text-cyan-400 animate-pulse shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="text-slate-400">Instant Email Dispatch To:</span>
            <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="text-cyan-300">namanmishraofficial@gmail.com</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">info@digikhojindia.online</span>
            </div>
          </div>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.04] text-slate-300 font-semibold uppercase border-b border-white/10 text-[11px]">
              <tr>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Prospect & Company</th>
                <th className="p-4">Direct Contact</th>
                <th className="p-4">Service Interest</th>
                <th className="p-4">Message / Scope</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading inbound inquiries...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No inbound inquiries recorded yet.</td>
                </tr>
              ) : (
                enquiries.map((e) => {
                  const cleanPhone = e.phone.replace(/[^0-9]/g, '');
                  return (
                    <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {new Date(e.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          e.type === 'demo' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30' :
                          e.type === 'quote' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' :
                          'bg-violet-950/80 text-violet-300 border border-violet-500/30'
                        }`}>
                          {e.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white text-xs">{e.name}</p>
                        <p className="text-[11px] text-cyan-400">{e.company || 'Direct Individual'}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${e.phone}`}
                            className="font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1"
                          >
                            <Phone size={12} className="text-cyan-400" />
                            <span>{e.phone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={12} />
                          </a>
                        </div>
                        <a href={`mailto:${e.email}`} className="text-[11px] text-slate-400 hover:underline block mt-0.5">
                          {e.email}
                        </a>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {e.service_interest}
                      </td>
                      <td className="p-4 text-slate-300 max-w-xs truncate" title={e.message}>
                        {e.message}
                      </td>
                      <td className="p-4">
                        <GlassStatusBadge
                          status={e.status === 'converted' ? 'success' : e.status === 'processed' ? 'info' : 'pending'}
                          label={e.status}
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

