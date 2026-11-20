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

  it('renders dashboard, tasks, and planning navigation items', () => {
    render(
      <MemoryRouter initialEntries={['/preview']}>
        <WorkspaceSidebar counts={mockCounts} />
      </MemoryRouter>
    );

    expect(screen.getByText('DEMO')).toBeInTheDocument();
    expect(screen.getByText('Logged-in demo preview')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tasks 15/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
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
