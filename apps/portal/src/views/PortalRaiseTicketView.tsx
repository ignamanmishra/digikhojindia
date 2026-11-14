import React, { useState } from 'react';
import { portalRequest } from '../api';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface PortalRaiseTicketViewProps {
  onSuccess: (ticketId: string) => void;
  customerId: string;
}

export const PortalRaiseTicketView: React.FC<PortalRaiseTicketViewProps> = ({ onSuccess, customerId }) => {
  const [formData, setFormData] = useState({
    customer_id: customerId,
    subject: '',
    description: '',
    category: 'Software Issue' as const,
    priority: 'Medium' as const,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  const categories = [
    'Software Issue',
    'Bug Report',
    'Feature Request',
    'Website Issue',
    'Server Issue',
    'Networking Issue',
    'CCTV Issue',
    'Automation Issue',
    'Billing Issue',
    'Other',
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await portalRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setCreatedTicket(res.ticket);
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  if (createdTicket) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-slate-900">Complaint Logged Successfully!</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Your ticket ID is <span className="font-mono font-bold text-blue-600 text-sm">{createdTicket.id}</span>.
          Our technical engineers have received this ticket under your <strong className="text-slate-800">{createdTicket.priority} Priority SLA</strong>.
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono">
          Target SLA Resolution: {new Date(createdTicket.sla_due_at).toLocaleString('en-IN')}
        </div>
        <div className="pt-2">
          <button
            onClick={() => onSuccess(createdTicket.id)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-colors inline-flex items-center gap-1.5"
          >
            <span>Open Ticket Thread & Replies</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">Raise Technical Complaint / Request</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit an issue ticket directly to Digikhojindia's assigned technical engineering team
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Issue Subject / Summary *</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. OPD Reception thermal printer integration freezing on print"
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Issue Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Severity / Priority *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Critical">Critical (System Outage / 4h SLA)</option>
              <option value="High">High (Major Feature Blocked / 12h SLA)</option>
              <option value="Medium">Medium (General Operational Query / 24h SLA)</option>
              <option value="Low">Low (Cosmetic / Template Request / 48h SLA)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Detailed Description & Steps to Reproduce *</label>
          <textarea
            rows={5}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Please detail: what action was performed, the error message shown, which counter/terminal it occurred on, and whether it affects OPD/IPD billing..."
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-xs"
        >
          {loading ? 'Submitting to Technical Queue...' : 'Submit Complaint to Engineers →'}
        </button>
      </form>
    </div>
  );
};

