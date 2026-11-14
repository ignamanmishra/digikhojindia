import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { setPortalToken } from '../api';

interface PortalLoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const PortalLoginView: React.FC<PortalLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('rajesh@cityhospital.com');
  const [password, setPassword] = useState('Customer@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8787/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setPortalToken(data.token);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Customer@12345');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6">
      <div className="max-w-md w-full mx-auto my-auto py-12">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-xl mb-4">
            D
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">DIGIKHOJINDIA</h1>
          <p className="text-xs uppercase tracking-widest text-blue-400 font-bold mt-1">
            Enterprise Customer Support Portal
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Secure client cockpit for ticketing, AMC status, and project tracking
          </p>
        </div>

        {/* Demo Fast-Login Pill */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-6 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-400" /> Demo Client Accounts
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Password: Customer@12345</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('rajesh@cityhospital.com')}
              className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                email === 'rajesh@cityhospital.com'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="font-bold block truncate">City Hospital</span>
              <span className="text-[10px] text-slate-500 block truncate">rajesh@cityhospital.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('contact@apexdiagnostics.com')}
              className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                email === 'contact@apexdiagnostics.com'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="font-bold block truncate">Apex Diagnostics</span>
              <span className="text-[10px] text-slate-500 block truncate">contact@apex...</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {error && (
            <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Customer Cockpit</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Need assistance? Email{' '}
              <a href="mailto:info@digikhojindia.com" className="text-blue-400 hover:underline">
                info@digikhojindia.com
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Brand Footer */}
      <footer className="text-center py-4 border-t border-slate-900 text-xs text-slate-500">
        <p>© Digikhojindia. All Rights Reserved. Owned by Naman Mishra.</p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          "We Don't Just Build Software. We Automate Your Entire Business."
        </p>
      </footer>
    </div>
  );
};
