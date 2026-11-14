import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Calendar, FileText, PhoneCall, Clock, Check, X } from 'lucide-react';
import { portalRequest } from '../api';
import { formatDate } from '@digikhojindia/shared';

interface AmcContract {
  id: string;
  customer_id: string;
  software_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expiring' | 'expired' | 'pending';
  coverage_type: string;
  included_services: string[];
  excluded_services: string[];
  notes?: string;
}

export const PortalAmcView: React.FC = () => {
  const [contracts, setContracts] = useState<AmcContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalRequest<{ success: boolean; contracts: AmcContract[] }>('/amc')
      .then((res) => setContracts(res.contracts || []))
      .catch((err) => console.error('Failed to load AMC contracts', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Lifetime Free AMC Proposition Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Digikhojindia Commitment
                </span>
                <span className="text-xs text-slate-400">Policy Ref: DKI-AMC-LIFETIME</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Lifetime Free AMC <span className="text-sm font-normal text-emerald-300">– Subject to agreed contract terms</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                As part of our commitment to automating and sustaining your business operations, your custom software deployments qualify for lifetime maintenance, routine patch management, bug resolution, and operational support per your signed agreement.
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Dedicated Helpline</p>
            <a
              href="tel:+918989828902"
              className="text-sm font-bold text-emerald-400 hover:text-emerald-300 mt-0.5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall size={14} /> +91 89898 28902
            </a>
            <p className="text-[10px] text-slate-500 mt-1">24x7 Priority Support</p>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Active Maintenance Contracts ({contracts.length})
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading AMC agreements...</div>
        ) : contracts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <ShieldCheck size={32} className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-bold text-white">No active AMC records found</p>
            <p className="text-xs text-slate-400 mt-1">
              Contact your Digikhojindia account manager to register your software maintenance contract.
            </p>
          </div>
        ) : (
          contracts.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-blue-400">{c.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{c.software_name}</h4>
                  <p className="text-xs text-slate-400">Coverage Type: <span className="text-slate-300 font-medium">{c.coverage_type}</span></p>
                </div>

                <div className="flex items-center gap-6 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Effective From</span>
                    <span className="text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                      <Calendar size={13} className="text-blue-400" /> {formatDate(c.start_date)}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-800" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Valid Until</span>
                    <span className="text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                      <Clock size={13} className="text-emerald-400" /> {formatDate(c.end_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coverage Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <CheckCircle2 size={15} /> Included Services
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {(c.included_services || [
                      'Bug fixes and emergency patch deployment',
                      'Weekly automated database backup health audit',
                      'OS & runtime security updates',
                      'Telephonic and ticket-based technical helpdesk',
                      'Quarterly preventative performance review',
                    ]).map((svc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{svc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <AlertTriangle size={15} /> Excluded Services (Require Change Order)
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {(c.excluded_services || [
                      'New module development and major feature requests',
                      'Third-party SMS/WhatsApp/Cloud infrastructure costs',
                      'Physical hardware/CCTV physical repairs and replacements',
                      'Reinstallation resulting from unauthorized database tampering',
                    ]).map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X size={14} className="text-rose-400 mt-0.5 shrink-0" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {c.notes && (
                <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2">
                  <FileText size={15} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-blue-300">Contract Notes: </span>
                    {c.notes}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

