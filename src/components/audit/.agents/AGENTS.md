# AGENTS.md

# Project Development Guidelines

These instructions apply to all AI-assisted code changes in this repository.

---

# Primary Goal

Improve the codebase while preserving existing functionality.

When making changes:

* Prefer maintainability over cleverness.
* Prefer readability over excessive abstraction.
* Prefer consistency over personal preference.
* Make incremental improvements rather than large rewrites.

---

# Refactoring Philosophy

## Incremental Refactoring

Always prefer small, reviewable changes.

DO:

* Refactor one concern at a time.
* Preserve existing functionality.
* Preserve existing business logic.
* Preserve existing API contracts.
* Preserve existing routing behavior.
* Preserve existing UI behavior unless explicitly requested.

DO NOT:

* Rewrite large sections of the application unnecessarily.
* Introduce architectural changes without justification.
* Change behavior during a structural refactor.
* Modify backend contracts without explicit approval.

---

# Architecture Guidelines

## Feature-Based Organization

Prefer organizing code by feature/domain rather than by file type.

Example:

src/
├── features/
│   ├── auth/
│   ├── attendance/
│   ├── tasks/
│   └── products/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── types/
│
├── routes/
└── App.tsx

Keep feature-specific code within its feature whenever practical.

---

# Component Guidelines

## Single Responsibility

Components should have one primary responsibility.

Avoid components that:

* Fetch large amounts of data
* Contain extensive business logic
* Manage unrelated state
* Render multiple unrelated features

---

## Keep Components Small

Prefer smaller focused components over large monolithic files.

When a component becomes difficult to understand, split it into logical subcomponents.

---

## Prefer Composition

Prefer composing smaller components rather than creating large deeply nested components.

---

# Function Guidelines

## One Responsibility Per Function

Functions should perform one logical task.

Good examples:

* fetchUser()
* updateProfile()
* calculateTotal()
* validateInput()

Avoid functions that perform multiple unrelated actions.

---

## Use Descriptive Names

Function names should clearly describe intent.

Prefer:

* createTask()
* deleteExpense()
* formatDate()

Avoid:

* process()
* handleData()
* helper()

---

## Keep Functions Focused

Break complex logic into smaller reusable functions.

Reduce nesting where possible.

Use guard clauses instead of deeply nested conditionals.

Example:

if (!user) return;

if (!isAuthorized) return;

performAction();

---

# State Management Guidelines

## Keep State Close to Usage

Store state as near as possible to where it is used.

Avoid lifting state higher than necessary.

---

## Avoid Redundant State

Do not store values that can be derived from existing state.

Prefer computed values where practical.

---

## Separate UI State and Application State

Examples of UI State:

* Modal visibility
* Selected tab
* Dropdown state

Examples of Application State:

* Authenticated user
* API data
* Global settings

Keep these concerns separate.

---

# Hooks Guidelines

## Extract Reusable Logic

If logic is repeated across components, consider moving it into a custom hook.

Hooks should encapsulate behavior and state management.

---

## Keep Hooks Focused

Each hook should solve a single problem.

Avoid hooks that manage unrelated concerns.

---

# API Guidelines

## Separate API Logic From UI

Avoid embedding API requests directly inside UI components.

Prefer dedicated services or API modules.

Example:

services/
├── authApi.ts
├── taskApi.ts
└── productApi.ts

---

## Consistent Data Fetching

Maintain a consistent approach for:

* Loading states
* Error handling
* Caching
* Refetching

Avoid mixing patterns unnecessarily.

---

# Business Logic Guidelines

## Keep Business Logic Out of JSX

Move calculations, permissions, validations, and business rules into dedicated functions, hooks, or services.

JSX should remain focused on rendering UI.

---

## Avoid Duplication

Shared business rules should exist in a single location whenever possible.

---

# Performance Guidelines

## Optimize Only When Necessary

Readability is the default priority.

Optimize only when:

* Profiling identifies bottlenecks.
* Excessive rerenders occur.
* Expensive computations exist.

---

## Avoid Premature Optimization

Do not introduce:

* useMemo
* useCallback
* React.memo

without a clear reason or measurable benefit.

---

## Stable List Keys

Use stable unique identifiers for rendered lists whenever possible.

Avoid array indexes as keys unless no alternative exists.

---

# Utility Guidelines

Group utilities by responsibility.

Prefer:

utils/
├── date.ts
├── validation.ts
├── formatting.ts

Avoid:

utils/helpers.ts

containing unrelated functionality.

---

# Error Handling

Handle errors explicitly.

Avoid silent failures.

Provide meaningful error handling where appropriate.

---

# Code Quality Standards

Prioritize:

1. Readability
2. Maintainability
3. Predictability
4. Simplicity
5. Consistency

A developer unfamiliar with the codebase should be able to understand the purpose of a file quickly.

---

# AI Review Checklist

Before making any code changes:

1. Identify the files that will be modified.
2. Explain the intended changes.
3. Verify that functionality will remain unchanged.
4. Verify that API contracts will remain unchanged.
5. Verify that routing behavior will remain unchanged.
6. Verify that business rules will remain unchanged.
7. Prefer the smallest possible change set.
8. Reuse existing patterns where appropriate.
9. Avoid introducing unnecessary abstractions.
10. Consider whether the change improves readability.

After making changes:

1. Summarize all modified files.
2. Summarize all structural changes.
3. Highlight any potential risks.
4. Confirm whether behavior changed.
5. Explain why the refactor improves maintainability.

---

# Final Rule

When multiple valid solutions exist:

Choose the solution that is easiest for a future developer to understand and maintain.
