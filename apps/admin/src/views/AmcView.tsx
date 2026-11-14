import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { AmcContract } from '@digikhojindia/types';
import { ShieldCheck, Plus, AlertCircle, FileText, CheckCircle } from 'lucide-react';

export const AmcView: React.FC = () => {
  const [contracts, setContracts] = useState<AmcContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: 'DKI-100001',
    software_id: 'prod-hmis',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    is_lifetime_free: true,
    contract_terms: 'Lifetime Free AMC covers bug fixes, performance tuning, and backup checks.',
    coverage_details: ['HMIS Core Modules', 'OPD/IPD Billing', 'EHR System'],
    included_services: ['4h SLA Response', 'Weekly Database Maintenance', 'Security Patches'],
    excluded_services: ['Third-party SMS/WhatsApp gateway costs', 'New feature additions'],
  });

  const fetchContracts = () => {
    setLoading(true);
    apiRequest('/amc/contracts')
      .then((res) => setContracts(res.contracts || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleCreateAmc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/amc/contracts', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowAddModal(false);
      fetchContracts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Policy Reminder Banner (Section 10) */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Official Marketing Proposition:</strong> "Lifetime Free AMC – Subject to agreed contract terms."
          <p className="text-blue-700 mt-0.5">
            Note: Lifetime AMC covers continuous software defect patching, index tuning, and database health. It does not include free unlimited new feature development or third-party telecommunication gateway costs unless explicitly specified in the contract.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Active AMC Contracts</h2>
          <p className="text-xs text-slate-500">Monitor annual maintenance agreements, software coverage, and renewal schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Register AMC Contract</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600">{c.id}</span>
                  {c.is_lifetime_free && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Lifetime Free AMC
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{c.customer_name}</h3>
                <p className="text-xs text-slate-500">{c.software_name || 'Infrastructure Maintenance'}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contract Start</span>
                <p className="font-medium text-slate-800">{c.start_date}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contract End</span>
                <p className="font-medium text-slate-800">{c.end_date}</p>
              </div>
            </div>

            <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Included Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.included_services?.map((svc, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      ✓ {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Contractual Exclusions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.excluded_services?.map((exc, i) => (
                    <span key={i} className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-medium">
                      ✕ {exc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER AMC MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register AMC Contract</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateAmc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Customer ID *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  placeholder="e.g. DKI-100001"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <input
                  type="checkbox"
                  id="lifetime_amc"
                  checked={formData.is_lifetime_free}
                  onChange={(e) => setFormData({ ...formData, is_lifetime_free: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="lifetime_amc" className="text-xs font-semibold text-blue-900">
                  Lifetime Free AMC (Subject to agreed terms)
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contract Terms Summary</label>
                <textarea
                  rows={2}
                  value={formData.contract_terms}
                  onChange={(e) => setFormData({ ...formData, contract_terms: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow"
                >
                  Register Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

