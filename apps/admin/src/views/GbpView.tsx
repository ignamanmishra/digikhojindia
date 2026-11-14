import React from 'react';
import { MapPin, ShieldAlert, CheckCircle2, Star, Search } from 'lucide-react';

export const GbpView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Notice Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <ShieldAlert size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-white">Google Business Profile Compliance Standard:</strong>
          <p className="mt-0.5 text-slate-400">
            Per policy guidelines (Section 18), Digikhojindia connects exclusively via official Google OAuth 2.0 scopes. We never store raw Google passwords, and we strictly enforce genuine review tracking with zero synthetic reviews or automated spam.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Verified Business Entity
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>OAuth Configured</span>
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">Digikhojindia Corporate HQ</h3>
            <p className="text-xs text-slate-500">Software development, business automation, and hospital IT solutions</p>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <p><strong className="text-slate-900">Primary Category:</strong> Software Company / Information Technology Service</p>
            <p><strong className="text-slate-900">Secondary Categories:</strong> Hospital Equipment Automation, Website Designer, Computer Support</p>
            <p><strong className="text-slate-900">Official Email:</strong> info@digikhojindia.com</p>
            <p><strong className="text-slate-900">Service Radius:</strong> National & Global Remote Operations</p>
          </div>
        </div>

        {/* Local SEO & GEO Audit Checklist */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Local SEO & Generative Engine Optimization (GEO) Status</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <span>Schema.org Organization Graph:</span>
              <span className="font-semibold text-emerald-600">✓ Validated</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <span>NAP (Name, Address, Phone) Consistency:</span>
              <span className="font-semibold text-emerald-600">✓ 100% Synced</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <span>AI Answer Engine Entity Citations (GEO):</span>
              <span className="font-semibold text-blue-600">Active</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <span>Robots.txt & XML Sitemaps:</span>
              <span className="font-semibold text-emerald-600">✓ Generated</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
