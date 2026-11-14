import React, { useState } from 'react';
import { ROLE_PERMISSIONS } from '@digikhojindia/shared';
import type { SystemRole } from '@digikhojindia/types';
import { UserCog, ShieldCheck, Check, Briefcase, Award, Clock, Star, CheckCircle2 } from 'lucide-react';
import { GlassCard, GlassTabs, GlassStatusBadge, GlassButton } from '@digikhojindia/ui';

export const EmployeesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');

  const staffMembers = [
    {
      id: 'usr-naman',
      name: 'Naman Mishra',
      role: 'super_admin' as SystemRole,
      title: 'Principal Software Architect & Founder',
      assigned_tasks: 12,
      resolved_tickets: 48,
      sla_rating: 4.98,
      status: 'active',
      current_focus: 'Cloudflare Edge D1 Architecture & HMIS Core Engine',
    },
    {
      id: 'usr-staff-rahul',
      name: 'Rahul Sharma',
      role: 'developer' as SystemRole,
      title: 'Senior Full-Stack Developer',
      assigned_tasks: 8,
      resolved_tickets: 36,
      sla_rating: 4.92,
      status: 'active',
      current_focus: 'City Hospital IPD Bed Matrix & ASTM LIS Interfacing',
    },
    {
      id: 'usr-staff-priya',
      name: 'Priya Sundaram',
      role: 'support_executive' as SystemRole,
      title: 'Lead Support Executive',
      assigned_tasks: 5,
      resolved_tickets: 94,
      sla_rating: 4.95,
      status: 'active',
      current_focus: '24x7 Customer Helpdesk & SLA Triage',
    },
    {
      id: 'usr-staff-vikram',
      name: 'Vikram Malhotra',
      role: 'it_manager' as SystemRole,
      title: 'IT Infrastructure & Network Manager',
      assigned_tasks: 7,
      resolved_tickets: 28,
      sla_rating: 4.88,
      status: 'active',
      current_focus: 'Hospital CCTV Server Deployments & Zero-Trust R2',
    },
  ];

  const roleList: { role: SystemRole; title: string; desc: string }[] = [
    { role: 'super_admin', title: 'Super Admin', desc: 'Full platform operational, financial, and administrative authority.' },
    { role: 'admin', title: 'Operations Admin', desc: 'Customer management, CRM, AMC contracts, CMS, and Ticket escalation.' },
    { role: 'it_manager', title: 'IT Manager', desc: 'Infrastructure, cloud deployments, servers, and technical ticket resolution.' },
    { role: 'project_manager', title: 'Project Manager', desc: 'Milestone tracking, sprint task assignments, and progress monitoring.' },
    { role: 'support_executive', title: 'Support Executive', desc: 'Support ticket resolution, reply threads, and customer troubleshooting.' },
    { role: 'developer', title: 'Developer', desc: 'Software engineering, bug fixes, and project implementation.' },
    { role: 'seo_manager', title: 'SEO & Content Manager', desc: 'CMS publishing, blog articles, schemas, and GEO visibility optimization.' },
    { role: 'accountant', title: 'Accountant', desc: 'Tax invoice generation, GST reconciliation, payments, and expense tracking.' },
    { role: 'customer_admin', title: 'Customer Admin', desc: 'Client organization director/admin managing organization software and tickets.' },
    { role: 'customer_employee', title: 'Customer Employee', desc: 'Client staff member raising complaints and viewing active projects.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white font-heading tracking-tight">
            Employee Operations & RBAC Governance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Team workload tracking, active task assignments, customer support performance, and cryptographic RBAC.
          </p>
        </div>

        <GlassTabs
          tabs={[
            { id: 'performance', label: 'Employee Workload & Performance' },
            { id: 'rbac', label: 'RBAC Permission Matrix' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'performance' ? (
        <div className="space-y-6">
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffMembers.map((staff) => (
              <GlassCard key={staff.id} glowColor="cyan" interactive={true} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#287BFF] to-[#42DDF5] text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(66,221,245,0.3)] border border-white/20">
                    {staff.name.charAt(0)}
                  </div>
                  <GlassStatusBadge status="active" label="Available" pulse={true} size="sm" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-heading">{staff.name}</h4>
                  <p className="text-[11px] text-cyan-300 font-medium">{staff.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Role: {staff.role}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Current Focus</span>
                  <p className="text-[11px] text-slate-200 line-clamp-2">{staff.current_focus}</p>
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tasks</span>
                    <strong className="text-white font-heading">{staff.assigned_tasks}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Resolved</span>
                    <strong className="text-cyan-400 font-heading">{staff.resolved_tickets}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <strong className="text-amber-400 font-heading flex items-center justify-center gap-0.5">
                      <Star size={10} fill="currentColor" /> {staff.sla_rating}
                    </strong>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Detailed Workload Table */}
          <GlassCard glowColor="violet" className="space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Active Sprint Task Allocation</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-heading font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Assigned Tasks</th>
                    <th className="py-3 px-4">Resolved Tickets</th>
                    <th className="py-3 px-4">SLA Compliance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white font-heading">{staff.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{staff.title}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">{staff.assigned_tasks} Tasks</td>
                      <td className="py-3.5 px-4 text-slate-200">{staff.resolved_tickets} Tickets</td>
                      <td className="py-3.5 px-4">
                        <GlassStatusBadge status="success" label="99.4% SLA" pulse={false} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`Reviewing task assignments for ${staff.name}`)}
                          className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-cyan-500/20 transition-all"
                        >
                          View Workload
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      ) : (
        /* RBAC Matrix Tab */
        <GlassCard glowColor="cyan" className="space-y-4">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-heading font-semibold uppercase text-[11px]">
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4">Scope & Responsibilities</th>
                  <th className="py-3.5 px-4">Cryptographic Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {roleList.map((r) => {
                  const perms = ROLE_PERMISSIONS[r.role] || [];
                  return (
                    <tr key={r.role} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-cyan-400 block">{r.role}</span>
                        <span className="text-white font-bold font-heading">{r.title}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs leading-relaxed">{r.desc}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xl">
                          {perms.map((p) => (
                            <span
                              key={p}
                              className="text-[10px] font-mono bg-white/[0.05] text-slate-300 px-2 py-0.5 rounded-md border border-white/10"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
