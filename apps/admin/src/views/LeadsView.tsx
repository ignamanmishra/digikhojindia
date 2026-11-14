import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { Lead, LeadStage } from '@digikhojindia/types';
import { formatCurrencyINR } from '@digikhojindia/shared';
import { Plus, Target, Phone, Mail, ArrowRight } from 'lucide-react';

const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export const LeadsView: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    source: 'Website Enquiry' as const,
    stage: 'New' as const,
    estimated_value: 150000,
    notes: '',
  });

  const fetchLeads = () => {
    setLoading(true);
    apiRequest('/crm/leads')
      .then((res) => setLeads(res.leads || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/crm/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowAddModal(false);
      fetchLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAdvanceStage = async (leadId: string, currentStage: LeadStage) => {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 2) { // Won is next
      const nextStage = stages[currentIndex + 1];
      try {
        await apiRequest(`/crm/leads/${leadId}/stage`, {
          method: 'PATCH',
          body: JSON.stringify({ stage: nextStage }),
        });
        fetchLeads();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">CRM Sales Pipeline</h2>
          <p className="text-xs text-slate-500">Track and nurture incoming business opportunities across funnel stages</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Pipeline Columns Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto min-h-[500px]">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          const stageValue = stageLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);

          return (
            <div key={stage} className="bg-slate-100/70 rounded-xl p-3 flex flex-col border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{stage}</h4>
                  <span className="text-[10px] text-slate-500">{stageLeads.length} leads</span>
                </div>
                {stageValue > 0 && (
                  <span className="text-[10px] font-mono font-bold text-slate-700">
                    {formatCurrencyINR(stageValue)}
                  </span>
                )}
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {stageLeads.map((l) => (
                  <div key={l.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1.5">
                    <div className="flex items-start justify-between">
                      <strong className="font-bold text-slate-900 leading-tight">{l.company_name}</strong>
                    </div>
                    <p className="text-[11px] text-slate-600">{l.name}</p>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1"><Phone size={10} /> <span>{l.phone}</span></div>
                      <div className="flex items-center gap-1"><Mail size={10} /> <span className="truncate">{l.email}</span></div>
                    </div>
                    {l.estimated_value ? (
                      <p className="text-[11px] font-mono font-bold text-emerald-600 pt-1">
                        Est: {formatCurrencyINR(l.estimated_value)}
                      </p>
                    ) : null}
                    
                    {stage !== 'Won' && stage !== 'Lost' && (
                      <button
                        onClick={() => handleAdvanceStage(l.id, l.stage)}
                        className="w-full mt-2 pt-1.5 border-t border-slate-100 text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                      >
                        <span>Advance Stage</span>
                        <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add New CRM Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Hospital Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Apollo Speciality Clinic"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Verma"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Website Enquiry">Website Enquiry</option>
                    <option value="Demo Request">Demo Request</option>
                    <option value="Quote Request">Quote Request</option>
                    <option value="Google Business Profile">Google Business Profile</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct">Direct Contact</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimated Deal Value (INR ₹)</label>
                <input
                  type="number"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

