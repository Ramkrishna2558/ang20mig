---
name: gaws-component-migration
description: Migrate one GAWS AngularJS page or component from gaws02/client into the Angular application at gaws02/client-ngx. Use when Codex/Co-pilot/Claude is asked to analyze, plan, implement, or verify individual AngularJS-to-Angular component/page migrations in the GAWS repository.
---

# GAWS Component Migration

## Workflow

1. Identify the migration unit: one page, route, or component.
2. Read the matching AngularJS `.html` and `.js` files under `gaws02/client`.
3. Read any referenced shared services, nested components, assets, and route setup.
4. Create or update the Angular target under `gaws02/client-ngx/src/app`.
5. Preserve visible behavior first, then improve typing and Angular structure.
6. Wire the route in `src/app/app.routes.ts` when the migrated unit is page-level.
7. Run the lightest available validation command and report any untested gaps.

## Conventions

- Prefer standalone Angular components.
- Keep a migration to one focused page or component unless dependencies force a small support file.
- Mirror user-visible messages exactly unless the request says to modernize copy.
- Put shared cross-page logic in `src/app/core/services` or `src/app/shared`.
- Keep temporary compatibility comments short and ticket-based.


## Angular Best Practices & Standards (MANDATORY for Every Migration PR)

- Keep components single-purpose; move logic to services.
- Always use the async pipe instead of manual subscriptions.
- Unsubscribe safely using takeUntil or higher-order RxJS operators.
- Cache streams with shareReplay to avoid duplicate API calls.
- Filter redundant emissions using distinctUntilChanged.
- Route all HTTP calls through dedicated services.
- Use interceptors for auth, and global error handling.
- Enable ChangeDetectionStrategy.OnPush for better performance.
- Lazy-load feature modules to reduce initial bundle size.
- Use trackBy in *ngFor to prevent unnecessary DOM re-renders.
- Keep templates simple; avoid heavy logic in HTML.
- Structure routing with feature modules and guards.
- Prefer Reactive Forms over Template-driven forms.
- Centralize validation with reusable custom validators.
- Secure APIs with tokens, HttpOnly cookies and clear storage on logout.
- Avoid magic values; use constants and enums.
- Follow consistent naming conventions across the project.
- Automate checks with pre-commit hooks.
- Check for vulnerabilities and report before fixing them on each PR/Story.
- Ensure accessibility with WCAG guidelines.
- Regularly audit dependencies and remove unused packages.
- Use a centralized logging service; avoid console.log.
- Improve code formatting with Prettier, clear READMEs, and clean imports.
- Keep PRs small, reviewed, and backed by a checklist.
- Avoid direct DOM manipulation; use Angular bindings and directives.
- Use standalone components instead of NgModules where possible.
- Introduce strict typing early to avoid runtime surprises.
- When creating a feature branch, follow the proper naming convention.
- While raising a PR, include the story number and title in the PR description.

> **All above points must be considered and checked before every PR completion for AngularJS to Angular migration.**

## Reference

- Read `references/migration-checklist.md` before implementation if the task includes a real migration.
- Use `scripts/new-migration.ps1` to create a planned target folder when a fresh component shell is needed.
