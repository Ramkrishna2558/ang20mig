# GitHub Copilot Agent Task: Migrate employee-management

You are migrating one GAWS AngularJS page into the Angular 20 client.

## Command That Created This Task

``powershell
npm run migrate page employee-management
``

## Migration Unit

- Type: page
- Name: employee-management
- Angular class: EmployeeManagementComponent
- Legacy route detected: True
- Angular target folder: gaws\gaws02\client-ngx\src\app\pages\employee-management

## Blocking Warnings To Resolve Before Claiming Completion

- WARNING: No legacy HTML template was found for 'employee-management'. Check route templateUrl and source tree before claiming migration parity.

## Source Files

- gaws\gaws02\client\components\employee-management.js

## Required Context Files

- MIGRATION_AGENT.md
- MIGRATION_INSTRUCTIONS.md
- FRAMEWORK_OVERVIEW.md
- gaws\.agents\angularjs-analyzer.md
- gaws\.agents\migration-planner.md
- gaws\.agents\angular-implementer.md
- gaws\.agents\migration-reviewer.md
- gaws\.codex\skills\gaws-component-migration\SKILL.md
- gaws\.codex\skills\gaws-component-migration\references\migration-checklist.md
- gaws\gaws02\client\init.js
- gaws\gaws02\client\index.html
- gaws\gaws02\client-ngx\src\app\app.routes.ts
- gaws\gaws02\client-ngx\src\app\app.config.ts
- gaws\gaws02\client-ngx\package.json
- gaws\gaws02\client-ngx\angular.json
- gaws\gaws02\backend\server.js
- gaws\gaws02\client\components\employee-management.js

## Instructions

1. Read the required context files before editing.
2. Read every discovered AngularJS source file and any services, filters, directives, styles, or assets referenced by it.
3. If the AngularJS route references a missing template or script, stop and record the mismatch instead of inventing UI.
4. Migrate the unit into gaws/gaws02/client-ngx/src/app/pages/employee-management.
5. Prefer standalone Angular components, ChangeDetectionStrategy.OnPush, typed services, typed DTOs, and Reactive Forms for non-trivial forms.
6. Preserve visible behavior, user-facing text, route behavior, API endpoints, validation, alerts, loading states, filtering, sorting, pagination, modals, and CSS class behavior.
7. Reuse existing Angular conventions and shared components/styles before creating new abstractions.
8. Wire the route in gaws/gaws02/client-ngx/src/app/app.routes.ts when this is page-level.
9. Add focused tests when migrated logic has branching, validation, transformation, or service contracts.
10. Run 
pm --prefix gaws/gaws02/client-ngx run build after implementing, and report any skipped validation or remaining gaps.

## Expected Output

- Angular component/page files created or updated under client-ngx/src/app.
- Directly required services, models, routes, tests, and styles updated.
- A short migration log entry under client-ngx/migration-log.
- Build validation result, or a clear reason validation was skipped.
