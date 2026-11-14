import React, { useEffect, useState } from 'react';
import { portalRequest } from '../api';
import { Laptop, ExternalLink, CheckCircle2, Shield } from 'lucide-react';

export const PortalSoftwareView: React.FC<{ customerId: string }> = ({ customerId }) => {
  const [software, setSoftware] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalRequest(`/customers/${customerId}`)
      .then((res) => setSoftware(res.software || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Deployed Software Applications</h2>
        <p className="text-xs text-slate-500">Active software modules, licenses, and direct URLs for your institution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {software.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{s.product_id}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{s.product_name}</h3>
                <p className="text-xs text-slate-500">Current Version: <span className="font-mono font-semibold">{s.version}</span></p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Active</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Deployment URL</span>
              <p className="font-mono text-blue-600 truncate">{s.deployed_url || 'https://internal-server.hospital-erp.local'}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Installed: {new Date(s.installed_at).toLocaleDateString()}</span>
              {s.deployed_url && (
                <a
                  href={s.deployed_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Launch Application</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

