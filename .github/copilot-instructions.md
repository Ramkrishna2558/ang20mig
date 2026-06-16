# Copilot Instructions for `ang20mig`

## Build, test, and lint commands

Run from `gaws\gaws02` unless noted.

| Purpose | Command |
|---|---|
| Start backend + legacy AngularJS app | `npm start` |
| Start Angular migration app (`client-ngx`) | `npm run ngx:start` |
| Build Angular migration app | `npm run ngx:build` |
| Run Angular test suite | `npm run ngx:test` |
| Run a single Angular spec | `npm run ngx:test -- --include=src/app/pages/<page>/<page>.component.spec.ts --watch=false --browsers=ChromeHeadless` |
| Run migration automation script | `npm run migrate` |
| Lint legacy/backend JS | `npx eslint "client/**/*.js" "backend/**/*.js"` |

> **Note:** No `npm lint` script is defined; use the `npx eslint` command above directly.

If you work directly inside `gaws\gaws02\client-ngx`, the commands `npm start`, `npm run build`, and `npm test` are equivalent to `ngx:start`, `ngx:build`, and `ngx:test` above.

## High-level architecture

- `gaws\gaws02\backend\server.js` is the runtime entrypoint (`npm start`). It serves static files from `gaws\gaws02\client`, exposes mock APIs under `/api/*`, and falls back to `client\index.html` for SPA routes.
- Legacy UI lives in `gaws\gaws02\client` and is AngularJS 1.x (`ngRoute`). Route wiring is centralized in `client\init.js`; route templates/controllers are loaded from separate JS/HTML files plus `components\employee-management.js`.
- Migration target UI lives in `gaws\gaws02\client-ngx` (Angular 20 standalone app). Route wiring is in `src\app\app.routes.ts`, app providers in `app.config.ts`, reusable layout in `src\app\shared\layout`, and cross-feature services in `src\app\core\services`.
- The current Angular target mirrors core legacy screens (`login`, `home`, `change-password`) and is designed to incrementally absorb additional AngularJS routes/components.

## Key conventions for this repository

- Treat each migration as **one focused unit** (one page/route/component) and keep edits scoped to that unit plus required routing/services/models/tests.
- Preserve legacy behavior first: user-facing text, route paths, validation behavior, alerts/messages, table/filter/sort/pagination behavior, and API paths should match AngularJS unless the task explicitly changes them.
- Before implementing a migrated feature, read both source and target wiring:
  - Source: `gaws\gaws02\client\init.js`, legacy template/controller files, and related styles/assets.
  - Target: `gaws\gaws02\client-ngx\src\app\app.routes.ts` plus nearby `pages\`, `core\services\`, and `shared\` patterns.
- Angular code conventions in this repo:
  - Prefer standalone components.
  - Keep route-level screens in `pages\`, shared/reusable UI in `shared\`, and app-wide services in `core\services\`.
  - Use kebab-case filenames and PascalCase class names.
  - Use 2-space indentation and single quotes.
- Dependency discipline for migrations:
  - Reuse dependencies already present in `client-ngx\package.json` before adding new ones.
  - `ng-zorro-antd` and Bootstrap are available; avoid introducing new UI libraries unless the task explicitly requires it and the user confirms the addition.
