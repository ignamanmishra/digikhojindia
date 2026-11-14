/**
 * DIGIKHOJINDIA INTERACTIVE LEAD & ENQUIRY FORM
 * Connects directly to backend API (/api/crm/enquiries)
 * Owner: Naman Mishra
 */

import React, { useState } from 'react';

interface EnquiryFormProps {
  defaultType?: 'contact' | 'demo' | 'quote';
  defaultService?: string;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  defaultType = 'contact',
  defaultService = 'Hospital Management Software',
  className = '',
}) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    name: '',
    email: '',
    phone: '',
    company: '',
    service_interest: defaultService,
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successId, setSuccessId] = useState('');

  const services = [
    'Hospital Management Software (HMIS)',
    'Custom Software Development',
    'Business Process Automation',
    'CRM & Lead Management System',
    'Laboratory LIS Analyzer Interfacing',
    'Asset Management & Maintenance Portal',
    'WhatsApp, SMS & IVR Automation',
    'Website & Cloud Web Application',
    'Google Business Profile & SEO Optimization',
    'IT Infrastructure & Server Support',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:8787/api/crm/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setStatus('success');
      setSuccessId(data.enquiry_id);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Submission error. Please email info@digikhojindia.com');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-8 text-center text-white">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-emerald-400 mb-2">Thank You for Connecting!</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-4">
          Your enquiry has been received by our technical solutions team (Ref: <span className="font-mono text-emerald-300 font-bold">{successId}</span>).
          A senior engineer will connect with you within 2-4 business hours.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setFormData({
              type: defaultType,
              name: '',
              email: '',
              phone: '',
              company: '',
              service_interest: defaultService,
              message: '',
            });
          }}
          className="text-xs font-semibold px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl ${className}`}>
      
      {/* Type Toggle */}
      <div className="flex rounded-lg bg-slate-800/80 p-1 mb-6">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'demo' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            formData.type === 'demo' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Request Demo
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'quote' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            formData.type === 'quote' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Get Quote
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'contact' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            formData.type === 'contact' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          General Contact
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Dr. Ramesh Sharma"
            className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Official Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. admin@cityhospital.com"
            className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Hospital / Organization Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. City Care Multi-Speciality Hospital"
            className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-300 mb-1">Primary Software or Service of Interest *</label>
        <select
          value={formData.service_interest}
          onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
          className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-300 mb-1">Requirement Details / Message *</label>
        <textarea
          rows={3}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe your requirements, bed capacity, daily footfall, or specific workflows you want to automate..."
          className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-900/40 border border-red-500/40 rounded-lg text-xs text-red-300">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting...' : 'Send Request to Technical Team →'}
      </button>

      <p className="mt-3 text-[11px] text-center text-slate-400">
        Protected by Cloudflare Edge Security. We respect your privacy.
      </p>
    </form>
  );
};
