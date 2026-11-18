import React, { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SAMPLE_TASKS, SampleTask } from '../../data/sampleTasks';
import { getFilteredTasks, getHomeDashboardTasks } from '../../data/taskFilters';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceTopBar } from './WorkspaceTopBar';
import { HomeView } from './views/HomeView';
import { ListView } from './views/ListView';
import { TaskDetailModal } from './TaskDetailModal';
import { TaskCreateModal } from './TaskCreateModal';

export const WorkspaceLayout: React.FC = () => {
  const [tasks, setTasks] = useState<SampleTask[]>(SAMPLE_TASKS);
  const [selectedTask, setSelectedTask] = useState<SampleTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const views = getFilteredTasks(tasks);
  const dashboard = getHomeDashboardTasks(tasks);

  const location = useLocation();

  const handleTaskClick = (task: SampleTask) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCreateTask = (newTask: SampleTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setToastMessage(`Task "${newTask.title}" added to your workspace.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTask = (taskToToggle: SampleTask) => {
    const isNowCompleted = taskToToggle.state !== 'completed';
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskToToggle.id
          ? {
              ...t,
              state: isNowCompleted ? 'completed' : 'active',
              completedAt: isNowCompleted ? '2026-11-17T12:00:00Z' : undefined,
              checkpoints: [
                ...(t.checkpoints || []),
                {
                  id: `cp-${Date.now()}`,
                  timestamp: '2026-11-17T12:00:00Z',
                  note: isNowCompleted
                    ? 'Task marked as completed.'
                    : 'Task reopened in workspace.',
                },
              ],
            }
          : t
      )
    );
    if (selectedTask && selectedTask.id === taskToToggle.id) {
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              state: isNowCompleted ? 'completed' : 'active',
              completedAt: isNowCompleted ? '2026-11-17T12:00:00Z' : undefined,
            }
          : null
      );
    }
    setToastMessage(
      isNowCompleted
        ? `Task "${taskToToggle.title}" marked as completed!`
        : `Task "${taskToToggle.title}" reopened.`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path.endsWith('/today')) {
      return { title: 'Today', subtitle: 'Responsibilities due on 17 November 2026' };
    }
    if (path.endsWith('/upcoming')) {
      return { title: 'Upcoming', subtitle: 'Scheduled responsibilities for future dates' };
    }
    if (path.endsWith('/needs-attention')) {
      return { title: 'Needs Attention', subtitle: 'Overdue or urgent items requiring action' };
    }
    if (path.endsWith('/completed')) {
      return { title: 'Completed', subtitle: 'All finished work with completion timings' };
    }
    if (path.endsWith('/archived')) {
      return { title: 'Archived', subtitle: 'Shelved and preserved task history' };
    }
    return { title: 'Home Overview', subtitle: 'Calm snapshot of today, urgent work, and upcoming items' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--canvas)] text-[var(--ink)] antialiased">
      {/* 1. Global Persistent Demo Preview Notice Bar */}
      <aside
        aria-label="Demo environment announcement"
        className="sticky top-0 z-50 bg-[var(--dark)] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 border-b border-white/10 shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Landing Page</span>
          </Link>

          <span className="h-4 w-px bg-white/20 hidden sm:inline-block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 font-mono shadow-xs shrink-0 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse" />
              DEMO PREVIEW
            </span>
            <p className="text-xs text-gray-200 truncate hidden md:block">
              <span className="font-semibold text-white">Interactive Demo:</span> You are exploring ViDo with mock data. Real account sync is disabled.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-gray-400 hidden sm:block shrink-0">
          Preview Mode
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="flex flex-1 min-h-0">
        {/* Persistent Left Desktop Sidebar */}
        <WorkspaceSidebar
          counts={{
            today: views.today.length,
            needsAttention: views.needsAttention.length,
            upcoming: views.upcoming.length,
            completed: views.completed.length,
            archived: views.archived.length,
          }}
          onNewTaskClick={() => setIsCreateOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <WorkspaceTopBar
            title={headerInfo.title}
            subtitle={headerInfo.subtitle}
          />

          <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              index
              element={<HomeView dashboard={dashboard} onTaskClick={handleTaskClick} />}
            />
            <Route
              path="today"
              element={
                <ListView
                  title="Today's Work"
                  description="Tasks targeted for completion by end of day 17 November 2026."
                  tasks={views.today}
                  onTaskClick={handleTaskClick}
                  onNewTaskClick={() => setIsCreateOpen(true)}
                />
              }
            />
            <Route
              path="upcoming"
              element={
                <ListView
                  title="Upcoming Schedule"
                  description="Planned tasks due beyond today's horizon."
                  tasks={views.upcoming}
                  onTaskClick={handleTaskClick}
                  onNewTaskClick={() => setIsCreateOpen(true)}
                />
              }
            />
            <Route
              path="needs-attention"
              element={
                <ListView
                  title="Needs Attention"
                  description="Tasks past their target deadline or requiring urgent intervention."
                  tasks={views.needsAttention}
                  onTaskClick={handleTaskClick}
                  onNewTaskClick={() => setIsCreateOpen(true)}
                />
              }
            />
            <Route
              path="completed"
              element={
                <ListView
                  title="Completed Tasks"
                  description="Full historical record of delivered responsibilities."
                  tasks={views.completed}
                  onTaskClick={handleTaskClick}
                />
              }
            />
            <Route
              path="archived"
              element={
                <ListView
                  title="Archived Tasks"
                  description="Shelved tasks preserved with their complete checkpoint history."
                  tasks={views.archived}
                  onTaskClick={handleTaskClick}
                />
              }
            />
          </Routes>
        </main>
      </div>
      </div>

      {/* Modals */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTask(null);
        }}
        onToggleTask={handleToggleTask}
      />

      <TaskCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Floating Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[var(--dark)] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-xs font-medium text-gray-100">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white text-xs ml-2 cursor-pointer"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
