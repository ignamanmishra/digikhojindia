import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { SoftwareProduct } from '@digikhojindia/types';
import { Layers, ShieldCheck, Check } from 'lucide-react';

export const SoftwareView: React.FC = () => {
  const [products, setProducts] = useState<SoftwareProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/cms/software')
      .then((res) => setProducts(res.products || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Software Products & Modules</h2>
          <p className="text-xs text-slate-500">Master product catalog supporting multi-tenant customer deployments</p>
        </div>
        <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
          🛡️ All Initial Software Configurations Marked as Sample / Demo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{p.category}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  Sample / Demo
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{p.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{p.short_description}</p>
              
              <div className="space-y-1 mb-4">
                {p.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <Check size={12} className="text-blue-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[10px]">{p.id}</span>
              <span className="text-emerald-600 font-semibold text-[11px]">Ready for Deployment</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
