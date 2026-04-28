# Employee Management Component - Migration Instructions

**Last Updated:** 2026-04-27  
**Status:** ✅ AngularJS Component Ready | Awaiting Migration to Angular

---

## Quick Reference

| Property | Value |
|----------|-------|
| **Component Name** | Employee Management Portal |
| **Complexity** | HIGH |
| **Modules** | 5 (Employee Directory, Forms, Departments, Payroll, Reviews) |
| **Estimated Effort** | 3-4 days |
| **Files to Migrate** | 2 (HTML template + JS controller) |
| **New Files to Create** | 12+ (Components, Services, Models) |
| **API Endpoints** | 12 endpoints (GET/POST/PUT/DELETE) |

---

## Pre-Migration Checklist

✅ **AngularJS Component Status**
- [x] Component created and functional
- [x] All 5 tabs working
- [x] Mock data operational
- [x] Backend server running
- [x] Route configured: `/#/employee-management`
- [x] Documentation complete

✅ **Angular Project Setup**
- [ ] Verify `client-ngx` folder exists
- [ ] Check `src/app/pages` directory
- [ ] Confirm `app.routes.ts` is accessible
- [ ] Verify `src/app/core/services` folder exists
- [ ] Confirm models folder structure ready

---

## Migration Workflow

### **Phase 1: Analysis** (Using AngularJS Analyzer Agent)

**Questions to Answer:**
1. What is the core business logic in the controller?
2. Which operations require API calls vs. local state management?
3. Are there any directives or filters used?
4. What validation rules are implemented?
5. Are there any service dependencies?

**Output:** Analysis document describing the legacy component structure

---

### **Phase 2: Planning** (Using Migration Planner Agent)

**Tasks:**
1. Identify migration unit boundaries
2. List all services to extract
3. Identify models and interfaces needed
4. Check for dependencies on shared services
5. Plan component hierarchy (main + sub-components)
6. Create migration checklist

**Output:** Migration plan with:
- Source → Target file mappings
- Service extraction list
- Component architecture
- Acceptance criteria

---

### **Phase 3: Implementation** (Using Angular Implementer Agent)

#### **3.1 Create Models (TypeScript Interfaces)**

**Files to Create:**
```
src/app/models/
├── employee.model.ts
├── department.model.ts
├── payroll.model.ts
└── review.model.ts
```

**Example - employee.model.ts:**
```typescript
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  department: string;
  position: string;
  startDate: string;
  salary: number;
  bonus: number;
  currency: string;
  payFrequency: string;
  status: 'active' | 'inactive' | 'on-leave';
  remote: boolean;
  manager?: string;
}
```

#### **3.2 Create Services**

**Files to Create:**
```
src/app/core/services/
├── employee.service.ts
├── department.service.ts
├── payroll.service.ts
└── review.service.ts
```

**Example - employee.service.ts:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = '/api/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

#### **3.3 Create Components**

**Main Component:**
```
src/app/pages/employee-management/
├── employee-management.component.ts
├── employee-management.component.html
├── employee-management.component.scss
└── employee-management.component.spec.ts
```

**Sub-components (Optional but recommended):**
```
├── employee-directory/
├── employee-form/
├── department-list/
├── payroll-table/
└── review-cards/
```

#### **3.4 Convert Template (HTML)**

**Key Conversions:**
```html
<!-- AngularJS -->
<input ng-model="employeeSearch" ng-keyup="filterEmployees()">
<div ng-if="activeTab === 'Employee Directory'">
<button ng-click="editEmployee(emp)">

<!-- Angular -->
<input [(ngModel)]="employeeSearch" (keyup)="filterEmployees()">
<div *ngIf="activeTab === 'Employee Directory'">
<button (click)="editEmployee(emp)">
```

#### **3.5 Convert Controller to Component**

**AngularJS Controller Pattern:**
```javascript
angular.module('gawsLegacy').controller('EmployeeManagementCtrl', [
  '$scope', '$http', '$timeout',
  function($scope, $http, $timeout) {
    $scope.employees = [];
    $scope.loadEmployees = function() { ... }
  }
]);
```

**Angular Component Pattern:**
```typescript
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, ... ]
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe(
      employees => this.employees = employees,
      error => console.error('Error loading employees', error)
    );
  }
}
```

#### **3.6 Implement Forms (Reactive Forms)**

**Convert from ng-model to FormControl:**

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class EmployeeManagementComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      bonus: ['', [Validators.min(0), Validators.max(100)]],
      status: ['active', Validators.required]
    });
  }

  submitEmployeeForm() {
    if (!this.employeeForm.valid) {
      this.addAlert('Please fill all required fields', 'error');
      return;
    }

    const employee = this.employeeForm.value;
    const operation = this.editingEmployee 
      ? this.employeeService.update(this.editingEmployee.id, employee)
      : this.employeeService.create(employee);

    operation.subscribe(
      result => {
        this.addAlert('Employee saved successfully', 'success');
        this.loadEmployees();
        this.resetForm();
      },
      error => {
        this.addAlert('Failed to save employee', 'error');
      }
    );
  }
}
```

---

### **Phase 4: Integration & Testing**

#### **4.1 Update Routes**

**Add to src/app/app.routes.ts:**
```typescript
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';

export const routes: Routes = [
  // ... existing routes
  {
    path: 'employee-management',
    component: EmployeeManagementComponent
  }
];
```

#### **4.2 Test Checklist**

**Employee Directory Tab:**
- [ ] Load employees displays correct count
- [ ] Search filters employees correctly
- [ ] Department filter works
- [ ] Status filter works
- [ ] Sorting changes order
- [ ] Pagination navigation works
- [ ] Edit button opens form
- [ ] Delete button shows confirmation

**Add/Edit Employee Tab:**
- [ ] Form displays all fields
- [ ] Required field validation works
- [ ] Email validation works
- [ ] Submit creates new employee
- [ ] Submit updates existing employee
- [ ] Cancel returns to directory
- [ ] Success alert displays

**Other Tabs:**
- [ ] Department CRUD works
- [ ] Payroll calculations correct
- [ ] Performance review CRUD works
- [ ] All filters functional

#### **4.3 API Integration**

Verify all API calls hit correct endpoints:
```
GET    /api/employees          ✓
POST   /api/employees          ✓
PUT    /api/employees/:id      ✓
DELETE /api/employees/:id      ✓
GET    /api/departments        ✓
POST   /api/departments        ✓
DELETE /api/departments/:id    ✓
GET    /api/payroll            ✓
GET    /api/reviews            ✓
POST   /api/reviews            ✓
PUT    /api/reviews/:id        ✓
DELETE /api/reviews/:id        ✓
```

---

### **Phase 5: Review & Finalization** (Using Migration Reviewer Agent)

**Review Against AngularJS Source:**
- [ ] All visible behavior preserved
- [ ] No regressions in functionality
- [ ] Forms validate identically
- [ ] API calls work the same way
- [ ] Alerts/messages match original
- [ ] Sorting/filtering produces same results
- [ ] Payroll calculations are accurate

**Documentation:**
- [ ] Create MIGRATION_SUMMARY.md
- [ ] Document breaking changes (if any)
- [ ] Note any improvements made
- [ ] List known limitations (if any)

---

## Common Pitfalls to Avoid

⚠️ **Form Validation**
- AngularJS: `ng-show="form.field.$error.required"`
- Angular: `*ngIf="form.get('field')?.hasError('required')"`

⚠️ **HTTP Interceptors**
- Ensure `HttpClientModule` is properly imported
- Add error handling for failed requests

⚠️ **Change Detection**
- Use `ChangeDetectionStrategy.OnPush` for performance
- Unsubscribe from observables to prevent memory leaks

⚠️ **Template Syntax**
- `ngModel` vs Reactive Forms (be consistent)
- `*ngIf` vs `[hidden]` (use `*ngIf` for DOM removal)

---

## File Mapping Reference

| AngularJS | Angular | Type |
|-----------|---------|------|
| employee-management.html | employee-management.component.html | Template |
| employee-management.js | employee-management.component.ts | Component |
| (inline controller) | employee.service.ts | Service |
| (inline controller) | department.service.ts | Service |
| (inline controller) | payroll.service.ts | Service |
| (inline controller) | review.service.ts | Service |
| (mock data) | employee.model.ts | Interface |
| (mock data) | department.model.ts | Interface |
| (mock data) | payroll.model.ts | Interface |
| (mock data) | review.model.ts | Interface |

---

## Success Criteria

✅ **Component Functions:**
- All 5 tabs render and are navigable
- All CRUD operations work (Create, Read, Update, Delete)
- Search/filter/sort work identically to AngularJS
- Forms validate correctly
- API calls succeed with mock backend

✅ **Code Quality:**
- TypeScript strict mode passes
- No console errors or warnings
- Services properly injected
- Models provide type safety
- Template uses proper Angular syntax

✅ **Testing:**
- Manual testing passes all use cases
- No regressions vs. AngularJS version
- Responsive design maintained
- Cross-browser compatibility verified

---

## Support Resources

- **COMPONENT_SPEC.md** - Detailed field-by-field breakdown
- **MIGRATION_LOG.md** - Migration history and notes
- **.agents/** - Agent definitions (Planner, Analyzer, Implementer, Reviewer)
- **.codex/skills/gaws-component-migration/** - Migration skill reference

---

## Next Steps

1. ✅ Have AngularJS Analyzer read this document and component source
2. ✅ Have Migration Planner create migration plan
3. ✅ Have Angular Implementer execute migration
4. ✅ Have Migration Reviewer verify against source
5. ✅ Deploy migrated component to production

---

**Questions?** Refer to MIGRATION_LOG.md or contact the migration team.

**Ready to begin?** Execute: `npm run migrate:emp-mgmt`
