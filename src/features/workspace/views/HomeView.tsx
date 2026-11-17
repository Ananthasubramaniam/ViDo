import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SampleTask } from '../../../data/sampleTasks';
import { HomeDashboardTasks } from '../../../data/taskFilters';
import { TaskRow } from '../TaskRow';
import { Clock, AlertCircle, Calendar, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export interface HomeViewProps {
  dashboard: HomeDashboardTasks;
  onTaskClick: (task: SampleTask) => void;
}

export type HomeTab = 'today' | 'needsAttention' | 'upcoming' | 'completed';

export const HomeView: React.FC<HomeViewProps> = ({ dashboard, onTaskClick }) => {
  const [activeTab, setActiveTab] = useState<HomeTab>('today');

  const tabConfigs = {
    today: {
      id: 'today' as HomeTab,
      label: "Today's Agenda",
      icon: <Clock className="w-4 h-4 text-[var(--accent)]" />,
      items: dashboard.today.items,
      totalCount: dashboard.today.totalCount,
      linkTo: '/preview/today',
      emptyText: 'No tasks due today. You are fully caught up.',
      headline: 'Tasks scheduled for today, 17 November 2026',
    },
    needsAttention: {
      id: 'needsAttention' as HomeTab,
      label: 'Needs Attention',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      items: dashboard.needsAttention.items,
      totalCount: dashboard.needsAttention.totalCount,
      linkTo: '/preview/needs-attention',
      emptyText: 'Great work! No overdue tasks requiring attention.',
      headline: 'Overdue or high-priority responsibilities requiring review',
    },
    upcoming: {
      id: 'upcoming' as HomeTab,
      label: 'Upcoming Schedule',
      icon: <Calendar className="w-4 h-4 text-indigo-400" />,
      items: dashboard.upcoming.items,
      totalCount: dashboard.upcoming.totalCount,
      linkTo: '/preview/upcoming',
      emptyText: 'No upcoming tasks scheduled for the rest of the week.',
      headline: 'Planned responsibilities scheduled beyond today',
    },
    completed: {
      id: 'completed' as HomeTab,
      label: 'Recently Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      items: dashboard.recentlyCompleted.items,
      totalCount: dashboard.recentlyCompleted.totalCount,
      linkTo: '/preview/completed',
      emptyText: 'No tasks completed in the last 7 days yet.',
      headline: 'Delivered responsibilities finished over the last 7 days',
    },
  };

  const currentTab = tabConfigs[activeTab];

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-6xl mx-auto">
      {/* 1. Dark Navy Hero Overview Card */}
      <section
        aria-label="Overview Command Center"
        className="bg-[var(--dark)] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Tuesday, 17 November 2026
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950 shadow-xs">
                  Sample Data
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5 flex-wrap">
                <span>Welcome back, Demo User</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Preview Mode
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                Here is your focused daily workload snapshot. Select an area below to inspect its tasks.
              </p>
            </div>
          </div>

          {/* 4 Interactive Summary Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {/* Tile 1: Today */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('today')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('today')}
              aria-label={`View Today tasks (${dashboard.today.totalCount})`}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                activeTab === 'today'
                  ? 'bg-white/15 border-white/40 ring-2 ring-white/30 shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[var(--accent)]" /> Today
                </span>
                {activeTab === 'today' && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                )}
              </div>
              <div className="text-2xl font-black tracking-tight text-white">
                {dashboard.today.totalCount}
              </div>
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                {dashboard.today.items[0]?.dueTime ? `Next at ${dashboard.today.items[0].dueTime}` : 'Due today'}
              </span>
            </div>

            {/* Tile 2: Needs Attention */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('needsAttention')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('needsAttention')}
              aria-label={`View Needs Attention tasks (${dashboard.needsAttention.totalCount})`}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                activeTab === 'needsAttention'
                  ? 'bg-amber-500/20 border-amber-400/40 ring-2 ring-amber-400/30 shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> Attention
                </span>
                {activeTab === 'needsAttention' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>
              <div className="text-2xl font-black tracking-tight text-amber-300">
                {dashboard.needsAttention.totalCount}
              </div>
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                {dashboard.needsAttention.totalCount > 0 ? 'Action required' : 'All clear'}
              </span>
            </div>

            {/* Tile 3: Upcoming */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('upcoming')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('upcoming')}
              aria-label={`View Upcoming tasks (${dashboard.upcoming.totalCount})`}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                activeTab === 'upcoming'
                  ? 'bg-white/15 border-white/40 ring-2 ring-white/30 shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Upcoming
                </span>
                {activeTab === 'upcoming' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                )}
              </div>
              <div className="text-2xl font-black tracking-tight text-white">
                {dashboard.upcoming.totalCount}
              </div>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Scheduled later</span>
            </div>

            {/* Tile 4: Recently Completed */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('completed')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('completed')}
              aria-label={`View Completed tasks (${dashboard.recentlyCompleted.totalCount})`}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                activeTab === 'completed'
                  ? 'bg-emerald-500/20 border-emerald-400/40 ring-2 ring-emerald-400/30 shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Done (7d)
                </span>
                {activeTab === 'completed' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <div className="text-2xl font-black tracking-tight text-emerald-300">
                {dashboard.recentlyCompleted.totalCount}
              </div>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Finished this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Active Tab Task Feed (Scannable Horizontal Rows) */}
      <section aria-labelledby="active-section-heading" className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <div className="flex items-center gap-2">
              {currentTab.icon}
              <h2
                id="active-section-heading"
                className="text-lg font-bold text-[var(--ink)] tracking-tight"
              >
                {currentTab.label}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)]">
                {currentTab.items.length} of {currentTab.totalCount}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-1">{currentTab.headline}</p>
          </div>

          <Link
            to={currentTab.linkTo}
            className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Open full view <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Task Rows Card Container */}
        {currentTab.items.length > 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] shadow-xs overflow-hidden">
            {currentTab.items.map((task) => (
              <TaskRow key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-[var(--line)] rounded-xl bg-[var(--surface)]">
            <p className="text-xs text-[var(--muted)]">{currentTab.emptyText}</p>
          </div>
        )}
      </section>
    </div>
  );
};
