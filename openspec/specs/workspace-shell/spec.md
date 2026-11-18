# workspace-shell Specification

## Purpose

Provides a persistent desktop workspace shell featuring sidebar navigation, derived task views, section-limited backlog displays, and modal concepts.

## Requirements

### Requirement: Desktop sidebar navigation
The workspace shell SHALL provide a persistent left navigation sidebar containing links to Home, Today, Upcoming, Needs Attention, Completed, and Archived views.

#### Scenario: Navigating between workspace views
- **WHEN** the user selects any navigation item in the sidebar
- **THEN** the shell updates the active route and renders the corresponding view content with active navigation styling.

### Requirement: Top bar controls and user placeholder
The workspace shell SHALL render a top utility bar containing a search input placeholder, a filter placeholder, and a sample user profile badge.

#### Scenario: Interacting with top bar controls
- **WHEN** the user focuses or enters text into the search or filter placeholders
- **THEN** the system maintains visible focus indicators and signals preview-only status without mutating task data.

### Requirement: Home dashboard section limits
The Home dashboard view SHALL constrain visible tasks per section to prevent cognitive overload while providing view-all links and item counts.

#### Scenario: Rendering Home sections with larger fixture counts
- **WHEN** the user views the Home dashboard
- **THEN** the system displays at most 5 tasks in Today, at most 3 tasks in Needs Attention, at most 3 tasks in Upcoming, and at most 3 tasks in Recently Completed, each displaying its total count and a "View all" link.

### Requirement: Recently completed section visibility
The Recently Completed section on the Home dashboard SHALL include only tasks completed within the last 7 relative days of the benchmark date, and SHALL be hidden when empty.

#### Scenario: Empty recently completed tasks
- **WHEN** there are no tasks completed within the last 7 days of the benchmark date
- **THEN** the system omits the Recently Completed section from the Home dashboard.

### Requirement: Task creation concept modal
The workspace shell SHALL provide a centered modal dialog demonstrating the task-creation flow with fields for title, description, due date, due time, and priority.

#### Scenario: Opening and closing task creation modal
- **WHEN** the user clicks the "New Task" button or triggers the shortcut
- **THEN** the system opens an accessible centered modal with visible focus trapped inside, and dismisses it when Escape or Cancel is triggered.

### Requirement: Task detail concept modal
The workspace shell SHALL provide a centered modal dialog displaying comprehensive task information including title, description, deadline, priority, and timestamps.

#### Scenario: Inspecting task details
- **WHEN** the user clicks on a sample task card
- **THEN** the system opens an accessible centered modal displaying the task's full attributes and a non-functional status checkpoint timeline.

