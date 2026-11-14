import React from 'react';
import { BRAND_CONSTANTS } from '@digikhojindia/shared';
import { Settings, Shield, Globe } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-base font-bold text-slate-900">Platform Global Settings</h2>
        <p className="text-xs text-slate-500">Core company attributes, brand propositions, and environment bindings</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Company Information & Attribution</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 block mb-1">Company Name</label>
            <input type="text" readOnly value={BRAND_CONSTANTS.COMPANY_NAME} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Owner & Founder</label>
            <input type="text" readOnly value={BRAND_CONSTANTS.OWNER_NAME} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Official Email</label>
            <input type="text" readOnly value={BRAND_CONSTANTS.OFFICIAL_EMAIL} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Domain Configuration</label>
            <input type="text" readOnly value="Configurable via Environment Variables (DNS not hardcoded)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
          </div>
        </div>

        <div className="pt-2 text-xs">
          <label className="text-slate-500 block mb-1">Brand Statement / Tagline</label>
          <input type="text" readOnly value={BRAND_CONSTANTS.TAGLINE} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold" />
        </div>

        <div className="pt-2 text-xs">
          <label className="text-slate-500 block mb-1">Mandatory Footer Copyright Requirement</label>
          <input type="text" readOnly value={`${BRAND_CONSTANTS.FOOTER_COPYRIGHT} ${BRAND_CONSTANTS.FOOTER_OWNERSHIP}`} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Cloudflare Infrastructure Bindings</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Cloudflare D1 Relational Engine</p>
              <p className="text-[11px] text-slate-500">Binding name: <span className="font-mono">env.DB</span> (SQLite migration 0001 active)</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Connected</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Cloudflare R2 Secure Object Storage</p>
              <p className="text-[11px] text-slate-500">Bucket: <span className="font-mono">digikhojindia-assets</span></p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

