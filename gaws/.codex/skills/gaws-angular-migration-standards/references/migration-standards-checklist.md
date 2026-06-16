# Migration Standards Checklist

Use this checklist for every AngularJS → Angular migration PR in `gaws/gaws02/client-ngx`.
Copy it into the PR description (or use the PR template under `.github/PULL_REQUEST_TEMPLATE/migration.md`).

**Story:** `<STORY-ID — Title>`
**Migration unit:** `<legacy file(s) → target file(s)>`
**Branch:** `migration/<ticket-or-area>/<feature-name>-to-angular`

---

## 1. Source Analysis (read before writing code)
- [ ] Read legacy template(s) under `gaws/gaws02/client/...`
- [ ] Read legacy controller/service/filter/directive
- [ ] Read route registration in `client/init.js`
- [ ] Read referenced shared services & assets
- [ ] Read backend endpoints in `gaws/gaws02/backend/server.js`
- [ ] Inventoried legacy CSS classes (incl. `ng-class` / dynamic classes)

## 2. Components & Templates
- [ ] Standalone component (no `NgModule`)
- [ ] Single-purpose; business logic moved to services
- [ ] `ChangeDetectionStrategy.OnPush` (or justified exception)
- [ ] No heavy logic in HTML
- [ ] `trackBy` on every `*ngFor` / `track` on `@for`
- [ ] No direct DOM manipulation
- [ ] Angular control-flow (`@if`/`@for`/`@switch`) used where consistent

## 3. State, RxJS & HTTP
- [ ] `async` pipe used instead of manual `.subscribe()` in components
- [ ] Manual subscriptions cleaned up via `takeUntilDestroyed` / `takeUntil`
- [ ] `shareReplay` on shared streams
- [ ] `distinctUntilChanged` on redundant emissions
- [ ] All HTTP in `core/services/` using typed `HttpClient`
- [ ] HTTP interceptors used for auth and global error handling
- [ ] Signals/`computed` used for local synchronous state where it fits

## 4. Forms & Validation
- [ ] Reactive Forms (not template-driven)
- [ ] Reusable custom validators where applicable
- [ ] Legacy required/disabled/readonly/min/max rules preserved
- [ ] Validation messages match legacy text exactly

## 5. Routing & Performance
- [ ] Route wired in `src/app/app.routes.ts`
- [ ] Legacy path preserved (or change justified)
- [ ] Lazy-loaded via `loadComponent`/`loadChildren` when justified
- [ ] Route guards added where the legacy page required auth/permission

## 6. Typing & Code Quality
- [ ] Interfaces/types for every DTO, view model, and form model
- [ ] No `any` in API payloads or form values
- [ ] Constants/enums used instead of magic values
- [ ] No `console.log` — uses centralized logging service
- [ ] Imports clean; unused code/packages removed

## 7. Security
- [ ] Auth tokens / `HttpOnly` cookies handled via interceptor
- [ ] Storage cleared on logout
- [ ] `npm audit` (or equivalent) run; findings reported in PR

## 8. Accessibility
- [ ] Labels for inputs, `button` type set, table headers correct
- [ ] Visible focus states, keyboard reachable controls
- [ ] Dialog/modal semantics correct

## 9. CSS / SCSS
- [ ] Legacy class names migrated, not reinvented
- [ ] Page-specific styles in component stylesheet (`.scss` preferred)
- [ ] Shared/global only when reused across pages
- [ ] No inline styles (except truly dynamic); no `::ng-deep` unless unavoidable

## 10. Dependencies
- [ ] Reused existing `client-ngx` deps (ng-zorro / Bootstrap / Material / ngx-toastr / angular-i18next) before adding any new package
- [ ] If a new dep was added, user approval recorded in migration log

## 11. UI Parity
- [ ] User-visible text matches legacy exactly
- [ ] Tabs / modals / alerts / loaders / empty & error states preserved
- [ ] Table columns, filters, sort, pagination, row actions preserved
- [ ] API paths and payloads unchanged

## 12. Validation
- [ ] `cd gaws/gaws02/client-ngx && npm run build` — **passes**
- [ ] `npm test` run when behavior is non-trivial (or N/A)
- [ ] Migrated route opened in a browser; no console/runtime errors

## 13. Migration Log
- [ ] Entry added under `gaws/gaws02/client-ngx/migration-log/<YYYY-MM-DD>-<feature>.md`
  - Source → target mapping
  - Dependency decisions (kept / added / rejected)
  - Validation results & remaining gaps
  - UI states exercised in the browser

## 14. Branch / Commit / PR
- [ ] Branch name: `migration/<ticket-or-area>/<feature-name>-to-angular`
- [ ] Commit subject: `migration(<area>): migrate <feature-name> to Angular`
- [ ] Commit body lists Source / Target / Validation
- [ ] PR description includes **story number and title**
- [ ] PR is small and scoped to the migration unit
