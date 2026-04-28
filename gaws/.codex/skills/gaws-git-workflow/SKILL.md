---
name: gaws-git-workflow
description: Standardize GAWS migration branch, commit, and push operations. Use when Codex is asked to create a migration branch, format commit messages, summarize migration changes, or push AngularJS-to-Angular migration code for review.
---

# GAWS Git Workflow

## Branch Naming

Use:

```text
migration/<ticket-or-area>/<legacy-name>-to-angular
```

Examples:

```text
migration/gaws-123/login-to-angular
migration/no-ticket/change-password-to-angular
```

## Commit Messages

Use:

```text
migration(<area>): migrate <legacy-name> to Angular
```

Body:

```text
Source: gaws02/client/<source files>
Target: gaws02/client-ngx/src/app/<target files>
Validation: <commands run or reason not run>
```

## Push

Before pushing:

1. Check `git status --short`.
2. Confirm only intended files are staged.
3. Run the relevant validation command.
4. Push the current branch with upstream tracking.

Use `scripts/start-migration-branch.ps1` and `scripts/push-migration-branch.ps1` when commands need to be repeatable.
