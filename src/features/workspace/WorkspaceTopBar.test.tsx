import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkspaceTopBar } from './WorkspaceTopBar';

describe('WorkspaceTopBar', () => {
  it('renders title, subtitle, search placeholder, and preview badge', () => {
    const handleFocus = vi.fn();
    render(
      <MemoryRouter>
        <WorkspaceTopBar
          title="Home Overview"
          subtitle="Daily task summary"
          onSearchFocus={handleFocus}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /home overview/i })).toBeInTheDocument();
    expect(screen.getByText('Daily task summary')).toBeInTheDocument();
    expect(screen.getByText('Interactive Preview')).toBeInTheDocument();
    expect(screen.getByText('Demo User')).toBeInTheDocument();
    expect(screen.getByText('Personal Workspace')).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/search tasks/i);
    fireEvent.focus(searchInput);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });
});
