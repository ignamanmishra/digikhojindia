import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { Invoice } from '@digikhojindia/types';
import { formatCurrencyINR } from '@digikhojindia/shared';
import { Receipt, Plus, CreditCard, CheckCircle2, Clock } from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // New Invoice Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    customer_id: 'DKI-100001',
    issue_date: '2026-11-14',
    due_date: '2026-11-30',
    discount_amount: 0,
    items: [
      {
        description: 'HMIS Software Implementation & Licensing',
        quantity: 1,
        unit_price: 100000,
        gst_rate: 18,
      },
    ],
  });

  // Record Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    payment_method: 'Bank Transfer' as const,
    reference_number: '',
    payment_date: '2026-11-14',
  });

  const fetchInvoices = () => {
    setLoading(true);
    apiRequest('/invoices')
      .then((res) => setInvoices(res.invoices || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/invoices', {
        method: 'POST',
        body: JSON.stringify(newInvoiceData),
      });
      setShowCreateModal(false);
      fetchInvoices();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await apiRequest(`/invoices/${selectedInvoice.id}/payments`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      setShowPaymentModal(false);
      fetchInvoices();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Invoices & GST Billing</h2>
          <p className="text-xs text-slate-500">Generate tax invoices, track payment status, and reconcile dues</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Generate Tax Invoice</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Invoice ID</th>
                <th className="p-3.5 border-b border-slate-200">Customer Organization</th>
                <th className="p-3.5 border-b border-slate-200">Issue / Due Date</th>
                <th className="p-3.5 border-b border-slate-200">Subtotal</th>
                <th className="p-3.5 border-b border-slate-200">GST (18%)</th>
                <th className="p-3.5 border-b border-slate-200">Total Amount</th>
                <th className="p-3.5 border-b border-slate-200">Balance Due</th>
                <th className="p-3.5 border-b border-slate-200">Status</th>
                <th className="p-3.5 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{inv.id}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-900">{inv.customer_name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{inv.customer_gstin || 'Unregistered'}</p>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <p>{inv.issue_date}</p>
                    <p className="text-[11px] text-slate-400">Due: {inv.due_date}</p>
                  </td>
                  <td className="p-3.5 text-slate-700">{formatCurrencyINR(inv.subtotal)}</td>
                  <td className="p-3.5 text-slate-700">{formatCurrencyINR(inv.tax_amount)}</td>
                  <td className="p-3.5 font-bold text-slate-900">{formatCurrencyINR(inv.total_amount)}</td>
                  <td className="p-3.5 font-bold text-rose-600">{formatCurrencyINR(inv.balance_due)}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      inv.status === 'Sent' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {inv.balance_due > 0 && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentData({ ...paymentData, amount: inv.balance_due });
                          setShowPaymentModal(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        + Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Generate GST Tax Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Customer ID *</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.customer_id}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customer_id: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.issue_date}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, issue_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.due_date}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, due_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Item Description *</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.items[0].description}
                  onChange={(e) => {
                    const items = [...newInvoiceData.items];
                    items[0].description = e.target.value;
                    setNewInvoiceData({ ...newInvoiceData, items });
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={newInvoiceData.items[0].unit_price}
                    onChange={(e) => {
                      const items = [...newInvoiceData.items];
                      items[0].unit_price = Number(e.target.value);
                      setNewInvoiceData({ ...newInvoiceData, items });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GST Rate</label>
                  <input
                    type="text"
                    disabled
                    value="18% (Standard GST)"
                    className="w-full p-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrencyINR(newInvoiceData.items[0].unit_price)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%):</span>
                  <span className="font-mono">{formatCurrencyINR((newInvoiceData.items[0].unit_price * 18) / 100)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>Total Payable:</span>
                  <span className="font-mono text-emerald-700">
                    {formatCurrencyINR(newInvoiceData.items[0].unit_price * 1.18)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Record Payment: {selectedInvoice.id}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount Received (INR ₹) *</label>
                <input
                  type="number"
                  required
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-base font-bold text-emerald-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentData.payment_method}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={paymentData.payment_date}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Bank Reference / UTR Number</label>
                <input
                  type="text"
                  value={paymentData.reference_number}
                  onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
                  placeholder="e.g. UTR123456789"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

