# Proposal: Milestone 1 — Static Visual Foundation

## Why

ViDo needs an unambiguous visual and experiential baseline before connecting backend services like Supabase or Google OAuth. Building the static visual shell first allows stakeholders to validate information density, navigation feel, desktop layout, accessibility focus states, and accent styling without the distraction and complexity of live database state or authentication errors.

## What Changes

- Create a modern, maintainable Vite + React + TypeScript desktop-first application foundation.
- Integrate Tailwind CSS configured with neutral surfaces, subtle borders, and restrained visual tokens aligned with `concept.html`.
- Build a public landing page (`/`) featuring an honest value proposition, non-functional Google sign-in button, realistic dashboard preview illustration, and use-case cards (Personal, Home, Work).
- Build a persistent desktop workspace shell (`/workspace` and `/workspace/:view`) with navigation links for Home, Today, Upcoming, Needs Attention, Completed, and Archived.
- Implement strict section limits for the Home view (`Today ≤ 5`, `Needs Attention ≤ 3`, `Upcoming ≤ 3`, `Recently Completed ≤ 3 within 7 days`) using deterministic sample task fixtures anchored to a benchmark review date (17 November 2026).
- Implement centered, non-functional modal concepts for task detail inspection and task creation.
- Implement an interactive style lab (`/style-lab`) comparing three restrained accent palette candidates (Cobalt Blue `#305fdd`, Deep Indigo `#4338ca`, and Forest Green `#247a56`).
- Enforce strict exclusion of backend persistence, live Supabase keys, Google OAuth sessions, and multi-user/team features from this milestone.

## Capabilities

### New Capabilities
- `landing-page`: Public introduction displaying product value, preview mockup, use-case cards, and a non-functional sign-in entry point.
- `workspace-shell`: Desktop workspace interface providing persistent navigation, section-limited task overviews, and accessible modal concepts for task creation and details.
- `style-lab`: Accent palette and component lab for evaluating design tokens, focus indicators, and visual hierarchy across candidate themes.

### Modified Capabilities
<!-- None: Initial project foundation -->

## Impact

- **Frontend Application**: Creates initial source tree under `src/` including components, features, routing, and styling.
- **Dependencies**: Adds React, React Router DOM, Lucide React (or SVG icons), Tailwind CSS, Vite, Vitest, and Oxlint/Prettier scripts.
- **Backend/Auth**: Intentionally zero impact. No backend credentials or OAuth callbacks configured.

