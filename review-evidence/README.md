# ViDo — Product Verification Evidence

**Date:** 17 November 2026  
**Status:** Build and verification complete

---

### Verification Results

| Check | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Type Check** | `npm run typecheck` | Passed | Strict TypeScript across all modules, zero errors |
| **Unit Tests** | `npm test` | Passed | 27/27 tests passed across 9 test suites |
| **Production Build** | `npm run build` | Passed | Clean production bundle in `dist/` |
| **Section Limits** | Automated assertions | Passed | Today (≤5), Needs Attention (≤3), Upcoming (≤3), Recently Completed (≤3) |
| **Accessibility** | Focus indicators & Escape key | Passed | High-contrast focus rings, Escape dismiss, dialog semantics |

---

### Key Product Areas

1. **Public Landing Page (`/`)**:
   - Headline: *"Simple enough for anyone. Structured enough for serious work."*
   - Clean product introduction, realistic dashboard preview, and audience cards (Personal, Household, Professional).
   - Core product principles: Clarity, History, Privacy, and Low-noise collaboration.

2. **Themes & Accent Lab (`/style-lab`)**:
   - Interactive accent palette switcher:
     - **Cobalt Blue** (`#305fdd`) — Classic, crisp productivity.
     - **Deep Indigo** (`#4338ca`) — High contrast, refined tone.
     - **Forest Green** (`#247a56`) — Calm, steady, organic focus.
   - Live component token showcase (buttons, badges, inputs, task cards).

3. **Workspace Dashboard (`/workspace`)**:
   - Persistent desktop navigation sidebar with live count badges.
   - Top bar with search input, priority filter, and user profile.
   - Home view with section limits and *"View all"* navigation links.
   - Dedicated views for Today, Upcoming, Needs Attention, Completed, and Archived.
   - Task Creation and Task Details modals.

---

### How to Run Locally

```bash
# Run local development server
npm run dev

# Or serve production build
npm run preview
```
- Landing Page: `http://localhost:5173/`
- Themes: `http://localhost:5173/style-lab`
- Workspace: `http://localhost:5173/workspace`
