# ViDo — Idea and Product Vision

## The Idea

ViDo is a collaborative task management application designed around a simple belief: a task is more useful when its progress and history are visible, not merely whether it is open or done.

Most task tools reduce work to a binary checkbox. Real work is incremental. A task can be 20% complete, blocked after an important discovery, nearly finished but at risk of missing its deadline, or completed late with valuable context attached. ViDo captures that journey.

Individuals receive a private place to organize their responsibilities. Teams receive a shared source of truth where ownership, deadlines, progress, and updates are visible without repeatedly asking for status reports.

## Project Origin

ViDo began as a deliberately simple to-do application that could grow in four understandable phases:

1. A minimal personal to-do list.
2. Authentication and support for multiple users.
3. Shared tasks with comments and threaded replies.
4. A flagship embedded AI agent for task generation and intelligent recommendations.

The simplicity is intentional. A to-do list is familiar to almost everyone, making it a useful product to build and an approachable case study for learning how a real application evolves. Although MERN was discussed initially, the meeting explicitly left the final technology choice open. The selected frontend direction is now Vite, React, and TypeScript.

The broader requirements—precise deadlines, measurable progress, checkpoint history, and team workspaces—extend this original concept without changing its staged learning path.

## The Problem

Personal and team work is often distributed across chat messages, notes, spreadsheets, and meetings. This creates recurring problems:

- Deadlines lack precise times or clear ownership.
- A task marked “in progress” reveals very little.
- Progress updates disappear in chat history.
- Team members must ask one another for status updates.
- Completed work loses the context of how and when it was delivered.
- Personal tasks and shared responsibilities become mixed together.

ViDo addresses these problems by combining task planning, measurable progress, chronological updates, and team visibility in one focused application.

## The Vision

ViDo should become a calm, dependable workspace where users can answer five questions immediately:

1. What needs to be done?
2. Who is responsible for it?
3. When exactly is it due?
4. How much progress has been made?
5. What has happened since the task was created?

The long-term goal is not to add every possible project-management feature. It is to make task execution transparent and easy enough that individuals stay organized and teams need fewer manual synchronization meetings.

## Target Users

### Individuals

People who need more detail than a checklist provides and want to track deadlines, progress, and personal work history.

### Small teams

Teams that want lightweight coordination without the overhead of a complex enterprise project-management suite.

### Project owners and team leads

People who need a clear overview of ownership, overdue work, recent updates, and workload distribution.

## Core Experience

### My Tasks

A private workspace containing tasks owned by the authenticated user. Personal information is isolated from all other users by default.

Users can:

- Create and organize tasks.
- Set exact deadlines.
- Update completion percentages.
- Record timestamped checkpoints.
- Review pending, overdue, and completed work.
- Archive old tasks without losing their history.

### Team Tasks

A shared workspace for a defined group of members. Team ownership and membership determine who can see or modify its data.

Users can:

- Create or join team workspaces.
- Invite registered collaborators by email.
- Assign tasks to specific members.
- Follow progress and checkpoint discussions.
- See updates appear in real time.
- Understand which tasks are at risk or overdue.

## Task Lifecycle

A ViDo task moves through a transparent lifecycle:

1. **Created** — the task receives a title, optional details, owner, and precise deadline.
2. **In progress** — progress can move incrementally from 0% to 99%.
3. **Updated** — checkpoint entries document progress, decisions, blockers, and comments.
4. **Completed** — progress reaches 100% and the completion timestamp is recorded.
5. **Archived** — completed or inactive tasks can leave active views while retaining their history.

The primary views are derived from task data:

- **Pending:** incomplete and still within the deadline.
- **Overdue:** incomplete and past the deadline.
- **Completed:** finished tasks, including an indication when completion occurred after the deadline.

These categories should be calculated from the deadline and completion timestamp rather than manually maintained as unrelated status values.

## Progress and Checkpoints

Progress is represented as a percentage from 0% to 100%. A progress change may be accompanied by a checkpoint entry containing:

- The author
- A timestamp
- The new progress percentage
- A written update or comment

Checkpoint history is chronological and retained after completion so users can understand how the task evolved.

## Privacy and Trust

Privacy is a product feature, not merely an implementation detail.

- Personal tasks must be accessible only to their owner.
- Team data must be available only to authorized members.
- Authentication and authorization must be enforced at the backend/database layer.
- Client-side filtering must never be treated as a security boundary.
- Archived records should remain protected by the same rules as active records.

## Collaboration Model

Every team workspace has an owner and one or more members. The owner can manage membership and workspace settings. Tasks belong either to an individual user or a team workspace, never ambiguously to both.

Team tasks can be assigned to members while remaining visible to the authorized team. Task updates identify their authors so progress remains attributable and auditable.

## The Embedded AI Agent

The embedded AI agent is the defining capability and most important phase of ViDo. The earlier milestones create the trusted task, identity, collaboration, and history data that allow the agent to make genuinely useful recommendations.

Core capabilities include:

- Generating relevant tasks from goals, schedules, and current context.
- Suggesting follow-up actions from recent checkpoints and discussions.
- Detecting tasks at risk of missing their deadlines.
- Recommending priorities based on workload, dependencies, and due dates.
- Turning broad goals into smaller actionable tasks.
- Summarizing recent personal and team activity.
- Helping teams identify neglected work, blockers, and scheduling conflicts.

Agent embedding should feel native to the product rather than like a separate chatbot attached afterward. Recommendations must be grounded in accessible workspace data, explainable to the user, and approved before the agent changes tasks or assignments.

### Initial Phase 4 Dataset

The first recommendation experiments will use a two-year household-task dataset with:

- **1,786 task records**
- **20 recurring task types**
- Added dates spanning **27 October 2024 to 31 October 2026**
- Deadline dates spanning **27 October 2024 to 7 November 2026**
- **1,779 completed** and **7 incomplete** records
- **966 late completions** and **813 on-time or early completions**

Each record contains an instance ID, task type ID, task description, added date, deadline date, and completion date. This supports initial experiments in:

- Predicting the next likely recurring task.
- Recommending an appropriate future deadline.
- Estimating the risk of late completion.
- Learning task frequency and completion-delay patterns.
- Generating proactive reminders and follow-up suggestions.

The dataset is intentionally a starting point. It represents household tasks and does not yet include users, time-of-day deadlines, priorities, progress percentages, comments, teams, or workload context. The production agent should combine learned patterns with live, permission-scoped ViDo data rather than treating this dataset as universally representative.

## Product Principles

### Precise, not overwhelming

Capture useful scheduling and progress detail without turning task creation into a lengthy form.

### History matters

A completed task should retain the context, decisions, and progress that led to completion.

### Private by default

Users should never have to wonder whether a personal task is visible to a team.

### Shared truth over status meetings

The application should make routine progress visible so meetings can focus on decisions and blockers.

### Trustworthy foundations for intelligent action

Authentication, authorization, data integrity, and task history provide the dependable context the AI agent needs. These foundations and the agent are parts of one product vision: reliable data powering useful, safe recommendations.

## Success Criteria

ViDo succeeds when:

- A user can understand today’s priorities at a glance.
- A team can identify owners, deadlines, blockers, and progress without asking for manual updates.
- Personal and team data remain clearly separated and securely protected.
- Task history remains meaningful after completion.
- The interface feels fast, focused, and approachable.

## Delivery Roadmap

### Milestone 1 — Minimal Task Management Core

Begin with a focused, minimal to-do experience. Build task creation, editing, precise deadlines, percentage progress, checkpoint logs, status views, completion tracking, and archival/deletion without introducing authentication prematurely.

### Milestone 2 — Authentication and Multi-User Support

Add email/password authentication, persistent cloud data, user profiles, secure sessions, and strict user-level isolation so several users can safely use the same application.

### Milestone 3 — Shared Tasks and Team Collaboration

Add shared tasks across users, team workspaces, email invitations, membership management, assignment, comments, threaded replies, shared progress updates, and real-time synchronization.

### Milestone 4 — Embedded AI Agent and Recommendations

Deliver ViDo’s flagship capability: context-aware task generation, workload and deadline analysis, intelligent follow-up actions, activity summaries, and an agent embedded directly into personal and team workflows. This is the most important milestone and the culmination of the product vision.

## Learning and Content Vision

ViDo is also intended to become a practical teaching resource. The application should be built in visible, reproducible phases rather than presented only as a finished product.

For every phase:

- Preserve a working snapshot of the code before moving to the next phase.
- Retain the important prompts used to generate or modify the application.
- Record the build process and note timestamps where meaningful output appears.
- Demonstrate the finished features by interacting with the application.
- Produce a concise video focused on the useful steps rather than waiting time.
- Publish a polished, self-explanatory technical article that remains useful without the video.

Recordings should use a consistent, readable terminal setup and explain the work naturally while it is being performed. The final edited material may add narration, remove waiting time, and highlight significant decisions or obstacles.

This creates two connected outcomes: a usable collaborative task manager and a transparent case study showing how it was built with AI-assisted development.

## Initial Technical Direction

- **Frontend:** Vite, React, and TypeScript
- **Data and authentication:** Supabase is the proposed platform
- **Security:** PostgreSQL Row-Level Security policies
- **Collaboration:** database-backed subscriptions and real-time updates
- **Deployment:** a static frontend host with managed backend services

This direction favors rapid development while retaining a relational data model and strong server-side access control.
