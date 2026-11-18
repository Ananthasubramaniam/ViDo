# Proposal

## Why

ViDo needs user authentication to transition from an anonymous preview into an authenticated productivity workspace where user accounts and personal tasks are recognized. Simultaneously, because the repository is open for development and reviewers, anyone who clones `main` must be able to run and test the application immediately without being blocked by missing Firebase API keys or external Google Cloud setup, and without introducing conflicts into the live production deployment.

## What Changes

- **Firebase SDK Integration**: Add the official `firebase` Web SDK dependency to support Google OAuth via popup sign-in.
- **Firebase Auth Emulator Integration**: Configure `firebase.json` (Auth emulator on port 9099, Emulator UI on port 4000) and `npm run emulators` script, enabling developers to test locally against the official Google Auth emulator using `connectAuthEmulator` with zero external cloud dependencies or real credentials required.
- **Landing Page & Modal Transition**: Connect the landing page Google sign-in triggers (`LandingHeader`, `LandingHero`, `NoticeModal`) to the authentication provider, logging users into `/workspace`.
- **Authenticated Identity & Sign Out**: Render the authenticated user profile (name, initials, email) in the top bar and left sidebar, with a one-click Sign Out action that cleanly terminates the session and returns to the landing page.
- **Zero-Conflict Production Safety**: Use compile-time environment switches (`import.meta.env.PROD` vs `DEV`) to guarantee that production builds never connect to localhost emulator ports or simulator code, while local development builds never crash with missing API key errors.
- **Template Configuration**: Provide `.env.example` documenting all necessary Firebase environment variables for contributors wanting live Firebase connectivity.

## Capabilities

### New Capabilities

- `user-authentication`: Manages user identity, Google OAuth sign-in flow, user session observation, logout lifecycle, and Firebase Auth Emulator support.

### Modified Capabilities

*(None - this is the first specification for authentication)*

## Impact

- **Dependencies**: Adds `firebase` to `package.json`.
- **New Feature Folder**: `src/features/auth/` (Auth context and Firebase client initialization).
- **Modified Components**: `src/App.tsx`, `src/features/landing/LandingHeader.tsx`, `src/features/landing/LandingHero.tsx`, `src/components/ui/NoticeModal.tsx`, `src/features/workspace/WorkspaceLayout.tsx`.
- **Environment Configuration**: Adds `.env.example` (with `.env.local` kept safely in `.gitignore`).

