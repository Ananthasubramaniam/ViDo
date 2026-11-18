import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SAMPLE_TASKS } from '../../data/sampleTasks';
import { getHomeDashboardTasks } from '../../data/taskFilters';
import { HomeView } from './views/HomeView';
import { ListView } from './views/ListView';
import { TaskDetailModal } from './TaskDetailModal';
import { TaskCreateModal } from './TaskCreateModal';
import { WorkspaceLayout } from './WorkspaceLayout';

describe('Workspace Views and Modals', () => {
  describe('HomeView Command Center and Interactive Switching', () => {
    it('renders hero overview and switches active task feed on tile click', () => {
      const dashboard = getHomeDashboardTasks(SAMPLE_TASKS);
      const handleClick = vi.fn();

      render(
        <MemoryRouter>
          <HomeView dashboard={dashboard} onTaskClick={handleClick} />
        </MemoryRouter>
      );

      // Verify Hero greeting and date
      expect(screen.getByText(/welcome back, demo user/i)).toBeInTheDocument();
      expect(screen.getByText('Tuesday, 17 November 2026')).toBeInTheDocument();

      // Verify all 4 tiles exist
      expect(screen.getByRole('button', { name: /view today tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view needs attention tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view upcoming tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view completed tasks/i })).toBeInTheDocument();

      // Default active tab is Today
      expect(screen.getByRole('heading', { name: /today's agenda/i })).toBeInTheDocument();
      expect(screen.getByText(/review q4 budget/i)).toBeInTheDocument();

      // Click Attention tile
      const attentionTile = screen.getByRole('button', { name: /view needs attention tasks/i });
      fireEvent.click(attentionTile);

      // Active list switches to Needs Attention
      expect(screen.getByRole('heading', { name: /needs attention/i })).toBeInTheDocument();
      expect(screen.getByText(/submit annual property insurance declaration/i)).toBeInTheDocument();

      // Click a task row to verify callback
      const taskRow = screen.getByLabelText(/task: submit annual property insurance declaration/i);
      fireEvent.click(taskRow);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('ListView Rendering and Category Filtering', () => {
    it('renders full list of tasks and filters by category', () => {
      const handleClick = vi.fn();
      const todayTasks = SAMPLE_TASKS.filter((t) => t.dueDate === '2026-11-17');

      render(
        <MemoryRouter>
          <ListView
            title="Today Tasks"
            description="All tasks due today"
            tasks={todayTasks}
            onTaskClick={handleClick}
          />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /today tasks/i })).toBeInTheDocument();

      // Filter by Personal
      const personalBtn = screen.getByRole('button', { name: /personal/i });
      fireEvent.click(personalBtn);

      // Verify personal tasks are rendered
      expect(screen.getByText(/submit vehicle registration renewal/i)).toBeInTheDocument();
    });
  });

  describe('TaskDetailModal', () => {
    it('displays task metadata and closes on Escape', () => {
      const handleClose = vi.fn();
      const task = SAMPLE_TASKS[0]; // Task with checkpoints

      render(<TaskDetailModal task={task} isOpen={true} onClose={handleClose} />);

      expect(screen.getByText(task.title)).toBeInTheDocument();
      expect(screen.getByText(task.description!)).toBeInTheDocument();
      expect(screen.getByText(/progress checkpoints/i)).toBeInTheDocument();

      // Test escape key
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('TaskCreateModal', () => {
    it('validates form submission, creates task and triggers close', () => {
      const handleClose = vi.fn();
      const handleCreate = vi.fn();

      render(
        <TaskCreateModal
          isOpen={true}
          onClose={handleClose}
          onCreateTask={handleCreate}
        />
      );

      expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/task title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Test Task' } });

      const saveBtn = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveBtn);

      expect(handleCreate).toHaveBeenCalledTimes(1);
      expect(handleCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Task',
          state: 'active',
        })
      );
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('WorkspaceLayout Integration', () => {
    it('renders workspace shell and navigates to subviews', () => {
      render(
        <MemoryRouter initialEntries={['/preview/today']}>
          <Routes>
            <Route path="/preview/*" element={<WorkspaceLayout />} />
          </Routes>
        </MemoryRouter>
      );

      // Header indicates Today view
      expect(screen.getByRole('heading', { name: /^today$/i })).toBeInTheDocument();

      // Verify persistent demo preview banner and single unmissable back button
      expect(screen.getByText('DEMO PREVIEW')).toBeInTheDocument();
      expect(screen.getByText(/interactive demo:/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /back to landing page/i })).toHaveAttribute('href', '/');

      // Sidebar links exist
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    it('creates a task and displays it in the view when New Task form is submitted', () => {
      render(
        <MemoryRouter initialEntries={['/preview/today']}>
          <Routes>
            <Route path="/preview/*" element={<WorkspaceLayout />} />
          </Routes>
        </MemoryRouter>
      );

      // Open modal via sidebar New Task button
      const newTaskBtn = screen.getByRole('button', { name: /new task/i });
      fireEvent.click(newTaskBtn);

      expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();

      // Enter task title
      const titleInput = screen.getByLabelText(/task title \*/i);
      fireEvent.change(titleInput, { target: { value: 'Buy Groceries for Dinner' } });

      // Submit form
      const saveBtn = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveBtn);

      // Modal is closed
      expect(screen.queryByRole('heading', { name: /create new task/i })).not.toBeInTheDocument();

      // New task appears in view and toast is shown
      expect(screen.getByText('Buy Groceries for Dinner')).toBeInTheDocument();
      expect(screen.getByText(/task "buy groceries for dinner" added/i)).toBeInTheDocument();
    });
  });
});
