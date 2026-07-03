# Homepage Redesign Instructions

Refactor the current homepage to match the new business requirements.

The application is no longer a system where users create their own audits. Auditors only work on reports assigned to them by their managers.

For now, use mock data and keep the data layer isolated so that it can later be replaced with real API calls without changing the UI components.

---

## New Homepage Structure

The homepage should be simple, professional, and task-oriented.

Structure:

```text
Header
─────────────────
Good Morning, {UserName}
You have X assigned audits

Quick Stats
─────────────────
Assigned: X
In Progress: X
Completed: X

Continue Working
─────────────────
Show recently opened or in-progress audits.

Each card should contain:
- Report Name
- Venue Name
- Status Badge
- Completion Percentage
- Last Updated Time

Example:

Venue Audit
ABC School
65% Complete
Last updated 2 hours ago

Recently Completed
─────────────────
Show the last 3–5 completed audits.

Each card should contain:
- Report Name
- Venue Name
- Completion Date

Actions
─────────────────
Primary button:

"View All Assigned Audits"

This button will navigate to the full assigned audits page.

---

## Design Requirements

The design should remain:

- Minimalistic
- Professional
- Enterprise-focused
- Mobile-first
- Consistent with the application's existing design language

Avoid:

- Large illustrations
- Excessive animations
- Floating action buttons for creating audits
- Any UI related to creating or managing custom audits

The user is only responsible for completing assigned work.

---

## Mock Data Requirements

Create a dedicated mock data file:

