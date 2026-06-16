# Component Migration Checklist

Use this checklist for each AngularJS page or component migration. **All items in the Angular Best Practices & Standards section of the migration skill must be checked before PR completion.**

## Analyze

- [ ] Migration unit is one page, route, component, directive, service, filter, or shared UI pattern.
- [ ] AngularJS route path, template URL, controller/component name, resolves, redirects, and guards are identified.
- [ ] Source template path is found, or the missing template is recorded as a blocker.
- [ ] Source controller/component path is found, or the missing script is recorded as a blocker.
- [ ] AngularJS injections are inventoried.
- [ ] Scope or controller-as fields are inventoried.
- [ ] Lifecycle/init methods, watchers, events, timers, and cleanup behavior are understood.
- [ ] Methods called from the template are inventoried.
- [ ] API endpoints, payloads, response shapes, headers, and error handling are mapped.
- [ ] Forms, disabled states, validation rules, and validation messages are mapped.
- [ ] Tables/lists, filters, sorting, pagination, exports, and row actions are mapped.
- [ ] Modals, dialogs, tooltips, toasts, loading states, confirmations, and empty states are mapped.
- [ ] Permission checks, auth/session behavior, and redirects are mapped.
- [ ] User-visible messages, labels, placeholders, alerts, and button text are captured.
- [ ] Navigation and route changes are mapped.
- [ ] Shared service calls are mapped.
- [ ] Nested components, directives, filters, styles, and assets are mapped.
- [ ] Legacy CSS classes, conditional class logic, and responsive behavior are inventoried.
- [ ] Legacy dependencies are compared with `client-ngx/package.json` before selecting Angular libraries.

## Implement

- [ ] Create or update the Angular target under `gaws/gaws02/client-ngx/src/app`.
- [ ] Create Angular standalone component when possible.
- [ ] Add strongly typed inputs, outputs, DTOs, view models, and service models.
- [ ] Move HTTP and reused service logic into Angular injectables.
- [ ] Preserve route behavior in `app.routes.ts`.
- [ ] Preserve visible behavior, user-facing text, API paths, validation, loading, empty, and error states.
- [ ] Reuse existing Angular conventions, shared components, shared styles, and installed UI libraries before adding new abstractions.
- [ ] Preserve CSS intent with Angular component styles and shared/global classes only when reuse justifies it.
- [ ] Add focused tests when logic has branching, validation, transformation, or service contracts.
- [ ] Create or update migration tracking under `gaws/gaws02/client-ngx/migration-log`.
- [ ] Record source-to-target mappings, validation results, dependency mapping notes, UI validation notes, and remaining gaps.

## Best Practices & Standards Checklist

- [ ] Component is single-purpose; logic moved to services where possible
- [ ] Async pipe used for template subscriptions
- [ ] Unsubscriptions handled with takeUntil or higher-order RxJS
- [ ] Streams cached with shareReplay if needed
- [ ] distinctUntilChanged used to filter redundant emissions
- [ ] All HTTP calls routed through services
- [ ] Interceptors used for auth and error handling
- [ ] ChangeDetectionStrategy.OnPush enabled
- [ ] Feature modules are lazy-loaded
- [ ] *ngFor uses trackBy
- [ ] No heavy logic in templates
- [ ] Routing structured with feature modules and guards
- [ ] Reactive Forms preferred; custom validators centralized
- [ ] API security: tokens, HttpOnly cookies, storage cleared on logout
- [ ] No magic values; constants/enums used
- [ ] Naming conventions followed
- [ ] Pre-commit hooks/checks in place
- [ ] Vulnerabilities checked and reported before fixing
- [ ] Accessibility (WCAG) ensured
- [ ] Dependencies audited, unused removed
- [ ] Centralized logging, no console.log
- [ ] Code formatted (Prettier), clean imports, clear README
- [ ] PR is small, reviewed, checklist completed
- [ ] No direct DOM manipulation
- [ ] Standalone components used where possible
- [ ] Strict typing enforced
- [ ] Feature branch naming convention followed
- [ ] PR description includes story number and title

## Verify

- [ ] Build or type-check the Angular app from `gaws/gaws02/client-ngx`.
- [ ] Run existing tests when tests are touched or migrated behavior is complex.
- [ ] Exercise the migrated route manually when a dev server and browser are available.
- [ ] Check browser console/runtime errors when UI validation is possible.
- [ ] Compare against the legacy template, controller, route, CSS, assets, and API behavior before finalizing.
- [ ] Record skipped validation with the exact blocker and manual command to run.
- [ ] Completion report includes what changed, what went wrong, what was missing, runtime requirements, conflicts/risks, validation performed, and action required.
