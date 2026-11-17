# Design: Milestone 1 — Static Visual Foundation

## Context

The repository currently contains planning documents and specifications, with no frontend code. Milestone 1 establishes the client application architecture and visual system before backend or authentication services are introduced. Constraints are defined in [context.md](file:///c:/Users/jatin/Desktop/High-On-Code/Internship/ViDo/context.md) and [concept.html](file:///c:/Users/jatin/Desktop/High-On-Code/Internship/ViDo/concept.html).

## Goals / Non-Goals

**Goals:**
- Provide a clean, type-safe Vite + React 19 + TypeScript application structure.
- Implement Tailwind CSS using semantic design tokens mapped to CSS variables for instant theme/accent comparison.
- Implement client-side routing via React Router DOM for landing, workspace, and style lab experiences.
- Render deterministic task fixtures evaluated against a fixed benchmark date (`2026-11-17T12:00:00Z`).
- Deliver accessible modal dialogs with focus trapping, backdrop dismiss, and keyboard escape handling.

**Non-Goals:**
- No Supabase client libraries, database schemas, or API environment variables.
- No live OAuth flows or session tokens.
- No local storage persistence or in-memory state mutations for task fixtures.
- No responsive mobile drawer navigation (desktop-first focus for Milestone 1).

## Decisions

### 1. Application Routing & Layout Shells
- **Decision**: Use `react-router-dom` with a shared `WorkspaceLayout` for `/workspace` and nested sub-routes (`/workspace/today`, `/workspace/upcoming`, `/workspace/needs-attention`, `/workspace/completed`, `/workspace/archived`).
- **Rationale**: Enables deep-linking, realistic browser navigation, and independent view isolation while keeping the left sidebar persistent across view changes.
- **Alternatives Considered**: Single-state tab switching in local component state. Rejected because it prevents direct bookmarking, browser back/forward navigation, and deep URL inspection during review.

### 2. Styling Engine & Theme Variable Injection
- **Decision**: Configure Tailwind CSS with custom CSS variables (`--ink`, `--muted`, `--line`, `--surface`, `--canvas`, `--dark`, `--accent`, `--accent-soft`, `--green`, `--amber`, `--red`).
- **Rationale**: Directly mirrors the tokens established in `concept.html`. In the `/style-lab`, updating `document.documentElement` dataset dynamically switches between Cobalt Blue (`#305fdd`), Deep Indigo (`#4338ca`), and Forest Green (`#247a56`) with zero CSS rebuilds.
- **Alternatives Considered**: Pure CSS modules. Rejected due to slower iteration and duplicate utility styling across complex dashboard cards.

### 3. Deterministic Fixture Calculation
- **Decision**: Represent tasks as strictly typed TypeScript records (`SampleTask`) evaluated against a constant reference date: `2026-11-17T12:00:00Z`.
- **Rationale**: Prevents dynamic date drift between local runs and automated tests. A task scheduled for November 17 will always appear under "Today", ensuring reliable automated assertions and consistent visual review.
- **Alternatives Considered**: Dynamic `new Date()` calculations. Rejected because tasks would silently shift from "Upcoming" to "Today" or "Overdue" depending on when the reviewer tests the build.

### 4. Component Hierarchy & Modal Management
- **Decision**: Place modals (`TaskDetailModal`, `TaskCreateModal`) at the root of `WorkspaceLayout` controlled via simple query params or local UI state with standard accessibility semantics (`role="dialog"`, `aria-modal="true"`, focus management).
- **Rationale**: Keeps modal rendering centered, eliminates z-index fighting with sidebar elements, and ensures clean focus trapping and Escape key behavior.

### 5. Home Dashboard Command Center & Scannable Rows
- **Decision**: Refactor the Home view from four vertical 3-column card grids into a Dark Navy (`--dark: #1c2028`) rectangular Hero Overview card with four clickable category tiles (Today, Needs Attention, Upcoming, Completed) controlling a focused single-line task rows list below.
- **Rationale**: Eliminates the cognitive clutter of 14 concurrent floating cards, establishes immediate visual hierarchy with Today as the anchor, and allows smooth in-place inspection without leaving the Home dashboard.
- **Alternatives Considered**: Multi-column board/Kanban or full-page tab redirects. Rejected to maintain a calm, scannable, desktop-first command center experience.

## Risks / Trade-offs

- **[Risk]** Deep links to `/workspace/today` fail with 404 on naive static file hosts without SPA rewrite rules.  
  → **Mitigation**: Document standard SPA fallback configurations in `README.md` and ensure local Vite preview serves `index.html` fallback.
- **[Risk]** Accidental leak of mock Supabase client code into frontend bundles.  
  → **Mitigation**: Exclude all Supabase packages from `package.json` until Milestone 2 is formally initiated.

## Migration Plan

1. Initialize Vite project with React + TypeScript.
2. Install minimal runtime dependencies: `react`, `react-dom`, `react-router-dom`, `lucide-react`.
3. Install development tooling: `tailwindcss`, `@tailwindcss/vite` (or PostCSS), `typescript`, `vitest`, `happy-dom`, `@testing-library/react`.
4. Implement shared UI tokens, fixtures, layout shells, landing page, workspace views, and style lab.
5. Verify build, type-check, and component tests.

