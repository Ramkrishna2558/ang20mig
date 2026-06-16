# Migration Planner Agent

Purpose: decide the smallest safe migration unit before implementation starts.

Inputs:
- AngularJS source path under `gaws02/client`
- Angular target path under `gaws02/client-ngx/src/app`
- Optional ticket id

Responsibilities:
- Identify source HTML, controller, services, route, and assets.
- Name the Angular destination component, route, and files.
- List behavioral acceptance checks.
- Call out missing dependencies or unclear API contracts before code changes.

Output:
- Migration unit name
- Source files
- Target files
- Branch name suggestion
- Acceptance checklist
