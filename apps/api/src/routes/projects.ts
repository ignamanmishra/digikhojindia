/**
 * DIGIKHOJINDIA PROJECT MANAGEMENT ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { projectCreateSchema, taskCreateSchema } from '@digikhojindia/validation';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import type { Project, ProjectTask } from '@digikhojindia/types';

export const projectRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

projectRoutes.use('*', authMiddleware);

// List Projects
projectRoutes.get('/', requirePermission('projects:read'), async (c) => {
  const user = c.get('user');
  let list = Array.from(globalStore.projects.values());

  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    list = list.filter((p) => p.tenant_id === user.tenant_id);
  }

  return c.json({ success: true, projects: list, total: list.length });
});

// Get Project Details with Tasks
projectRoutes.get('/:id', requirePermission('projects:read'), async (c) => {
  const id = c.req.param('id') || '';
  const user = c.get('user');
  const project = globalStore.projects.get(id);

  if (!project) {
    return c.json({ success: false, error: 'Project not found' }, 404);
  }

  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    if (project.tenant_id !== user.tenant_id) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
  }

  const tasks = globalStore.tasks.get(id) || [];

  return c.json({ success: true, project, tasks });
});

// Create Project
projectRoutes.post('/', requirePermission('projects:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = projectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const customer = globalStore.customers.get(data.customer_id);
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404);
    }

    const projectId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: projectId,
      tenant_id: customer.tenant_id,
      customer_id: customer.id,
      customer_name: customer.organization_name,
      title: data.title,
      description: data.description,
      project_manager_id: data.project_manager_id,
      project_manager_name: 'Digikhojindia Project Team',
      start_date: data.start_date,
      target_end_date: data.target_end_date,
      status: data.status || 'Planning',
      progress_percent: 0,
      budget: data.budget || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.projects.set(projectId, newProject);
    globalStore.tasks.set(projectId, []);

    return c.json({ success: true, message: 'Project created successfully', project: newProject }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Create Task
projectRoutes.post('/:id/tasks', requirePermission('projects:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const project = globalStore.projects.get(id);
    if (!project) {
      return c.json({ success: false, error: 'Project not found' }, 404);
    }

    const body = await c.req.json();
    const parsed = taskCreateSchema.safeParse({ ...body, project_id: id });
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const taskId = `task-${Date.now()}`;
    const newTask: ProjectTask = {
      id: taskId,
      project_id: id,
      title: data.title,
      description: data.description || null,
      assigned_user_id: data.assigned_user_id || null,
      status: data.status || 'Todo',
      priority: data.priority || 'Medium',
      due_date: data.due_date || null,
      is_overdue: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const tasks = globalStore.tasks.get(id) || [];
    tasks.push(newTask);
    globalStore.tasks.set(id, tasks);

    // Recalculate progress %
    const doneCount = tasks.filter((t) => t.status === 'Done').length;
    project.progress_percent = Math.round((doneCount / tasks.length) * 100);

    return c.json({ success: true, message: 'Task added', task: newTask }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Update Task Status
projectRoutes.patch('/tasks/:taskId', requirePermission('projects:write'), async (c) => {
  try {
    const taskId = c.req.param('taskId') || '';
    const body = await c.req.json();
    const { status } = body;

    let targetTask: ProjectTask | null = null;
    let targetProject: Project | null = null;

    for (const [pId, tasks] of globalStore.tasks.entries()) {
      const found = tasks.find((t) => t.id === taskId);
      if (found) {
        targetTask = found;
        targetProject = globalStore.projects.get(pId) || null;
        break;
      }
    }

    if (!targetTask || !targetProject) {
      return c.json({ success: false, error: 'Task not found' }, 404);
    }

    if (status) {
      targetTask.status = status;
      targetTask.updated_at = new Date().toISOString();
    }

    // Recalculate project progress
    const projectTasks = globalStore.tasks.get(targetProject.id) || [];
    const doneCount = projectTasks.filter((t) => t.status === 'Done').length;
    targetProject.progress_percent = Math.round((doneCount / projectTasks.length) * 100);

    return c.json({ success: true, message: 'Task status updated', task: targetTask });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
