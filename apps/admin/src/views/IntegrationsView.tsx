import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { Cpu, AlertCircle, Key, CheckCircle2 } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/integrations')
      .then((res) => setIntegrations(res.integrations || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTestIntegration = async (provider: string) => {
    try {
      await apiRequest(`/integrations/${provider}/test`, { method: 'POST' });
      alert(`Integration test successful!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Policy Box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Credential Integrity Protocol (Section 19):</strong>
          <p className="mt-0.5 text-amber-800">
            Digikhojindia never simulates artificial delivery when third-party gateways are not authenticated. All external API connectors below are ready for plug-and-play activation as soon as the respective API keys are added in Cloudflare environment secrets or .env.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Third-Party Gateway Integrations</h2>
          <p className="text-xs text-slate-500">Configure email, messaging, SMS, and search engine API bindings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div key={item.provider} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{item.provider}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.is_connected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status_label}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Required Environment Secrets</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.required_keys?.map((k: string) => (
                    <span key={k} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      🔑 {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Connection: Inactive</span>
              <button
                onClick={() => handleTestIntegration(item.provider)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Test Gateway Ping
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

