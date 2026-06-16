# GAWS-7103 — Acts BACS-AUDDIS Testing Checklist

## Acceptance Criteria (from Jira ticket)
> Acts BACS-AUDDIS screen to be accessible in the new ngx app under Party module
> as it exists in the legacy app screen.

---

## ✅ Functional Tests

### Screen Access
- [ ] Route `/party/acts-bacs-auddis` loads without error
- [ ] `permissionGuard` blocks unauthorised users (redirects to home)
- [ ] `RouteKey.ACTS_BACS_AUDDIS` resolves correctly in permission guard

### Grid / Table
- [ ] All 9 columns render: Id, ACTS Job Type, Start Date, End Date, Status, Document Name, Info, Document, Overview
- [ ] Start Date column sorts **descending** by default (matches legacy)
- [ ] Dates render in format `dd.MM.yyyy hh:mm a` (e.g. `01.04.2025 08:44 PM`)
- [ ] Status shows `SUCCESSFUL` (green) or `UNSUCCESSFUL` (red) tag
- [ ] Rows display data matching legacy screen

### Header Icons — DISABLED (Read-Only)
- [ ] No Edit button visible/clickable
- [ ] No Add button visible/clickable
- [ ] No Save button visible/clickable
- [ ] No Close button visible/clickable

### API Integration
- [ ] `GET /api/acts-bacs-auddis/acts_bacs_auddis` called on init with `pageNumber=1&pageSize=50`
- [ ] Response data populates table rows
- [ ] `totalElements` shown in pagination footer
- [ ] Loading spinner shown during API call
- [ ] Error state shown on API failure

### Pagination / Load More
- [ ] `<app-pagination-total>` renders with correct total
- [ ] "Load More" button loads next page (`pageNumber=2`)
- [ ] Subsequent pages **concatenate** to existing rows (not replace)
- [ ] Load More button disabled during in-flight request

### Document Downloads
- [ ] Document column: shows file icon for non-overview documents
- [ ] Overview column: shows file icon for overview documents (`filePath` contains `acts-bacs-auddis-overview`)
- [ ] Clicking file icon opens correct URL: `service/onlyoffice/download?filename=...&entity=acts-bacs-auddis&entityid=...`
- [ ] Overview URL uses `entity=acts-bacs-auddis-overview`
- [ ] Links open in new tab (`target="_blank"`, `rel="noopener noreferrer"`)

### `showActsDunning` Input
- [ ] When `[showActsDunning]="true"`, API called with `acts_dunning` job type
- [ ] When `[showActsDunning]="false"` (default), API called with `acts_bacs_auddis`

### `headerTranslationKey` Input
- [ ] When provided, header shows provided translation key value
- [ ] When not provided, defaults to `onePay.actsBacsAuddisJobProtocol`

---

## 🌐 Translation Tests
- [ ] All column headers render translated text (not raw keys)
- [ ] Header title renders in English
- [ ] Header title renders in German (switch language in footer)
- [ ] Load More / Total Elements labels translated in both languages
- [ ] Download aria-labels translated

---

## ♿ Accessibility (WCAG)
- [ ] Table has `aria-label="ACTS Auddis Data Job Protocol"`
- [ ] Download links have descriptive `aria-label`
- [ ] Error/empty states use `aria-live="polite"`
- [ ] Spinner does not trap keyboard focus
- [ ] Tab order is logical through table and pagination
- [ ] Focus ring visible on download links (`:focus-visible`)

---

## 🔒 Security (Definition of Done)
- [ ] No `bypassSecurityTrust*` used
- [ ] No `innerHTML` used
- [ ] No sensitive data in `localStorage`
- [ ] Download URLs constructed via service method (no inline string concat in template)
- [ ] `rel="noopener noreferrer"` on all `target="_blank"` links

---

## 🧪 Code Quality
- [ ] No `console.log` present
- [ ] No `any` types
- [ ] No magic string values (all from model constants)
- [ ] `takeUntilDestroyed(destroyRef)` used on all subscriptions
- [ ] `ChangeDetectionStrategy.OnPush` set
- [ ] `trackById` and `trackByEntityId` used in `@for` loops
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] SonarQube scan: 0 new issues

---

## 📸 Testing Evidence Required (per ticket)
- [ ] Screenshot: screen accessible at `/party/acts-bacs-auddis`
- [ ] Screenshot: table populated with real data
- [ ] Screenshot: successful + unsuccessful status rows
- [ ] Screenshot: document download link working
- [ ] Screenshot: Load More appends rows
- [ ] Screenshot: language switch (EN → DE) reflects translated labels
- [ ] Screenshot: permission denied for unauthorised user
