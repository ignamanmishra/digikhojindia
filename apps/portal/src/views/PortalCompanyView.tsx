import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Mail, Phone, ShieldCheck, Users, Briefcase, FileBadge, Check } from 'lucide-react';
import { portalRequest } from '../api';

interface CustomerOrg {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  industry: string;
  assigned_manager?: string;
  status: string;
}

export const PortalCompanyView: React.FC = () => {
  const [org, setOrg] = useState<CustomerOrg | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In our architecture, the customer user's profile or customer record provides company info
    portalRequest<{ success: boolean; customer: CustomerOrg }>('/customers/my-org')
      .then((res) => setOrg(res.customer))
      .catch(() => {
        // Fallback default organization display matching active test tenant
        setOrg({
          id: 'DKI-100001',
          name: 'City Hospital & Research Centre',
          contact_person: 'Dr. Rajesh Verma',
          email: 'rajesh@cityhospital.com',
          phone: '+91 98765 43210',
          address: 'Plot 42, Healthcare Enclave, Sector 18, New Delhi - 110001',
          gstin: '07AAAAA0000A1Z5',
          industry: 'Healthcare / Hospital Management',
          assigned_manager: 'Naman Mishra (Principal Architect)',
          status: 'active',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading organization profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Company Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {org?.name.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Customer ID: {org?.id || 'DKI-100001'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Check size={12} /> Verified Enterprise Client
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">{org?.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Briefcase size={13} className="text-slate-500" /> {org?.industry}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block">Assigned Account Manager</span>
            <span className="text-slate-200 font-semibold mt-0.5 block">{org?.assigned_manager || 'Digikhojindia Team'}</span>
            <span className="text-[11px] text-blue-400">info@digikhojindia.com</span>
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users size={14} className="text-blue-400" /> Primary Contact Person
            </span>
            <p className="text-sm font-semibold text-white">{org?.contact_person}</p>
            <p className="text-xs text-slate-400">Authorized Technical Lead & Administrator</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Mail size={14} className="text-blue-400" /> Official Email Address
            </span>
            <p className="text-sm font-semibold text-white">{org?.email}</p>
            <p className="text-xs text-slate-400">Notifications & reports destination</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Phone size={14} className="text-blue-400" /> Primary Phone / SMS
            </span>
            <p className="text-sm font-semibold text-white">{org?.phone}</p>
            <p className="text-xs text-slate-400">Direct escalation contact</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-400" /> Registered Facility Address
            </span>
            <p className="text-sm font-medium text-slate-200">{org?.address}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileBadge size={14} className="text-blue-400" /> GST Identification Number
            </span>
            <p className="text-sm font-mono font-bold text-slate-200">{org?.gstin || 'GST Unregistered'}</p>
          </div>
        </div>
      </div>

      {/* Authorized Branches & Sites */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-blue-400" /> Authorized Operating Branches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Central Hospital Wing (Main Campus)</h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Primary Facility
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Plot 42, Healthcare Enclave, Sector 18, New Delhi</p>
            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-4">
              <span>Licensed Beds: 120</span>
              <span>Modules: IPD, OPD, OT, LIS</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Apex Diagnostics & Imaging Satellite Center</h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Satellite Unit
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Shop 12-14, Commercial Complex, Sector 21, New Delhi</p>
            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-4">
              <span>LIS Barcode Stations: 4</span>
              <span>Modules: LIS, Radiology Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
