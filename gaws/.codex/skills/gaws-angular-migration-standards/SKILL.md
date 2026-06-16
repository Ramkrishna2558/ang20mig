---
name: gaws-angular-migration-standards
description: Enforce the GAWS-specific standards for migrating an AngularJS page/component from gaws02/client to the Angular 20 app at gaws02/client-ngx. Combines the project's Angular Best Practices with the repository architecture, folder conventions, dependency discipline, and PR/branch rules. Use whenever planning, implementing, or reviewing an AngularJS-to-Angular migration in this repo.
---

# GAWS Angular Migration Standards

These are the **non-negotiable standards** that every AngularJS → Angular migration in this repo must satisfy. They combine the team's Angular Best Practices with the existing architecture in `gaws/gaws02/client-ngx`.

Apply this skill alongside `gaws-component-migration` (workflow) and `gaws-git-workflow` (branch/commit).

---

## 1. Project Architecture (must be followed)

- **Source (legacy):** `gaws/gaws02/client` — AngularJS 1.x, `ngRoute`. Route wiring is centralized in `client/init.js`.
- **Target (Angular 20):** `gaws/gaws02/client-ngx/src/app`
  - Route wiring: `app.routes.ts`
  - App providers: `app.config.ts`
  - Route-level screens: `pages/<feature>/`
  - Cross-feature services: `core/services/`
  - Reusable UI/layout: `shared/`
  - Feature-local models, child components, pipes, and directives live next to the page.
- **Backend:** `gaws/gaws02/backend/server.js` exposes mock APIs under `/api/*`. Do not change API paths during migration unless source analysis proves it is required.
- **Build/Test (always run from `gaws/gaws02/client-ngx`):**
  - `npm run build` — required type/build verification before declaring a migration done.
  - `npm test` — required when behavior is non-trivial or specs are added/modified.

## 2. File & Naming Conventions

- Kebab-case filenames: `change-password.component.ts`, `employee.service.ts`, `employee.model.ts`.
- PascalCase classes: `ChangePasswordComponent`, `EmployeeService`.
- 2-space indentation; single quotes in TS/JS.
- One focused migration unit per PR. Keep writes scoped to the unit plus directly required routes/services/models/tests/shared UI/styles.

## 3. Angular Best Practices (MANDATORY checklist)

Every migrated component/page PR must satisfy each of these:

### Components & Templates
- [ ] **Standalone components** only (no `NgModule` for new code).
- [ ] **Single-purpose components**; move business logic into services.
- [ ] **`ChangeDetectionStrategy.OnPush`** unless source behavior makes it unsafe.
- [ ] Keep templates simple — **no heavy logic in HTML**.
- [ ] Use `trackBy` on every `*ngFor` (or a stable `track` expression in `@for`).
- [ ] No direct DOM manipulation — use Angular bindings/directives.
- [ ] Use Angular control-flow (`@if`, `@for`, `@switch`) for new templates when consistent with nearby code.

### State, RxJS & HTTP
- [ ] Use the **`async` pipe** instead of manual `.subscribe()` in components.
- [ ] When a subscription is unavoidable, unsubscribe via **`takeUntil`** (or `takeUntilDestroyed`) or higher-order RxJS operators.
- [ ] Cache shared streams with **`shareReplay`** to avoid duplicate API calls.
- [ ] Filter redundant emissions with **`distinctUntilChanged`**.
- [ ] All HTTP goes through a **dedicated service** in `core/services/` using typed `HttpClient`. No HTTP calls embedded in components.
- [ ] Use **HTTP interceptors** for auth and global error handling.
- [ ] Use **signals/computed** for local synchronous component state where it fits existing code; RxJS for streams.

### Forms & Validation
- [ ] Prefer **Reactive Forms** over template-driven forms.
- [ ] Centralize validation with **reusable custom validators**; preserve all legacy required/disabled/readonly/min/max rules and the exact validation messages.

### Routing & Performance
- [ ] Wire migrated page routes in `src/app/app.routes.ts`. Preserve the legacy path unless the migration plan changes it.
- [ ] **Lazy-load** larger features via `loadComponent`/`loadChildren` when justified.
- [ ] Add route **guards** when the legacy page required auth/permission checks.

### Typing & Code Quality
- [ ] **Strict typing**: TypeScript interfaces/types for every DTO, view model, and form model.
- [ ] No `any` for API payloads or form values.
- [ ] **No magic values** — use constants/enums (e.g., status, tab names, API paths).
- [ ] Centralized logging service — **no `console.log`** in committed code.
- [ ] Clean imports; remove unused packages and code.

### Security
- [ ] Auth via tokens / `HttpOnly` cookies through an interceptor.
- [ ] **Clear storage on logout.**
- [ ] Run a dependency vulnerability check; report findings on the PR before fixing.

### Accessibility
- [ ] Meet WCAG basics: labels, `button` types, table headers, focus states, dialog semantics, keyboard reachability.

## 4. Dependency Discipline

- Reuse what is already in `gaws/gaws02/client-ngx/package.json` before adding any dependency.
- Available UI stacks in `client-ngx`: **`ng-zorro-antd`** (+ `@ant-design/icons-angular`), **Bootstrap**, **Angular Material**, **ngx-toastr**, **angular-i18next**.
  - Prefer **ng-zorro** for enterprise tables/tabs/forms/modals/alerts/pagination/date inputs/selects/buttons when it fits the existing Angular code.
  - Do not mix Material into a page that uses ng-zorro/Bootstrap conventions.
- If a new dependency seems required, **ask the user first** and record the decision in the migration log.

## 5. CSS / SCSS Standards

- Migrate legacy class names rather than reinventing styles. Inventory `ng-class`, conditional classes, and `client/assets/styles` before writing CSS.
- Page-specific styles go in the component stylesheet (prefer `.scss` for new components).
- Promote a class to global `src/styles.css` (or shared SCSS) only when it is reused by multiple pages.
- No inline styles except for truly dynamic values; avoid `::ng-deep` unless unavoidable.
- Use CSS custom properties for reusable colors/spacing/status colors.

## 6. Legacy → Angular Mapping (quick reference)

| AngularJS | Angular |
|---|---|
| `ng-model` | Reactive Forms control (or signal-backed state for trivial UI) |
| `ng-submit` / `ng-click` | `(ngSubmit)` / `(click)` |
| `ng-if` / `ng-show`/`ng-hide` | `@if` (or `[hidden]` when DOM persistence matters) |
| `ng-repeat` | `@for ... track ...` |
| `ng-class` | `[class.x]` / `[ngClass]` |
| AngularJS filters | TS helpers / Angular pipes / computed |
| `$http` | typed `HttpClient` service in `core/services/` |
| `$timeout` | RxJS `timer` / explicit async (with cleanup) |
| `$watch` | signals + `computed`/`effect` or RxJS with `takeUntilDestroyed` |
| `$routeParams` | `ActivatedRoute` |
| `$location` redirects | `Router` |
| AngularJS service/factory | `@Injectable({ providedIn: 'root' })` |

## 7. Branch, Commit & PR Rules

- **Branch:** `migration/<ticket-or-area>/<feature-name>-to-angular`
  (e.g. `migration/GAWS-123/employee-management-to-angular`).
- **Commit:**
  ```
  migration(<area>): migrate <feature-name> to Angular

  Source: gaws02/client/<source files>
  Target: gaws02/client-ngx/src/app/<target files>
  Validation: <commands run or reason not run>
  ```
- **PR description must include the story number and title.**
- Keep PRs small, reviewed, and accompanied by the checklist in section 3.

## 8. Definition of Done

A migration is **only** done when all of the following hold:

1. Legacy template, controller, styles, and APIs were read before writing code.
2. All checklist items in section 3 are met (or an exception is recorded with justification).
3. `npm run build` in `gaws/gaws02/client-ngx` passes — or the user has explicitly declined and the decline is logged.
4. Migrated route renders in the browser (when the app can be served) with no console/runtime errors and preserves the major UI states.
5. Migration log entry created under `gaws/gaws02/client-ngx/migration-log/` with source→target mapping, validation results, dependency decisions, and any remaining gaps.
6. Branch/commit/PR follow section 7.

---

## Related skills

- **`gaws-component-migration`** — step-by-step migration workflow.
- **`gaws-git-workflow`** — branch, commit, and push helpers.

## References

- **Checklist:** `references/migration-standards-checklist.md` — copy into every PR.
- **PR template:** `.github/PULL_REQUEST_TEMPLATE/migration.md` — auto-loadable via `?template=migration.md`.

## Source

These standards consolidate the team's **Angular Best Practices & Standards** document with the architecture defined in `.github/agents/gaws-angular-migration.agent.md`, `AGENTS.md`, and `.github/copilot-instructions.md`.
