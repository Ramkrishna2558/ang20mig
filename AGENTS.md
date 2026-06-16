# Repository Guidelines

## Project Structure & Module Organization

Root Markdown files such as `MIGRATION_AGENT.md`, `MIGRATION_INSTRUCTIONS.md`, and `QUICK_START.md` document the Angular migration workflow. `finance-tracker/` is a standalone Angular app with source in `src/app`, assets in `public/`, and feature folders such as `components/`, `pages/`, `services/`, `models/`, and `animations/`. `gaws/gaws02/` contains the GAWS mock app: `backend/` is the Express server, `client/` is the legacy AngularJS client, `client-ngx/` is the Angular migration target, and `scripts/` contains migration automation.

## Build, Test, and Development Commands

Run commands from the relevant project directory.

- `cd finance-tracker && npm start`: serve the finance Angular app locally.
- `cd finance-tracker && npm run build`: create a production Angular build.
- `cd finance-tracker && npm test`: run the Angular test target.
- `cd gaws/gaws02 && npm start`: start the GAWS Express backend and legacy static client.
- `cd gaws/gaws02 && npm run ngx:start`: serve the GAWS Angular migration app from `client-ngx`.
- `cd gaws/gaws02 && npm run ngx:build`: build the GAWS Angular migration app.
- `cd gaws/gaws02 && npm run migrate`: run the PowerShell migration workflow.

## Coding Style & Naming Conventions

Use TypeScript and Angular standalone component patterns in new Angular code. Keep Angular files kebab-cased (`change-password.component.ts`) and classes PascalCased (`ChangePasswordComponent`). Use 2-space indentation in TypeScript, HTML, CSS, and JSON. Prefer single quotes in TypeScript/JavaScript. Keep shared Angular utilities in `core/` or `shared/`; route-level screens belong in `pages/`. GAWS backend code uses CommonJS modules and Express route handlers.

## Testing Guidelines

Angular test commands are exposed through `npm test` or `npm run ngx:test`. Add specs as `*.spec.ts` beside the component, service, or utility under test. Focus on routing, service behavior, and component state changes. There is no enforced coverage threshold in the checked-in configs, so document manual verification in pull requests when automated coverage is missing.

## Commit & Pull Request Guidelines

Git history currently only shows `first commit`, so use clear imperative commit subjects, for example `Add employee migration tests` or `Fix finance dashboard totals`. Pull requests should describe the changed app area, list commands run, link the related issue or migration task, and include screenshots for UI changes. Note skipped tests or required environment variables.

## Security & Configuration Tips

Do not commit secrets, local credentials, or generated dependency folders. Treat `node_modules/`, `dist/`, `.angular/`, and migration logs as generated output unless a task explicitly requires them. Keep backend configuration environment-driven with variables such as `PORT`.
