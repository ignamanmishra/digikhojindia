import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { Bot, Play, CheckCircle2, Zap } from 'lucide-react';

export const AutomationView: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/automation/workflows')
      .then((res) => setWorkflows(res.workflows || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Event-driven Business Automation Engine</h2>
          <p className="text-xs text-slate-500">Autonomous triggers connecting inquiries, support tickets, billing, and reminders</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Engine Running</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-600">{wf.trigger_event}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{wf.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{wf.description}</p>
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Actions Executed</span>
                <div className="flex flex-wrap gap-1.5">
                  {wf.actions?.map((act: string, i: number) => (
                    <span key={i} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      ⚡ {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total Automated Runs: <strong className="text-slate-800 font-bold">{wf.total_runs}</strong></span>
              <span className="text-[10px] text-slate-400">Last triggered: {new Date(wf.last_triggered).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
