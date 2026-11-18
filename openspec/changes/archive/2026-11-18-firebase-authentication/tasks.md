# Tasks

## 1. Dependencies and Environment Configuration

- [x] 1.1 Install `firebase` package dependency and verify `package.json` updates cleanly
- [x] 1.2 Create `firebase.json` with Firebase Local Auth Emulator configuration (`port: 9099`, UI `port: 4000`) and add `"emulators"` npm script in `package.json`
- [x] 1.3 Create `.env.example` with documented Firebase configuration keys and verify `.env.local` remains ignored in `.gitignore`

## 2. Core Authentication and Emulator Integration

- [x] 2.1 Implement `src/features/auth/firebase.ts` with safe environment detection and `connectAuthEmulator` support for `demo-` projects or local emulator on port 9099
- [x] 2.2 Implement `src/features/auth/AuthContext.tsx` providing unified `useAuth()` that connects to live Firebase or the Firebase CLI Auth Emulator
- [x] 2.3 Create `src/features/auth/AuthContext.test.tsx` verifying Google sign-in trigger, onAuthStateChanged subscriber, and sign-out lifecycle

## 3. Application & UI Integration

- [x] 3.1 Wrap root application in `AuthProvider` in `src/App.tsx` and connect `LandingHeader`, `LandingHero`, and `NoticeModal` to `useAuth()`
- [x] 3.2 Connect `WorkspaceLayout`, `WorkspaceTopBar`, and `WorkspaceSidebar` to display authenticated user details, dev auth mode badge, and trigger sign-out
- [x] 3.3 Run and verify all checks: `npm run typecheck`, `npm test`, and `npm run build` compiling without errors
