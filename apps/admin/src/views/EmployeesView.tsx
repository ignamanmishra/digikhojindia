import React from 'react';
import { ROLE_PERMISSIONS } from '@digikhojindia/shared';
import type { SystemRole } from '@digikhojindia/types';
import { UserCog, ShieldCheck, Check } from 'lucide-react';

export const EmployeesView: React.FC = () => {
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
      <div>
        <h2 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) & Permissions</h2>
        <p className="text-xs text-slate-500">Every API endpoint independently enforces cryptographic authorization based on user roles.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3.5 border-b border-slate-200">System Role</th>
                <th className="p-3.5 border-b border-slate-200">Role Description</th>
                <th className="p-3.5 border-b border-slate-200">Granted Granular Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roleList.map((r) => {
                const perms = ROLE_PERMISSIONS[r.role] || [];
                return (
                  <tr key={r.role} className="hover:bg-slate-50/50">
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-blue-600 block">{r.role}</span>
                      <span className="text-slate-800 font-semibold">{r.title}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs">{r.desc}</td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xl">
                        {perms.map((p) => (
                          <span key={p} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
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
      </div>
    </div>
  );
};
