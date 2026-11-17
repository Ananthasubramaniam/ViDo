# Spec Delta: landing-page

## Purpose

Provides a public landing page that introduces ViDo's core value proposition, displays preview mockups, and presents clear entry points before authentication.

## ADDED Requirements

### Requirement: Public value proposition presentation
The landing page SHALL display an honest product overview explaining ViDo's purpose as a universal, structured task manager without claiming unreleased features.

#### Scenario: User visits landing page
- **WHEN** an unauthenticated visitor navigates to the root path (`/`)
- **THEN** the system displays the hero headline, value proposition, and product introduction.

### Requirement: Google sign-in button placeholder
The landing page SHALL display a prominent "Continue with Google" action button that represents the primary authentication entry point.

#### Scenario: User inspects sign-in button
- **WHEN** the visitor views or clicks the "Continue with Google" button in Milestone 1
- **THEN** the system displays a clear notice that authentication is coming in Milestone 2 without redirecting to a broken OAuth endpoint.

### Requirement: Realistic dashboard preview mockup
The landing page SHALL showcase a static, non-functional dashboard preview depicting the ViDo workspace layout with realistic sample data.

#### Scenario: User inspects preview area
- **WHEN** the visitor scrolls to the preview section of the landing page
- **THEN** the system displays the sidebar navigation mockup and section-limited task lists labeled as sample preview content.

### Requirement: Use-case cards display
The landing page SHALL display distinct use-case overview cards for Personal, Home, and Work task management.

#### Scenario: User reviews audience use cases
- **WHEN** the visitor views the use-case section
- **THEN** the system renders three distinct cards highlighting personal errands, household responsibilities, and professional deadlines.

### Requirement: Navigation header and footer
The landing page SHALL provide a consistent top navigation header with brand identity and a bottom footer with project vision and roadmap links.

#### Scenario: User interacts with landing navigation
- **WHEN** the visitor navigates using header or footer links
- **THEN** the system scrolls to designated sections or provides navigation links to the workspace preview and style lab.

