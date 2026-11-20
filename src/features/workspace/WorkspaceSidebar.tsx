import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Palette,
  Plus,
  LogOut,
} from 'lucide-react';
import { Button } from '../../components/ui';

export interface WorkspaceSidebarProps {
  isPreview?: boolean;
  basePath?: string;
  user?: {
    name: string;
    email?: string;
  };
  counts: {
    total?: number;
    today: number;
    needsAttention: number;
    upcoming: number;
    completed: number;
    archived: number;
  };
  onNewTaskClick?: () => void;
  onSignOut?: () => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  isPreview = true,
  basePath = '/preview',
  user,
  counts,
  onNewTaskClick,
  onSignOut,
}) => {
  const totalTasks =
    counts.total ?? (counts.today + counts.upcoming + counts.needsAttention);

  const dashboardPath = basePath;
  const tasksPath = `${basePath}/tasks`;
  const calendarPath = `${basePath}/calendar`;
  const analyticsPath = `${basePath}/analytics`;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-white/15 text-white shadow-xs'
        : 'text-gray-300 hover:bg-white/8 hover:text-white'
    }`;

  return (
    <aside
      aria-label="Workspace navigation"
      className={`w-64 bg-[var(--dark)] text-gray-200 flex flex-col justify-between shrink-0 sticky ${
        isPreview ? 'top-[45px] h-[calc(100vh-45px)]' : 'top-0 h-screen'
      } overflow-y-auto p-5 select-none`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-9 h-9 rounded-xl bg-white text-[var(--dark)] flex items-center justify-center font-black text-base shadow-sm">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight block">ViDo</span>
              {isPreview ? (
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950 shadow-xs">
                  DEMO
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white border border-white/20">
                  WORKSPACE
                </span>
              )}
            </div>
            <span className="text-[10px] text-amber-300/90 font-medium tracking-wide block">
              {isPreview ? 'Logged-in demo preview' : user?.name || 'Personal Workspace'}
            </span>
          </div>
        </div>

        {/* Quick New Task Button */}
        {onNewTaskClick && (
          <div className="mb-6">
            <Button
              variant="primary"
              size="sm"
              onClick={onNewTaskClick}
              className="w-full justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Task
            </Button>
          </div>
        )}

        <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2 px-2.5">
          Workspace
        </div>
        <nav className="space-y-1">
          <NavLink to={dashboardPath} end className={linkClass}>
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[var(--accent)]" />
              <span>Dashboard</span>
            </div>
          </NavLink>

          <NavLink to={tasksPath} className={linkClass}>
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Tasks</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-200 font-bold">
              {totalTasks}
            </span>
          </NavLink>
        </nav>

        <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2 mt-6 px-2.5">
          Planning
        </div>
        <nav className="space-y-1">
          <NavLink to={calendarPath} className={linkClass}>
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>Calendar</span>
            </div>
          </NavLink>

          <NavLink to={analyticsPath} className={linkClass}>
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Analytics</span>
            </div>
          </NavLink>
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
        {!isPreview && (
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {(user?.name || 'Alex Morgan')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  {user?.name || 'Alex Morgan'}
                </span>
                <span className="text-[10px] text-gray-400 block truncate">
                  {user?.email || 'alex.morgan@gmail.com'}
                </span>
              </div>
            </div>
          </div>
        )}

        <Link
          to="/style-lab"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Palette className="w-4 h-4" />
          <span>Themes</span>
        </Link>

        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
