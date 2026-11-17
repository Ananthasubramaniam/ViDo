import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Badge } from '../../components/ui';

export interface WorkspaceTopBarProps {
  title: string;
  subtitle?: string;
  onSearchFocus?: () => void;
}

export const WorkspaceTopBar: React.FC<WorkspaceTopBarProps> = ({
  title,
  subtitle,
  onSearchFocus,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[var(--surface)]/95 backdrop-blur-xs border-b border-[var(--line)] px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">{title}</h1>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Interactive Preview
          </span>
        </div>
        {subtitle && <p className="text-xs text-[var(--muted)]">{subtitle}</p>}
      </div>

      {/* Right Controls: Search, Filter, and User Profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 text-[var(--faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="Search tasks..."
            onFocus={onSearchFocus}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder-[var(--faint)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-all"
            aria-label="Search tasks"
          />
        </div>

        {/* Filter */}
        <button
          type="button"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs font-medium text-[var(--muted)] hover:bg-[var(--canvas)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-colors cursor-pointer"
          aria-label="Filter tasks"
        >
          <Filter className="w-3.5 h-3.5 text-[var(--faint)]" />
          <span>All Priorities</span>
        </button>

        {/* Date Badge */}
        <div className="hidden lg:block">
          <Badge variant="neutral" size="sm">
            Tuesday, 17 Nov 2026
          </Badge>
        </div>

        {/* User Profile Badge */}
        <div
          className="flex items-center gap-2 pl-3 border-l border-[var(--line)]"
          title="Demo User (Preview Mode)"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-750 font-bold text-xs flex items-center justify-center border border-amber-500/30 shadow-xs">
            DU
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--ink)] block leading-tight">
                Demo User
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Demo
              </span>
            </div>
            <span className="text-[10px] text-[var(--muted)] block leading-tight">Personal Workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
};
