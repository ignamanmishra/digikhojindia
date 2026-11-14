import React, { useState } from 'react';
import { apiRequest, setAuthToken } from '../api';
import { BRAND_CONSTANTS } from '@digikhojindia/shared';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo, GlassButton, GlassInput } from '@digikhojindia/ui';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@digikhojindia.com');
  const [password, setPassword] = useState('SuperAdmin@2026!');
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

  const setFastCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#080D20] text-slate-100 flex flex-col justify-between p-4 relative overflow-hidden">
      {/* Ambient Animated Blurred Lights */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#287BFF]/20 via-[#42DDF5]/15 to-transparent blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#9B70FF]/25 via-[#F078C8]/15 to-transparent blur-[120px] animate-pulse-slow" />
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-8">
        {/* Brand Header with Official Emblem */}
        <div className="text-center mb-8 space-y-3">
          <BrandLogo size="lg" variant="full" glow={true} className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles size={12} className="text-cyan-400" />
            <span>Enterprise Admin Cockpit</span>
          </div>
          <p className="text-xs text-slate-400">
            Sign in to access platform operations, customer CRM, and cloud telemetry
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 mb-6 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cyan-300 font-heading">
              <ShieldCheck size={14} className="text-cyan-400" /> Demo Admin Access
            </span>
            <span className="text-[10px] text-slate-400 font-mono">100k PBKDF2 Secure</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFastCredentials('admin@digikhojindia.com', 'SuperAdmin@2026!')}
              className={`p-2 rounded-xl text-left border transition-all ${
                email === 'admin@digikhojindia.com'
                  ? 'bg-blue-600/25 border-cyan-400 text-cyan-200'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <span className="font-bold block text-[11px] truncate">Super Admin</span>
              <span className="text-[10px] text-slate-400 block truncate">admin@digikhojindia...</span>
            </button>
            <button
              type="button"
              onClick={() => setFastCredentials('info@digikhojindia.com', 'Password123!')}
              className={`p-2 rounded-xl text-left border transition-all ${
                email === 'info@digikhojindia.com'
                  ? 'bg-blue-600/25 border-cyan-400 text-cyan-200'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <span className="font-bold block text-[11px] truncate">Staff Lead</span>
              <span className="text-[10px] text-slate-400 block truncate">info@digikhojindia...</span>
            </button>
          </div>
        </div>

        {/* Liquid Glass Login Dialog */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#102B50]/60 to-[#080D20]/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(66,221,245,0.15)] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-5 flex items-center gap-2">
              <span>•</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Staff Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@digikhojindia.com"
              iconPrefix={<Mail size={16} />}
            />

            <GlassInput
              label="System Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              iconPrefix={<Lock size={16} />}
            />

            <div className="pt-2">
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
              >
                <span>Authorize & Enter Cockpit</span>
                <ArrowRight size={15} />
              </GlassButton>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400">
              Need technical access? Contact{' '}
              <a href={`mailto:${BRAND_CONSTANTS.OFFICIAL_EMAIL}`} className="text-cyan-400 hover:underline">
                {BRAND_CONSTANTS.OFFICIAL_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Brand Ownership Footer */}
      <footer className="text-center py-4 border-t border-white/10 text-xs text-slate-400 space-y-0.5">
        <p>© Digikhojindia. All Rights Reserved. Owned by Naman Mishra.</p>
        <p className="text-[11px] text-slate-500 italic">
          "Technology की हर नई खोज, आपके लिए!"
        </p>
      </footer>
    </div>
  );
};
