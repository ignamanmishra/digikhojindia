import React, { useState } from 'react';
import { apiRequest, setAuthToken } from '../api';
import { BRAND_CONSTANTS } from '@digikhojindia/shared';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('info@digikhojindia.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuthToken(res.token);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-white">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-lg shadow-blue-500/20">
            D
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{BRAND_CONSTANTS.COMPANY_NAME}</h1>
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mt-1">Enterprise Admin Cockpit</p>
          <p className="text-[11px] text-slate-400 mt-2">Owner: {BRAND_CONSTANTS.OWNER_NAME}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/40 rounded-xl text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Administrative Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Secure Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-xs mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Operations Cockpit'}
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Quick Credentials Picker */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">Quick Demo Accounts (Pre-configured):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmail('info@digikhojindia.com');
                setPassword('Password123!');
              }}
              className="p-2 bg-slate-800/80 hover:bg-slate-800 text-left rounded-lg border border-slate-700 text-slate-300"
            >
              <strong className="block text-white">Super Admin</strong>
              <span>info@digikhojindia.com</span>
            </button>
            <button
              onClick={() => {
                setEmail('support@digikhojindia.com');
                setPassword('Password123!');
              }}
              className="p-2 bg-slate-800/80 hover:bg-slate-800 text-left rounded-lg border border-slate-700 text-slate-300"
            >
              <strong className="block text-white">Support Lead</strong>
              <span>support@digikhojindia.com</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-center text-slate-500">
          {BRAND_CONSTANTS.FOOTER_COPYRIGHT} {BRAND_CONSTANTS.FOOTER_OWNERSHIP}
        </p>

      </div>
    </div>
  );
};
