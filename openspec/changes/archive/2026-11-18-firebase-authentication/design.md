# Design: Firebase Authentication & Conflict-Free Local Testing

## Context

ViDo's frontend currently contains both a public marketing landing page (`/`) and an interactive preview (`/preview`) alongside an initial workspace layout (`/workspace`). To support real user identity while keeping `main` production-ready and friction-free for any developer cloning the project, we need an authentication layer that operates seamlessly in two environments: live Firebase in production and the local Firebase Auth Emulator Suite (`localhost:9099`) during local development.

See `proposal.md` for background and motivation, and `specs/user-authentication/spec.md` for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide a clean `useAuth()` hook delivering `user`, `loading`, `signInWithGoogle`, and `signOut`.
- Authenticate via real Firebase Auth popup when credentials are provided in `.env.local` or hosting environment.
- Support local development and testing via the official Firebase Auth Emulator Suite on `localhost:9099` using demo project IDs (`demo-vido`).
- Eliminate production conflicts: ensure production builds (`npm run build`) never reference localhost or emulator ports.
- Keep the user's workspace tasks synchronized with their authenticated profile.

**Non-Goals:**
- Backend Firestore or PostgreSQL database synchronization (deferred to a subsequent task persistence change).
- Multi-provider authentication (e.g. Email/Password, GitHub, Apple); Google OAuth is the sole identity provider.
- Complex RBAC or team permissions.

## Decisions

### 1. Unified Authentication Provider with Emulator Support
- **Decision**: Encapsulate authentication in `src/features/auth/AuthContext.tsx` providing a unified `useAuth()` hook. The client adapts to the runtime environment:
  1. **Production / Live Firebase**: When valid `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` are set and not running emulator flags, initialize official Firebase SDK and trigger live Google OAuth popup (`signInWithPopup(auth, googleProvider)`).
  2. **Firebase Auth Emulator Suite (CLI)**: When running in local development without live keys, or when `VITE_USE_FIREBASE_EMULATOR=true`, the app initializes with demo project credentials (`demo-vido`) and calls `connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })`. Developers can run `npm run emulators` to start the local emulator.
- **Alternative Considered**: Requiring custom in-browser mock modals. *Rejected*: The official Firebase Auth Emulator provides accurate, standard Firebase Auth behavior without bespoke mock UI layers.

### 2. Zero-Conflict Production Guard
- **Decision**: Read credentials via standard Vite environment variables (`import.meta.env.VITE_FIREBASE_*`). In production (`import.meta.env.PROD`), emulator connections are strictly disabled. Local testing never leaks into or breaks production deployments.

### 3. State & Profile Sync
- **Decision**: `WorkspaceLayout` and `HomeView` consume `user` from `useAuth()`. When `user` is authenticated, their display name, email, and avatar initials populate `WorkspaceTopBar` and `WorkspaceSidebar`. In development mode, a status badge indicates the active auth mode (`Live Firebase` vs `Emulator :9099`). Signing out triggers `signOut()` and cleanly navigates to `/`.

## Risks / Trade-offs

- **[Risk] Developer assumes local test mode is connected to cloud database** → **Mitigation**: Display a subtle, non-intrusive status pill in the top bar during dev mode indicating `Test Mode (Mock Auth)` vs `Live Firebase`.
- **[Risk] Accidental commit of `.env.local` with private keys** → **Mitigation**: `.env` and `.env*.local` are already ignored in `.gitignore`. Provide a clean `.env.example` with empty template values.
- **[Risk] Test suite failures from unmocked Firebase network calls** → **Mitigation**: Unit tests execute in local test mode by default, guaranteeing 100% deterministic, offline test runs.

