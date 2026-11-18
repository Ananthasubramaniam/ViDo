<div align="center">

# ViDo

### See the work. Share the progress. Deliver together.

A modern task-management workspace built for focused individuals and transparent teams.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

[Vision](./Idea.md) · [Living Concept](./concept.html) · [Folder Structure](./FOLDER_STRUCTURE.md) · [Agent Guidelines](./AGENTS.md) · [Firebase Testing Setup](#firebase-testing-setup) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started)

</div>

---

## Why ViDo?

A simple checkbox tells you that something is done. It does not tell you **how the work is going**.

ViDo gives every responsibility a precise deadline, measurable progress percentage, a clear owner, and a chronological checkpoint history. Individuals stay focused in a calm, distraction-free environment while teams coordinate from a shared source of truth—without turning every status check into another meeting.

> **ViDo turns “What is the status?” into a question the workspace already answers.**

---

## Interactive Application Routes

The application features a fully interactive visual foundation:

- **`/` — Public Landing Page**: Universal value proposition highlighting personal tasks, household management, and serious work projects with an interactive preview frame, sign-in dialog, and design principles.
- **`/workspace` — Authenticated Workspace**: The full personal workspace powered by Google OAuth via Firebase Authentication. Features user-scoped task persistence, profile badge, and sign-out controls.
- **`/preview` — Interactive Product Demo**: A high-fidelity preview of the workspace experience using deterministic sample data (`Demo User`), accessible without signing in:
  - **Sticky Top Demo Banner**: Pinned announcement with left-aligned **`Back to Landing Page`** navigation.
  - **Dark Navy Command Center**: Snapshot hero card with 4 interactive summary tiles (*Today*, *Needs Attention*, *Upcoming*, and *Done (7d)*).
  - **Horizontal Task Rows**: Compact, scannable responsibilities with priority badges, progress bars, checkpoint counts, and modal inspectors.
  - **Section Views**: Dedicated subroutes for `/preview/today`, `/preview/upcoming`, `/preview/needs-attention`, `/preview/completed`, and `/preview/archived`.
- **`/style-lab` — Theme & Accent Palette Lab**: Live design system sandbox testing the primary accent palettes (`Cobalt Blue`, `Deep Indigo`, and `Forest Green`).

---

## The Experience

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

## Features

### 🔐 Authentication & Session Management
- Fast, frictionless Google OAuth sign-in.
- Local testing via Firebase Auth Emulator (`localhost:9099`) with automatic Vite orchestration.
- User-scoped workspace persistence storing tasks under each authenticated user's ID.
- Open public interactive preview (`/preview/*`) with deterministic sample data for guests.

### ✅ Task Lifecycle & Checkpoints
- Create, inspect, complete, and archive tasks with deterministic sample data.
- Measure incremental progress percentage (0–100%) instead of relying on binary done/not done.
- Timestamped progress checkpoints preserving notes, blockers, and decisions.
- Automatic detection for overdue work and late completions.

### 🎯 Calm, Section-Limited Views
- **Today's Agenda**: Responsibilities scheduled for today.
- **Needs Attention**: Overdue or high-priority items requiring immediate focus.
- **Upcoming Schedule**: Future responsibilities scheduled beyond today.
- **Delivered**: Finished responsibilities with recorded completion dates and delivery timing.
- **Archived**: Shelved tasks preserved with their complete historical audit trail.

### 🎨 Design System & Theme Lab
- Desktop-first, clean light theme with subtle borders and balanced contrast.
- Three live accent palettes (`Cobalt Blue`, `Deep Indigo`, `Forest Green`) switchable via CSS custom properties.
- Accessible keyboard navigation and WCAG-compliant contrast ratios.

---

## Getting Started

### Prerequisites
- **Node.js 18+** (Node 20+ recommended)
- **npm** or **pnpm**
- *(Optional for local auth emulator)*: **Java JRE 11+** (`java -version`) for running the Firebase Emulator Suite locally

### Installation

```bash
# Clone the repository
git clone https://github.com/vicharanashala/ViDo.git
cd ViDo

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Firebase Testing Setup

ViDo uses the **Firebase Auth Emulator** for frictionless, credential-free local development and testing.

### Local Development & Testing

No external cloud account or API keys are required to test authentication locally:

- **Automatic Emulator Orchestration**: Running `npm run dev` automatically checks if the Firebase Auth Emulator is active on port `9099`. If not, Vite checks your local environment for Java and Firebase CLI, and automatically launches the emulator in the background with the `demo-vido` project.
- **Prerequisites**: Ensure Java (JRE 11+) is installed (`java -version`). If the Firebase CLI is not installed globally (`npm install -g firebase-tools`), Vite runs it seamlessly via `npx`.
- **Manual Launch** (optional): If you prefer running the emulator in a dedicated terminal:
  ```bash
  npx firebase-tools emulators:start --only auth --project demo-vido
  ```
- **Testing Sign-In in the Browser**:
  1. Click **Sign In to Dashboard** or **Continue with Google** on the landing page (`/`).
  2. The Firebase Auth Emulator popup opens, allowing you to sign in with any mock user email or name.
  3. You are redirected into `/workspace`, where tasks you create are stored in your browser's local storage scoped to your mock user ID.
  4. Clicking **Sign Out** returns you to the landing page and clears the session.
- **Automated Test Suite**: Running `npm test` executes the complete test suite with mocked auth handlers (requires no running emulator or network access).

---

## Verification & Scripts

```bash
# Run unit and integration tests (38 tests across 10 suites)
npm test

# Run TypeScript typecheck without emitting files
npm run typecheck

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

> For complete directory guidelines, placement rules, and anti-patterns, see **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** and **[AGENTS.md](./AGENTS.md)**.

```text
ViDo/
├── src/
│   ├── components/ui/         # Reusable UI primitives (Button, Badge, Card, Input, NoticeModal)
│   ├── data/                  # Deterministic sample tasks, checkpoints, and filter logic
│   ├── features/
│   │   ├── auth/              # Firebase client, AuthContext, user session, and Google sign-in
│   │   ├── landing/           # Landing page (Header, Hero, Preview, Use Cases, Footer)
│   │   ├── style-lab/         # Live accent theme switcher and component showcase
│   │   └── workspace/         # Authenticated dashboard preview, sidebar, topbar, views, and modals
│   ├── test/                  # Test setup and happy-dom configuration
│   ├── App.tsx                # Client-side router configuration (/ , /workspace, /preview/*, /style-lab)
│   └── main.tsx               # Application bootstrap and CSS entry
├── openspec/                  # OpenSpec specifications and archived changes
├── vercel.json                # Vercel SPA routing configuration
├── tailwind.config.js / CSS   # Tailwind CSS v4 styling rules
├── vite.config.ts             # Vite configuration with automatic Firebase emulator lifecycle and Vitest
└── package.json
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 | Declarative, component-based user interface |
| **Authentication** | Firebase 12 (Auth) | Google OAuth with emulator fallback and session management |
| **Bundler & Tooling** | Vite 6 | Rapid development server, automated emulator check, and ESM builds |
| **Language** | TypeScript | Strong typing, maintainability, and compile-time safety |
| **Styling** | Tailwind CSS v4 | Utility-first, semantic CSS custom property styling |
| **Icons** | Lucide React | Consistent, accessible iconography |
| **Testing** | Vitest + Happy DOM + Testing Library | Fast unit and integration tests |

---

## Product Principles

```text
Clarity over complexity          History over guesswork
Privacy by default               Collaboration without noise
Trustworthy foundations          AI that drives useful action
```

---

<div align="center">

**ViDo** · Progress made visible

</div>
