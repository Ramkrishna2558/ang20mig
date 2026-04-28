# GAWS Message Standards

## Branches

- `migration/<ticket>/<component>-to-angular`
- Use `no-ticket` when there is no ticket yet.
- Keep component names lowercase and hyphenated.

## Commits

Format:

```text
migration(<area>): migrate <component> to Angular
```

Recommended areas:

- `auth`
- `home`
- `shared`
- `onlyoffice`
- `routing`

## Pull Request Summary

Use three short sections:

```text
Summary
- Migrated <component> from AngularJS to Angular.
- Wired route/service/style updates needed by the migration.

Validation
- <command>: <result>

Source Mapping
- AngularJS: <source paths>
- Angular: <target paths>
```
