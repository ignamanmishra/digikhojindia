import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { Customer } from '@digikhojindia/types';
import { Users, Plus, Shield, Search, ExternalLink, Laptop } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_person: '',
    email: '',
    phone: '',
    type: 'hospital' as const,
    city: '',
    state: 'Uttar Pradesh',
    gstin: '',
    initial_password: 'Password123!',
    notes: '',
  });

  // Assign Software Modal state
  const [showSoftwareModal, setShowSoftwareModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [softwareData, setSoftwareData] = useState({
    product_id: 'prod-hmis',
    product_name: 'Hospital Management System (HMIS)',
    version: '3.2.0',
    deployed_url: '',
  });

  const [createdInfo, setCreatedInfo] = useState<any>(null);

  const fetchCustomers = () => {
    setLoading(true);
    apiRequest('/customers')
      .then((res) => setCustomers(res.customers || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setCreatedInfo(res);
      fetchCustomers();
      setShowCreateModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignSoftware = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await apiRequest(`/customers/${selectedCustomer.id}/software`, {
        method: 'POST',
        body: JSON.stringify(softwareData),
      });
      alert(`Software successfully assigned to ${selectedCustomer.organization_name}`);
      setShowSoftwareModal(false);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Created Notice Banner */}
      {createdInfo && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div>
            <strong className="font-bold">Customer Account Created:</strong> {createdInfo.customer.organization_name} ({createdInfo.customer.id}).
            Portal Login: <span className="font-mono font-semibold">{createdInfo.portal_account.email}</span> / Password: <span className="font-mono font-semibold">{createdInfo.portal_account.temporary_password}</span>
          </div>
          <button onClick={() => setCreatedInfo(null)} className="font-bold text-slate-500 hover:text-slate-800">✕</button>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, organization, email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Customer ID</th>
                <th className="p-3.5 border-b border-slate-200">Organization</th>
                <th className="p-3.5 border-b border-slate-200">Contact Person</th>
                <th className="p-3.5 border-b border-slate-200">Type</th>
                <th className="p-3.5 border-b border-slate-200">Location</th>
                <th className="p-3.5 border-b border-slate-200">Assigned Support</th>
                <th className="p-3.5 border-b border-slate-200">Status</th>
                <th className="p-3.5 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{c.id}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-900">{c.organization_name}</p>
                    <p className="text-[11px] text-slate-500">{c.email}</p>
                  </td>
                  <td className="p-3.5 text-slate-700">
                    <p className="font-medium">{c.contact_person}</p>
                    <p className="text-[11px] text-slate-500">{c.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{c.city ? `${c.city}, ${c.state}` : 'India'}</td>
                  <td className="p-3.5 text-slate-600">{c.assigned_support_user_name || 'Support Team'}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(c);
                        setShowSoftwareModal(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                      title="Assign Software Module"
                    >
                      + Software
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CUSTOMER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register New Customer Organization</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.organization_name}
                  onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                  placeholder="e.g. Metro Care Multi-Speciality Hospital"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Gupta"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="hospital">Hospital (Multi-Speciality)</option>
                    <option value="clinic">Clinic / Day Care</option>
                    <option value="enterprise">Enterprise Company</option>
                    <option value="startup">Startup</option>
                    <option value="individual">Individual Practice</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@metrocare.com"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lucknow"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Portal Password</label>
                  <input
                    type="text"
                    value={formData.initial_password}
                    onChange={(e) => setFormData({ ...formData, initial_password: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Facility details, bed count, special requirements..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow"
                >
                  Create & Provision Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN SOFTWARE MODAL */}
      {showSoftwareModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Assign Software: {selectedCustomer.organization_name}</h3>
              <button onClick={() => setShowSoftwareModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAssignSoftware} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Software Product *</label>
                <select
                  value={softwareData.product_id}
                  onChange={(e) => {
                    const id = e.target.value;
                    const names: Record<string, string> = {
                      'prod-hmis': 'Hospital Management System (HMIS)',
                      'prod-ceo-dash': 'Director / CEO Dashboard',
                      'prod-lis': 'Laboratory Management and LIS Integration',
                      'prod-crm': 'CRM and Lead Management',
                      'prod-asset-portal': 'Asset Management Portal',
                    };
                    setSoftwareData({
                      ...softwareData,
                      product_id: id,
                      product_name: names[id] || 'Custom Software',
                    });
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="prod-hmis">Hospital Management System (HMIS)</option>
                  <option value="prod-ceo-dash">Director / CEO Dashboard</option>
                  <option value="prod-lis">Laboratory Management and LIS Integration</option>
                  <option value="prod-crm">CRM and Lead Management</option>
                  <option value="prod-asset-portal">Asset Management Portal</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deployed URL / Domain</label>
                <input
                  type="text"
                  value={softwareData.deployed_url}
                  onChange={(e) => setSoftwareData({ ...softwareData, deployed_url: e.target.value })}
                  placeholder="https://hospital-erp.local"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Release Version</label>
                <input
                  type="text"
                  value={softwareData.version}
                  onChange={(e) => setSoftwareData({ ...softwareData, version: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSoftwareModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow"
                >
                  Assign & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

