/**
 * GAWS-7103: Acts BACS-AUDDIS Migration
 * FILE: src/app/features/party/party.routes.ts
 *
 * ADD the entry below to the existing partyRoutes array.
 * Do NOT replace the entire file — only add the new route entry.
 *
 * Pattern matches existing entries:
 *   { path: 'person/detail', loadComponent: ..., canActivate: [permissionGuard], data: { routeKey: RouteKey.PARTY_PERSON } }
 */

import { Routes } from '@angular/router';
import { RouteKey } from '@constant/permission.enum';
import { permissionGuard } from '@core/guards/permission.guard';

// ── ADD THIS ENTRY to the existing partyRoutes array ──────────────────────────

const newRoute = {
  path: 'acts-bacs-auddis',
  loadComponent: () =>
    import('./acts-bacs-auddis/acts-bacs-auddis.component').then(
      (m) => m.ActsBacsAuddisComponent
    ),
  canActivate: [permissionGuard],
  data: { routeKey: RouteKey.ACTS_BACS_AUDDIS },
};

/**
 * Result: party.routes.ts should look like this after patch:
 *
 * export const partyRoutes: Routes = [
 *   {
 *     path: 'person/detail',
 *     loadComponent: () => import('./person/person-detail').then((m) => m.PersonDetailComponent),
 *     canActivate: [permissionGuard],
 *     data: { routeKey: RouteKey.PARTY_PERSON }
 *   },
 *   {
 *     path: 'organisation/detail',
 *     loadComponent: () => import('./organisation/organisation-detail').then((m) => m.OrganisationDetailComponent),
 *     canActivate: [permissionGuard],
 *     data: { routeKey: RouteKey.PARTY_ORGANISATION }
 *   },
 *   // ── GAWS-7103: ADD BELOW ──
 *   {
 *     path: 'acts-bacs-auddis',
 *     loadComponent: () => import('./acts-bacs-auddis/acts-bacs-auddis.component').then((m) => m.ActsBacsAuddisComponent),
 *     canActivate: [permissionGuard],
 *     data: { routeKey: RouteKey.ACTS_BACS_AUDDIS }
 *   },
 * ];
 */

export { newRoute };
