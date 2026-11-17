import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('LandingPage Integration', () => {
  it('renders landing page with headline, preview, benefits, and footer', () => {
    render(<App />);

    // Header brand
    expect(screen.getAllByText('ViDo')[0]).toBeInTheDocument();

    // Hero title
    expect(
      screen.getByRole('heading', {
        name: /simple enough for anyone\. structured enough for serious work\./i,
      })
    ).toBeInTheDocument();

    // Use cases
    expect(screen.getByText('Personal Tasks')).toBeInTheDocument();
    expect(screen.getByText('Household & Living')).toBeInTheDocument();
    expect(screen.getByText('Work & Projects')).toBeInTheDocument();

    // Principles
    expect(screen.getByText('Clarity over complexity')).toBeInTheDocument();
    expect(screen.getByText('History over guesswork')).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('opens and closes sign in modal on Google sign in click', () => {
    render(<App />);

    const signInBtn = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(signInBtn);

    expect(
      screen.getByRole('heading', { name: /welcome to vido/i })
    ).toBeInTheDocument();

    // Close with Back
    const cancelBtn = screen.getByRole('button', { name: /back/i });
    fireEvent.click(cancelBtn);

    expect(
      screen.queryByRole('heading', { name: /welcome to vido/i })
    ).not.toBeInTheDocument();
  });

  it('navigates to live preview when Enter Live Preview is clicked in modal', () => {
    render(<App />);

    const signInBtn = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(signInBtn);

    const enterBtn = screen.getByRole('button', { name: /enter live preview/i });
    fireEvent.click(enterBtn);

    expect(screen.getByText('Interactive Preview')).toBeInTheDocument();
    expect(screen.getByText('Logged-in demo preview')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to landing page/i })).toBeInTheDocument();
  });
});
