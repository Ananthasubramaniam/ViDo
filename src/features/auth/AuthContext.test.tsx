import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

let authStateCallback: ((user: any) => void) | null = null;
const mockSignInWithPopup = vi.fn();
const mockFirebaseSignOut = vi.fn();

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({ currentUser: null })),
    connectAuthEmulator: vi.fn(),
    GoogleAuthProvider: class MockGoogleAuthProvider {},
    onAuthStateChanged: vi.fn((_auth, callback) => {
      authStateCallback = callback;
      // Default to null on initialization
      callback(null);
      return vi.fn();
    }),
    signInWithPopup: (...args: any[]) => mockSignInWithPopup(...args),
    signOut: (...args: any[]) => mockFirebaseSignOut(...args),
  };
});

function TestConsumer() {
  const { user, loading, authMode, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <div>Loading auth...</div>;
  }

  return (
    <div>
      <div data-testid="auth-mode">{authMode}</div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.displayName}` : 'Not logged in'}
      </div>
      <div data-testid="user-email">{user?.email || 'No email'}</div>
      <button type="button" onClick={() => signInWithGoogle()}>
        Sign In Button
      </button>
      <button type="button" onClick={() => signOut()}>
        Sign Out Button
      </button>
    </div>
  );
}

describe('AuthContext (Firebase / Emulator Lifecycle)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStateCallback = null;
  });

  it('initializes in emulator mode in dev environment and starts not logged in', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-mode').textContent).toBe('emulator');
      expect(screen.getByTestId('user-status').textContent).toBe('Not logged in');
    });
  });

  it('updates state when onAuthStateChanged emits a user', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Not logged in');
    });

    // Simulate Firebase Auth state emission (e.g. from emulator or popup)
    act(() => {
      if (authStateCallback) {
        authStateCallback({
          uid: 'firebase-user-123',
          displayName: 'Alex Morgan',
          email: 'alex.morgan@example.com',
          photoURL: null,
        });
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Logged in as Alex Morgan');
      expect(screen.getByTestId('user-email').textContent).toBe('alex.morgan@example.com');
    });
  });

  it('calls signInWithPopup when signInWithGoogle is invoked', async () => {
    mockSignInWithPopup.mockResolvedValueOnce({
      user: {
        uid: 'user-456',
        displayName: 'Sarah Chen',
        email: 'sarah.chen@example.com',
      },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const signInBtn = screen.getByRole('button', { name: /sign in button/i });
    fireEvent.click(signInBtn);

    expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
  });

  it('calls signOut and resets active user session', async () => {
    mockFirebaseSignOut.mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // First simulate logged-in user
    act(() => {
      if (authStateCallback) {
        authStateCallback({
          uid: 'user-789',
          displayName: 'Marcus Vance',
          email: 'marcus.vance@example.com',
        });
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Logged in as Marcus Vance');
    });

    const signOutBtn = screen.getByRole('button', { name: /sign out button/i });
    fireEvent.click(signOutBtn);

    expect(mockFirebaseSignOut).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Not logged in');
    });
  });
});
