# Component Migration Checklist

Use this checklist for each AngularJS page or component migration.

## Analyze

- Source template path
- Source controller/component path
- AngularJS injections
- Scope or controller-as fields
- Methods called from template
- Validation rules
- User-visible messages
- Navigation and route changes
- Shared service calls
- Nested components and assets

## Implement

- Create Angular standalone component.
- Add strongly typed inputs, outputs, and service models.
- Move service logic into an Angular injectable when it is reused.
- Preserve route behavior in `app.routes.ts`.
- Preserve CSS intent with Angular component styles.

## Verify

- Build or type-check the Angular app.
- Exercise the migrated route manually when a dev server is available.
- Compare against the legacy template and controller before finalizing.
