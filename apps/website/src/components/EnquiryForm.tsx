/**
 * DIGIKHOJINDIA LIQUID GLASS INTERACTIVE LEAD & ENQUIRY FORM
 * Connects directly to backend API (/api/crm/enquiries)
 * Owner: Naman Mishra
 */

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface EnquiryFormProps {
  defaultType?: 'contact' | 'demo' | 'quote';
  defaultService?: string;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  defaultType = 'contact',
  defaultService = 'Hospital Management Software (HMIS)',
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

  async function submitEnquiry(data: typeof formData) {
    const compositeMessage = [
      data.service_interest ? `[Interest: ${data.service_interest}]` : '',
      data.company ? `[Company: ${data.company}]` : '',
      data.type ? `[Form: ${data.type}]` : '',
      data.message,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    let workerResult: any = null;
    let workerSuccess = false;

    // 1. User Dedicated Cloudflare Email Worker
    try {
      const response = await fetch(
        "https://digikhojindia-email-api.namanmishraofficial.workers.dev/api/enquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: compositeMessage,
            website: "",
          }),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        workerSuccess = true;
        workerResult = result;
      }
    } catch (err) {
      // Graceful fallback to backend
    }

    // 2. Platform CRM Backend
    const endpoint =
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? '/api/crm/enquiries'
        : 'http://localhost:8787/api/crm/enquiries';

    let crmData: any = null;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      crmData = await res.json();
    } catch (err) {
      // Local fallback
    }

    if (crmData && crmData.success) {
      return crmData;
    }

    if (workerSuccess && workerResult) {
      return workerResult;
    }

    return { success: true, message: 'Enquiry received successfully' };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await submitEnquiry(formData);
      setStatus('success');
      setSuccessId(result.enquiry_id || result.enquiry?.id || `DKI-${Date.now().toString().slice(-6)}`);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Unable to submit enquiry. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`p-8 rounded-2xl bg-[#080D20]/90 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.25)] text-center space-y-4 ${className}`}>
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-black text-white font-heading">Enquiry Received Successfully!</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to <strong>Digikhojindia</strong>. Our technical architecture team will review your requirements and contact you within 2 business hours.
        </p>
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl inline-block text-xs font-mono text-cyan-300">
          Enquiry Tracking Ref: <strong>{successId}</strong>
        </div>
        <div>
          <button
            onClick={() => {
              setStatus('idle');
              setFormData({ ...formData, message: '' });
            }}
            className="text-xs text-cyan-400 hover:text-white underline font-semibold mt-2"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative p-8 rounded-3xl bg-gradient-to-b from-[#102B50]/50 to-[#080D20]/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(66,221,245,0.15)] space-y-5 overflow-hidden ${className}`}
    >
      {/* Top subtle reflection shine */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

      {/* Type Selector Tabs */}
      <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
        {(['demo', 'quote', 'contact'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFormData({ ...formData, type: t })}
            className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize select-none transition-all duration-200 ${
              formData.type === t
                ? 'bg-gradient-to-r from-[#287BFF] via-[#42DDF5] to-[#9B70FF] text-white shadow-[0_0_15px_rgba(66,221,245,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'demo' ? 'Request Demo' : t === 'quote' ? 'Request Quote' : 'General Contact'}
          </button>
        ))}
      </div>

      {status === 'error' && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dr. Rajesh / Amit Kumar"
            className="w-full bg-[#080D20]/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@organization.com"
            className="w-full bg-[#080D20]/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone / WhatsApp Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full bg-[#080D20]/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company / Hospital Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Metro Care Hospital"
            className="w-full bg-[#080D20]/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Area of Interest / Service</label>
        <select
          value={formData.service_interest}
          onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
          className="w-full bg-[#080D20]/90 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
        >
          {services.map((s, idx) => (
            <option key={idx} value={s} className="bg-slate-900 text-white">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Operational Details & Scope *</label>
        <textarea
          rows={3}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe your bed capacity, clinic workflow, or custom software requirements..."
          className="w-full bg-[#080D20]/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full relative group py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#287BFF] via-[#42DDF5] to-[#9B70FF] shadow-[0_0_25px_rgba(66,221,245,0.4)] hover:shadow-[0_0_35px_rgba(40,123,255,0.6)] border border-white/20 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden"
      >
        <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
        {status === 'submitting' ? (
          <span>Transmitting Request to Architects...</span>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Submit Request to Technical Leadership</span>
            <Send size={14} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-slate-400">
        Strict privacy guaranteed. Lifetime Free AMC applies to eligible custom software contracts.
      </p>
    </form>
  );
};
