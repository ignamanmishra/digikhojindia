import React, { useEffect, useState } from 'react';
import { portalRequest } from '../api';
import type { Project } from '@digikhojindia/types';
import { FolderGit2, CheckCircle2 } from 'lucide-react';

export const PortalProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalRequest('/projects')
      .then((res) => setProjects(res.projects || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Your Organization Projects & Sprints</h2>
        <p className="text-xs text-slate-500">Track development milestones and upgrade timelines for your software</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                {p.status}
              </span>
              <span className="text-xs font-bold text-slate-700">{p.progress_percent}% Progress</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${p.progress_percent}%` }}></div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Target End: <strong>{p.target_end_date}</strong></span>
              <span>Manager: <strong>Digikhojindia Lead</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

