import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkspaceSidebar } from './WorkspaceSidebar';

describe('WorkspaceSidebar', () => {
  const mockCounts = {
    today: 6,
    needsAttention: 4,
    upcoming: 5,
    completed: 5,
    archived: 2,
  };

  it('renders the two primary tabs: Dashboard and Tasks with count badge, and omits sub-views', () => {
    render(
      <MemoryRouter initialEntries={['/preview']}>
        <WorkspaceSidebar counts={mockCounts} />
      </MemoryRouter>
    );

    expect(screen.getByText('DEMO')).toBeInTheDocument();
    expect(screen.getByText('Logged-in demo preview')).toBeInTheDocument();
    
    // Exactly TWO primary tabs in the navigation panel: Dashboard and Tasks
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tasks 15/i })).toBeInTheDocument();

    // Verify the 5 individual options are removed from the left panel
    expect(screen.queryByRole('link', { name: /^today/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^needs attention/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^upcoming/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^completed/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^archived/i })).not.toBeInTheDocument();

    // Footer links remain
    expect(screen.getByRole('link', { name: /themes/i })).toBeInTheDocument();
  });

  it('triggers new task callback when button is clicked', () => {
    const handleNewTask = vi.fn();
    render(
      <MemoryRouter initialEntries={['/preview']}>
        <WorkspaceSidebar counts={mockCounts} onNewTaskClick={handleNewTask} />
      </MemoryRouter>
    );

    const btn = screen.getByRole('button', { name: /new task/i });
    fireEvent.click(btn);
    expect(handleNewTask).toHaveBeenCalledTimes(1);
  });
});

