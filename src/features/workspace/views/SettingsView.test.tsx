import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsView } from './SettingsView';

describe('SettingsView', () => {
  it('renders settings sections: theme, profile, preferences, and workspace actions', () => {
    render(
      <SettingsView
        isPreview={true}
        user={{ id: 'demo-1', name: 'Demo User', email: 'demo@vido.app' }}
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /appearance & themes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /profile & identity/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /task & planning preferences/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /workspace actions/i })).toBeInTheDocument();

    // Verify all 3 accents exist
    expect(screen.getByText('Cobalt Blue')).toBeInTheDocument();
    expect(screen.getByText('Deep Indigo')).toBeInTheDocument();
    expect(screen.getByText('Forest Green')).toBeInTheDocument();
  });

  it('switches active theme and updates document data-accent attribute', () => {
    localStorage.clear();
    render(<SettingsView isPreview={true} />);

    const greenCard = screen.getByTestId('accent-card-green');
    fireEvent.click(greenCard);

    expect(document.documentElement.getAttribute('data-accent')).toBe('green');
    expect(localStorage.getItem('vido_accent')).toBe('green');

    const indigoCard = screen.getByTestId('accent-card-indigo');
    fireEvent.click(indigoCard);

    expect(document.documentElement.getAttribute('data-accent')).toBe('indigo');
    expect(localStorage.getItem('vido_accent')).toBe('indigo');
  });

  it('allows updating user profile display name', () => {
    render(
      <SettingsView
        isPreview={true}
        user={{ id: 'user-123', name: 'Original Name', email: 'user@example.com' }}
      />
    );

    const nameInput = screen.getByLabelText(/display name/i);
    expect(nameInput).toHaveValue('Original Name');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    const saveBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveBtn);

    expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    expect(localStorage.getItem('vido_user_display_name')).toBe('Jane Doe');
  });

  it('allows updating task creation preferences', () => {
    render(<SettingsView isPreview={true} />);

    const categorySelect = screen.getByLabelText(/default category/i);
    fireEvent.change(categorySelect, { target: { value: 'work' } });

    const prioritySelect = screen.getByLabelText(/default priority/i);
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    const timeSelect = screen.getByLabelText(/default due time/i);
    fireEvent.change(timeSelect, { target: { value: '17:00' } });

    const savePrefsBtn = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(savePrefsBtn);

    expect(screen.getByText(/preferences saved!/i)).toBeInTheDocument();
    expect(localStorage.getItem('vido_pref_category')).toBe('work');
    expect(localStorage.getItem('vido_pref_priority')).toBe('high');
    expect(localStorage.getItem('vido_pref_duetime')).toBe('17:00');
  });

  it('triggers sign out callback when Sign Out button is clicked', () => {
    const handleSignOut = vi.fn();
    render(<SettingsView isPreview={true} onSignOut={handleSignOut} />);

    const signOutBtn = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutBtn);

    expect(handleSignOut).toHaveBeenCalledTimes(1);
  });

  it('allows adding and deleting personalised categories', async () => {
    const handleAddCat = vi.fn().mockResolvedValue({
      id: 'fitness',
      name: 'Fitness & Health',
      color: '#10b981',
      isCustom: true,
    });
    const handleDeleteCat = vi.fn();
    window.confirm = vi.fn().mockReturnValue(true);

    const initialCategories = [
      { id: 'personal', name: 'Personal', isCustom: false },
      { id: 'home', name: 'Household', isCustom: false },
      { id: 'work', name: 'Work', isCustom: false },
      { id: 'fitness', name: 'Fitness & Health', color: '#10b981', isCustom: true },
    ];

    render(
      <SettingsView
        isPreview={true}
        categories={initialCategories}
        onAddCategory={handleAddCat}
        onDeleteCategory={handleDeleteCat}
      />
    );

    expect(screen.getByRole('heading', { name: /personalised categories/i })).toBeInTheDocument();
    expect(screen.getByText('Fitness & Health')).toBeInTheDocument();
    expect(screen.getByText('Personalized')).toBeInTheDocument();

    // Create new category
    const catInput = screen.getByLabelText(/category name \*/i);
    fireEvent.change(catInput, { target: { value: 'Finance' } });
    const createBtn = screen.getByRole('button', { name: /create category/i });
    fireEvent.click(createBtn);

    expect(handleAddCat).toHaveBeenCalledWith({ name: 'Finance', color: '#305fdd' });

    // Delete custom category
    const deleteBtn = screen.getByRole('button', { name: /delete fitness & health category/i });
    fireEvent.click(deleteBtn);
    expect(handleDeleteCat).toHaveBeenCalledWith('fitness');
  });
});
