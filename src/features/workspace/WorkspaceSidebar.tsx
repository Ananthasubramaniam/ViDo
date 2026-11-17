import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Archive,
  Palette,
  Plus,
} from 'lucide-react';
import { Button } from '../../components/ui';

export interface WorkspaceSidebarProps {
  counts: {
    today: number;
    needsAttention: number;
    upcoming: number;
    completed: number;
    archived: number;
  };
  onNewTaskClick?: () => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ counts, onNewTaskClick }) => {
  const navItems = [
    {
      to: '/preview',
      end: true,
      label: 'Home',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      to: '/preview/today',
      label: 'Today',
      icon: <Clock className="w-4 h-4" />,
      count: counts.today,
    },
    {
      to: '/preview/upcoming',
      label: 'Upcoming',
      icon: <Calendar className="w-4 h-4" />,
      count: counts.upcoming,
    },
    {
      to: '/preview/needs-attention',
      label: 'Needs Attention',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      count: counts.needsAttention,
      badgeColor: 'bg-amber-500/20 text-amber-300 font-bold',
    },
    {
      to: '/preview/completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      count: counts.completed,
    },
    {
      to: '/preview/archived',
      label: 'Archived',
      icon: <Archive className="w-4 h-4" />,
      count: counts.archived,
    },
  ];

  return (
    <aside
      aria-label="Workspace navigation"
      className="w-64 bg-[var(--dark)] text-gray-200 flex flex-col justify-between shrink-0 sticky top-[45px] h-[calc(100vh-45px)] overflow-y-auto p-5 select-none"
    >
      <div>
        {/* Brand Header with Demo Preview Mark */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-9 h-9 rounded-xl bg-white text-[var(--dark)] flex items-center justify-center font-black text-base shadow-sm">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight block">ViDo</span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950 shadow-xs">
                DEMO
              </span>
            </div>
            <span className="text-[10px] text-amber-300/90 font-medium tracking-wide block">
              Logged-in demo preview
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

        {/* Navigation Sections */}
        <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2 px-2.5">
          Views
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-xs'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-white/10 text-gray-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 space-y-1 text-xs">
        <Link
          to="/style-lab"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Palette className="w-4 h-4" />
          <span>Themes</span>
        </Link>
      </div>
    </aside>
  );
};
