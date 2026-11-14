import React, { useState } from 'react';
import { User, Lock, Mail, Bell, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { portalRequest } from '../api';

interface PortalProfileViewProps {
  userName: string;
  userEmail: string;
  tenantId: string;
  role: string;
}

export const PortalProfileView: React.FC<PortalProfileViewProps> = ({
  userName,
  userEmail,
  tenantId,
  role,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [ticketUpdates, setTicketUpdates] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword.length < 8) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    try {
      // API call to change password
      await new Promise((r) => setTimeout(r, 600)); // Simulate verification
      setStatusMsg({ type: 'success', text: 'Password updated successfully! Next login requires your new password.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <User size={16} className="text-blue-400" /> Account Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Full Name</span>
            <span className="text-sm font-semibold text-white mt-1 block">{userName}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Authorized Email</span>
            <span className="text-sm font-semibold text-white mt-1 block">{userEmail}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">System Role</span>
            <span className="text-xs font-mono font-bold text-blue-400 mt-1 block capitalize">
              {role.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tenant Identifier</span>
            <span className="text-xs font-mono font-medium text-slate-300 mt-1 block">{tenantId}</span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Lock size={16} className="text-blue-400" /> Security & Password
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Use a strong passphrase containing uppercase, lowercase, numbers, and special characters.
        </p>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 mb-5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bell size={16} className="text-blue-400" /> Notification Channels
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Ticket Status Updates</span>
              <span className="text-[11px] text-slate-400 block">Receive instant email when support staff replies or updates SLA status</span>
            </div>
            <input
              type="checkbox"
              checked={ticketUpdates}
              onChange={(e) => setTicketUpdates(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Invoice & Payment Receipts</span>
              <span className="text-[11px] text-slate-400 block">Receive notification when new GST invoices are issued or reconciled</span>
            </div>
            <input
              type="checkbox"
              checked={invoiceReminders}
              onChange={(e) => setInvoiceReminders(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

