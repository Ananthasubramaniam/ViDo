# Tasks: Milestone 1 — Static Visual Foundation

## 1. Project Scaffolding and Build Foundation

- [x] 1.1 Initialize clean Vite + React 19 + TypeScript application with configured tsconfig and verify `npm run build` succeeds
- [x] 1.2 Configure Tailwind CSS with semantic tokens and CSS variable bindings (`concept.html` alignment) and verify stylesheet compilation
- [x] 1.3 Configure Vitest and Happy DOM testing setup and verify initial test runner execution

## 2. Shared Design System & Style Lab

- [x] 2.1 Implement reusable UI primitives (Button, Badge, Card, Input) with high-contrast focus rings and verify component unit tests
- [x] 2.2 Implement `/style-lab` route with candidate accent switcher (Cobalt Blue `#305fdd`, Deep Indigo `#4338ca`, Forest Green `#247a56`) and verify theme switching tests

## 3. Public Landing Page

- [x] 3.1 Build landing page navigation header, universal hero section, and non-functional Google sign-in button with preview notice, verifying hero render tests
- [x] 3.2 Build realistic dashboard preview mockup illustration and Personal, Home, and Work use-case cards, verifying card render tests
- [x] 3.3 Build core benefits section and footer with project documentation links, verifying complete landing page integration tests

## 4. Deterministic Sample Fixtures & Workspace Shell

- [x] 4.1 Create typed sample task fixtures evaluated deterministically against 17 November 2026 and verify relative date filtering tests
- [x] 4.2 Build persistent desktop sidebar with Home, Today, Upcoming, Needs Attention, Completed, and Archived navigation, verifying active link tests
- [x] 4.3 Build top bar shell with search input placeholder, filter placeholder, and sample user profile badge, verifying top bar tests
- [x] 4.4 Build Home dashboard view enforcing section limits (Today ≤ 5, Needs Attention ≤ 3, Upcoming ≤ 3, Recently Completed ≤ 3) with "View all" links, verifying limit assertions
- [x] 4.5 Build dedicated list views for Today, Upcoming, Needs Attention, Completed, and Archived routes, verifying route render tests
- [x] 4.6 Refactor Home dashboard into a Dark Navy Hero Overview with interactive summary tiles and scannable row list, verifying layout tests

## 5. Modal Concepts & Verification Gate

- [x] 5.1 Implement centered task-creation concept modal with field placeholders, focus trapping, and Escape key dismissal, verifying modal interaction tests
- [x] 5.2 Implement centered task-detail concept modal with status badges, metadata attributes, and timeline placeholder, verifying modal interaction tests
- [x] 5.3 Execute comprehensive quality check (`npm run typecheck`, `npm test`, `npm run build`) and verify all tests pass without errors

## Workflow follow-up

- Present Review Gate 1 evidence (visual direction, landing page, dashboard density, and accent candidates) for user review.
- Do not begin Milestone 2 (Google Authentication) until Review Gate 1 is approved.

