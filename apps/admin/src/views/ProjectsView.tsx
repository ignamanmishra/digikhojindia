import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { Project, ProjectTask } from '@digikhojindia/types';
import { FolderGit2, CheckSquare, Plus, Clock } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  // New Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as const,
    due_date: '2026-11-25',
  });

  const fetchProjects = () => {
    setLoading(true);
    apiRequest('/projects')
      .then((res) => {
        setProjects(res.projects || []);
        if (res.projects?.length > 0 && !selectedProject) {
          loadProjectDetails(res.projects[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadProjectDetails = (id: string) => {
    apiRequest(`/projects/${id}`)
      .then((res) => {
        setSelectedProject(res.project);
        setTasks(res.tasks || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await apiRequest(`/projects/${selectedProject.id}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      setShowTaskModal(false);
      loadProjectDetails(selectedProject.id);
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleTaskStatus = async (task: ProjectTask) => {
    const nextStatus = task.status === 'Done' ? 'In Progress' : 'Done';
    try {
      await apiRequest(`/projects/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (selectedProject) {
        loadProjectDetails(selectedProject.id);
        fetchProjects();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Projects List */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Active Deployment Projects</h3>
        <div className="space-y-3">
          {projects.map((p) => {
            const isSelected = selectedProject?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => loadProjectDetails(p.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                    {p.status}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{p.progress_percent}% Complete</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{p.title}</h4>
                <p className="text-[11px] text-slate-500 mb-3">{p.customer_name}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${p.progress_percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Project Tasks & Milestones */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        {selectedProject ? (
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedProject.id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedProject.title}</h3>
                <p className="text-xs text-slate-500">{selectedProject.description}</p>
              </div>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Project Tasks & Sprints</h4>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTaskStatus(task)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    task.status === 'Done' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'Done'}
                      readOnly
                      className="rounded text-blue-600"
                    />
                    <div>
                      <p className={`text-xs font-semibold ${task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      {task.due_date && <span className="text-[10px] text-slate-400">Due: {task.due_date}</span>}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.status === 'Done' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">Select a project to inspect milestones.</div>
        )}
      </div>

      {/* ADD TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add Task to {selectedProject?.title}</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="e.g. Configure Laboratory Analyzer TCP Bridge"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={taskData.priority}
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskData.due_date}
                    onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
