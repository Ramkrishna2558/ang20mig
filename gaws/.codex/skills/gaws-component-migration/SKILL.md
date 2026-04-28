---
name: gaws-component-migration
description: Migrate one GAWS AngularJS page or component from gaws02/client into the Angular application at gaws02/client-ngx. Use when Codex is asked to analyze, plan, implement, or verify individual AngularJS-to-Angular component/page migrations in the GAWS repository.
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

## Reference

- Read `references/migration-checklist.md` before implementation if the task includes a real migration.
- Use `scripts/new-migration.ps1` to create a planned target folder when a fresh component shell is needed.
