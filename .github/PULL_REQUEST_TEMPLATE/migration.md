# Migration PR — `<STORY-ID> — <Story Title>`

> Use this template for any AngularJS → Angular migration in `gaws/gaws02/client-ngx`.
> Full reference: `gaws/.codex/skills/gaws-angular-migration-standards/SKILL.md`

## Summary

- **Migration unit:** `<legacy file(s) → target file(s)>`
- **Legacy route:** `<#/path>`
- **Angular route:** `<path>`
- **Branch:** `migration/<ticket-or-area>/<feature-name>-to-angular`

## Source → Target Mapping

| Legacy (`gaws/gaws02/client`) | Angular (`gaws/gaws02/client-ngx/src/app`) |
|---|---|
| `...` | `...` |

## Standards Checklist

### Source analysis
- [ ] Read legacy template, controller, route wiring (`client/init.js`), shared services, backend endpoints, and legacy CSS classes

### Components & Templates
- [ ] Standalone component, single-purpose
- [ ] `ChangeDetectionStrategy.OnPush` (or justified exception)
- [ ] No heavy logic in HTML; `trackBy`/`track` on every loop
- [ ] No direct DOM manipulation; uses Angular bindings/directives

### State, RxJS & HTTP
- [ ] `async` pipe instead of manual `.subscribe()`
- [ ] Subscriptions cleaned up via `takeUntilDestroyed` / `takeUntil`
- [ ] `shareReplay` on shared streams; `distinctUntilChanged` where useful
- [ ] HTTP only in `core/services/` via typed `HttpClient`; interceptors for auth & errors

### Forms & Validation
- [ ] Reactive Forms; reusable validators
- [ ] Legacy validation rules and messages preserved exactly

### Routing & Performance
- [ ] Route wired in `src/app/app.routes.ts`; legacy path preserved
- [ ] Lazy-loaded if warranted; route guards added if legacy required auth

### Typing & Code Quality
- [ ] Interfaces/types for DTOs, view models, forms — no `any`
- [ ] Constants/enums instead of magic values
- [ ] No `console.log`; uses centralized logging service
- [ ] Clean imports; no unused packages/code

### Security
- [ ] Tokens / `HttpOnly` cookies via interceptor; storage cleared on logout
- [ ] `npm audit` (or equivalent) findings reported below

### Accessibility (WCAG basics)
- [ ] Labels, button types, focus/keyboard, dialog semantics

### CSS / SCSS
- [ ] Legacy classes migrated (not reinvented); component-scoped SCSS for page-only styles
- [ ] Shared/global styles only when reused; no inline styles or `::ng-deep` unless justified

### Dependencies
- [ ] Reused existing `client-ngx` deps (ng-zorro / Bootstrap / Material / ngx-toastr / angular-i18next)
- [ ] Any new dependency was pre-approved and recorded in the migration log

### UI Parity
- [ ] User-visible text, tabs, modals, alerts, loaders, empty/error states preserved
- [ ] Tables: columns, filters, sort, pagination, row actions preserved
- [ ] API paths & payloads unchanged

## Validation

```
cd gaws/gaws02/client-ngx
npm run build      # required — paste result below
npm test           # when behavior is non-trivial
```

- `npm run build`: ✅ / ❌ — `<paste summary or blocker>`
- `npm test`: ✅ / ❌ / N/A — `<paste summary>`
- Browser check on `<route>`: ✅ / ❌ — `<states exercised, any console errors>`

## Migration log

- Path: `gaws/gaws02/client-ngx/migration-log/<YYYY-MM-DD>-<feature>.md`

## Security audit

- `npm audit` summary: `<paste>`
- Findings & action: `<fix in this PR / follow-up issue #...>`

## Notes / Risks / Follow-ups

- `<gaps, exceptions to the checklist with justification, follow-up tickets>`
