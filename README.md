<div align="center">

# ViDo

### See the work. Share the progress. Deliver together.

A modern task-management workspace built for focused individuals and transparent teams.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

[Vision](./Idea.md) · [Living Concept](./concept.html) · [Folder Structure](./FOLDER_STRUCTURE.md) · [Agent Guidelines](./AGENTS.md) · [Contributing](./CONTRIBUTING.md)

</div>

---

## 📌 Table of Contents

- [📖 Overview & Philosophy](#-overview--philosophy)
- [🗺️ Application Routes](#️-application-routes)
- [✨ Core Features](#-core-features)
- [⚡ Quick Start for Developers](#-quick-start-for-developers)
- [🔐 Firebase Emulator Setup](#-firebase-emulator-setup)
- [🧪 Verification & Scripts](#-verification--scripts)
- [🗂️ Architecture & Code Organization](#️-architecture--code-organization)
- [🎨 Design System & Theme Tokens](#-design-system--theme-tokens)
- [🛠️ Tech Stack](#️-tech-stack)
- [🤝 Contributing Guidelines](#-contributing-guidelines)
- [💡 Core Principles](#-core-principles)

---

## 📖 Overview & Philosophy

### Why ViDo?

A simple checkbox tells you that something is done. It does not tell you **how the work is going**.

ViDo gives every responsibility a precise deadline, measurable progress, clear status, and a chronological checkpoint history. Individuals stay focused in a calm, distraction-free environment while teams coordinate from a shared source of truth—without turning every status check into another meeting.

> **ViDo turns “What is the status?” into a question the workspace already answers.**

### The Experience

ViDo provides three interactive surfaces:

- **`/` — Public Landing Page**: Value proposition, feature preview, and Google sign-in entry point.
- **`/preview/*` — Interactive Product Demo**: Deterministic sample data with a persistent demo banner, dashboard, task views, planning calendar, and completion analytics. Demo planning data stays in the browser (`localStorage`).
- **`/workspace/*` — Authenticated Workspace**: The same shell backed by the local Firebase emulator suite. Sign-in uses the Auth emulator and planning/calendar data is scoped per user in Firestore.
- **`/style-lab` — Theme Lab**: Live accent palette switching across the design system.

<table>
<tr>
<td width="50%" valign="top">

### 👤 Personal Responsibilities

A focused space for personal and household planning.

- Organize individual responsibilities
- Set exact dates and deadline times
- Track progress incrementally from 0% to 100%
- Maintain a chronological checkpoint update history
- Automatically separate active, overdue, and completed work

</td>
<td width="50%" valign="top">

### 👥 Shared Coordination

A transparent space for collaborative execution.

- Organize focused workspaces
- Clear assignment and ownership
- Follow progress and checkpoint updates
- Flag late deliveries automatically
- Coordinated history without redundant meetings

</td>
</tr>
</table>

---

## 🗺️ Application Routes

| Route | Description |
|---|---|
| `/` | Public landing page with preview, design principles, and sign-in flow. |
| `/workspace/*` | Authenticated workspace (Firebase Auth `:9099`, Firestore `:8080`, `demo-vido` project). |
| `/preview/*` | Full guest demo with deterministic sample data and browser-local planning state. |
| `/preview\|workspace/tasks` | Filterable task management view for active responsibilities. |
| `/preview\|workspace/today`, `/upcoming`, `/needs-attention`, `/completed`, `/archived` | Section-specific task lists derived from shared filters. |
| `/preview\|workspace/calendar` | Weekly/monthly planning calendar combining ViDo tasks and emulator-backed calendar events. |
| `/preview\|workspace/analytics` | Completion analytics with editable weekly/monthly targets and cumulative progress. |
| `/style-lab` | Interactive sandbox for `Cobalt Blue`, `Deep Indigo`, and `Forest Green` accent palettes. |

---

## ✨ Core Features

### 🔐 Authentication & Session Management
- **Google sign-in (emulator)**: Popup-based sign-in powered by Firebase Authentication against the local Auth emulator.
- **No real credentials required**: The default `demo-vido` project and emulator suite run entirely on your machine.
- **Per-user planning data**: Calendar connection, calendar events, and weekly/monthly targets are stored in Firestore under `users/{uid}` for signed-in users.
- **Zero-barrier demo**: `/preview/*` is fully interactive without an account.

### ✅ Task Lifecycle & Checkpoints
- **Incremental progress tracking**: Measure work continuously rather than relying on binary done/not-done toggles.
- **Timestamped checkpoints**: Keep a chronological audit trail of updates for every responsibility.
- **Deadline-aware views**: Shared filters power Today, Upcoming, Needs Attention, Completed, and Archived sections.

### 🗓️ Planning Calendar
- Unified **weekly** and **monthly** layouts showing ViDo tasks and calendar commitments together.
- **Connect Google Calendar (emulator)** seeds sample events locally; no external Google APIs are contacted.
- **Task ↔ event flows**: add a task to the calendar as a linked event, import an event as a task, or create/remove manual events.
- Live events are stored at `users/{uid}/calendarEvents`; preview events are stored in `localStorage`.

### 📊 Completion Analytics
- Weekly completion percentage and progress against a user-set weekly target.
- Monthly goal tracking with cumulative totals contributed by each week.
- Editable targets persisted per user in Firestore (live) or in `localStorage` (preview), with progress bars and roll-up charts.

### 🎨 Living Design System
- Desktop-first, contrast-compliant UI with semantic CSS custom properties.
- Three live accent palettes in `/style-lab`.

---

## ⚡ Quick Start for Developers

### Prerequisites

- **Node.js 18+** (Node 20+ LTS recommended)
- **npm** (comes with Node)
- **Java 11+** (required by the Firebase Emulator Suite) — verify with `java -version`
- **Firebase CLI** (recommended): `npm install -g firebase-tools`

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vicharanashala/ViDo.git
   cd ViDo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Vite will attempt to start missing Auth/Firestore emulators automatically when Java and the Firebase CLI are available.

4. **(Optional) Start the full emulator suite manually in a separate terminal:**
   ```bash
   npm run emu
   ```

5. **Open the app:**
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🔐 Firebase Emulator Setup

ViDo is configured for **zero-friction local testing**. No Google Cloud account, credit card, or live Firebase credentials are required.

- **Auth emulator**: `127.0.0.1:9099`
- **Firestore emulator**: `127.0.0.1:8080`
- **Emulator UI**: `127.0.0.1:4000` (when running `npm run emu` / `npm run emulators`)
- **Project ID**: `demo-vido`

Configuration lives in [`.env.example`](./.env.example), [`firebase.json`](./firebase.json), [`firestore.rules`](./firestore.rules), and [`firestore.indexes.json`](./firestore.indexes.json).

### Interactive Sign-In Flow

1. Open `http://localhost:5173`.
2. Click **Continue with Google** / **Sign In to Dashboard**.
3. Choose any mock account in the Firebase Auth emulator popup.
4. You are taken to `/workspace` with a per-user workspace.
5. Use **Calendar** to connect the emulator calendar, add/import events, and manage planning items; use **Analytics** to adjust weekly/monthly targets.
6. Click **Sign Out** to return to the landing page.

---

## 🧪 Verification & Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server (and attempts to auto-start missing emulators). |
| `npm test` | Runs the Vitest suite. |
| `npm run test:watch` | Runs Vitest in watch mode. |
| `npm run typecheck` | Validates TypeScript types with zero emit (`tsc -b --noEmit`). |
| `npm run build` | Builds an optimized production bundle into `dist/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run emulators` / `npm run emu` | Starts the Firebase emulator suite for `demo-vido` (Auth + Firestore + UI). |
| `npm run emu:export` | Exports emulator data to `./firebase-export-local`. |
| `npm run emu:import` | Starts emulators importing/exporting local data. |

### Mandatory Pre-Commit Check

```bash
npm run typecheck && npm test && npm run build
```

---

## 🗂️ Architecture & Code Organization

ViDo follows a **feature-driven, modular frontend architecture**. For the complete directory tree and placement rules, see **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)**.

### Key Boundaries

- **UI Primitives (`src/components/ui/`)**: Reusable, accessible, domain-agnostic components (`Button`, `Card`, `Badge`, `Input`, `NoticeModal`). They never import domain models.
- **Feature Slices (`src/features/`)**: Vertical slices for `landing/`, `auth/`, `workspace/`, and `style-lab/`.
- **Data & Pure Logic (`src/data/`)**: Types, deterministic fixtures, filters, calendar helpers, and analytics calculations.
- **Firebase & Persistence (`src/lib/`)**: Firebase/Firestore initialization, calendar event store, and planning-target settings store.
- **Colocated Tests**: Tests live alongside the code they verify.

---

## 🎨 Design System & Theme Tokens

ViDo uses Tailwind CSS v4 with semantic CSS custom properties:

| Token | CSS Variable | Purpose |
|---|---|---|
| Canvas | `var(--canvas)` | Main application background. |
| Surface | `var(--surface)` | Card, panel, and modal containers. |
| Ink | `var(--ink)` | Primary headings and text. |
| Muted | `var(--muted)` | Secondary labels and metadata. |
| Faint | `var(--faint)` | Placeholder/disabled states. |
| Line | `var(--line)` | Borders and dividers. |
| Accent | `var(--accent)` | Primary brand/active states. |
| Accent Soft | `var(--accent-soft)` | Subdued tints and badges. |

> Explore accent palettes interactively at `/style-lab`.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | [React 19](https://react.dev/) | Component-based UI. |
| Auth & Data | [Firebase 13](https://firebase.google.com/) | Auth + Firestore against the local emulator suite. |
| Bundler | [Vite 6](https://vite.dev/) | Dev server and production builds. |
| Language | [TypeScript 5.7](https://www.typescriptlang.org/) | Type safety. |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling with CSS variables. |
| Routing | [React Router 7](https://reactrouter.com/) | Client-side routing. |
| Icons | [Lucide React](https://lucide.dev/) | Iconography. |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) | DOM/unit/integration tests in Happy DOM. |

---

## 🤝 Contributing Guidelines

Please review **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the full workflow and PR checklist.

1. **Bug fixes**: search existing issues or open one with reproduction steps.
2. **UI redesigns/features**: start a discussion first to align on scope and design.
3. **Branch, implement, and verify**:
   ```bash
   npm run typecheck && npm test && npm run build
   ```
4. **Open a PR** with issue/discussion links and before/after evidence for UI changes.

---

## 💡 Core Principles

```text
Clarity over complexity          History over guesswork
Privacy by default               Collaboration without noise
Trustworthy foundations          AI that drives useful action
```

---

<div align="center">

**ViDo** · Progress made visible  
Built with precision for focused execution.

</div>
