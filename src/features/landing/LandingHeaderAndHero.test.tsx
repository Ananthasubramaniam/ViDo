import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingHeader } from './LandingHeader';
import { LandingHero } from './LandingHero';

describe('LandingHeader and LandingHero', () => {
  it('renders landing header with navigation links and triggers sign in click', () => {
    const handleSignIn = vi.fn();
    render(
      <BrowserRouter>
        <LandingHeader onGoogleSignInClick={handleSignIn} />
      </BrowserRouter>
    );

    expect(screen.getByText('ViDo')).toBeInTheDocument();
    expect(screen.getByText('Themes')).toBeInTheDocument();
    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInBtn);
    expect(handleSignIn).toHaveBeenCalledTimes(1);
  });

  it('renders universal hero message and CTA', () => {
    const handleSignIn = vi.fn();
    render(
      <BrowserRouter>
        <LandingHero onGoogleSignInClick={handleSignIn} />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /simple enough for anyone\. structured enough for serious work\./i,
      })
    ).toBeInTheDocument();

    const googleBtn = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleBtn);
    expect(handleSignIn).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('link', { name: /live preview/i })).toBeInTheDocument();
  });
});
