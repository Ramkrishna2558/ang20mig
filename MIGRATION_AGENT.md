# GAWS Migration Agent - Complete Instruction Set

**Version:** 1.0  
**Created:** 2026-04-27  
**Purpose:** Master instruction guide for migrating AngularJS components to Angular  
**Target Component:** Employee Management Portal  
**Status:** Ready for Production

---

## EXECUTIVE SUMMARY

This document contains the complete, consolidated instruction set for migrating the **Employee Management Portal** component from AngularJS (`gaws02/client/components/employee-management/`) to Angular (`gaws02/client-ngx/src/app/pages/employee-management/`).

**Key Metrics:**
- Component Complexity: HIGH
- Estimated Duration: 3-4 days
- Files to Migrate: 2 (HTML + JS)
- New Files to Create: 12+ (Components, Services, Models)
- API Endpoints: 12 (GET/POST/PUT/DELETE)
- Controller Functions: 30+
- Test Coverage Areas: 13 (5 tabs + CRUD + validation + pagination)

---

## TABLE OF CONTENTS

1. [Core Principles & Requirements](#core-principles--requirements)
2. [Migration Agent Roles](#migration-agent-roles)
3. [Migration Skills & Workflows](#migration-skills--workflows)
4. [Pre-Migration Analysis](#pre-migration-analysis)
5. [Component Deep Dive](#component-deep-dive)
6. [5-Phase Migration Process](#5-phase-migration-process)
7. [Detailed Implementation Guide](#detailed-implementation-guide)
8. [Testing & Verification](#testing--verification)
9. [Git Workflow & Commits](#git-workflow--commits)
10. [Logging & Documentation](#logging--documentation)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## CORE PRINCIPLES & REQUIREMENTS

### **Principle 1: No Guesswork Policy**

**CRITICAL:** Before implementing any code, clarify uncertainties.

**When to Ask:**
- [ ] Routes structure and wiring in `app.routes.ts`
- [ ] File location conventions in `client-ngx/src/app`
- [ ] Component dependencies and imports
- [ ] Service injection patterns
- [ ] Shared service location and usage
- [ ] API endpoint base URLs
- [ ] Module imports and providers
- [ ] TypeScript strict mode requirements
- [ ] Angular version and feature flags
- [ ] CSS/SCSS file locations

**How to Ask:**
Use the `ask_user` tool to get user confirmation before proceeding.

**Approval Process:**
Only proceed independently when:
1. User explicitly says "yes" to proceed
2. Analysis of related/suspected files provides clear, definitive solution
3. Solution is presented to user BEFORE implementation

---

### **Principle 2: Logging & Migration Tracking**

**Every Migration Run Must:**

1. **Create Log File**
   - Location: `client-ngx/migration-log/emp-mgmt-migration-YYYYMMDD-HHMMSS.log`
   - Include: timestamp, migration steps, status, errors, warnings
   - Format: Markdown with timestamps

2. **Read instructions.md**
   - Before starting: Read `gaws02/client/components/employee-management/instructions.md`
   - Before each component update: Re-read relevant sections
   - Document any new learnings

3. **Track Migrated Items**
   - File: `client-ngx/migration-log/migrated-components.json`
   - Format:
     ```json
     {
       "component": "employee-management",
       "migrationId": "emp-mgmt-001",
       "startDate": "2026-04-27T16:00:00Z",
       "status": "in_progress",
       "files": [
         {
           "type": "component",
           "name": "employee-management.component.ts",
           "oldPath": "gaws02/client/components/employee-management.js",
           "newPath": "client-ngx/src/app/pages/employee-management/employee-management.component.ts",
           "status": "pending",
           "description": "Main component controller with all business logic"
         }
       ]
     }
     ```

4. **Update Migration Tracking**
   - SQL table: `migrations` - Record migration start/end
   - SQL table: `migrated_items` - List all files/functions moved
   - SQL table: `migration_questions` - Record questions asked & answered

---

### **Principle 3: CSS Standards**

**MUST READ:** Any CSS images provided by user

**CSS Rules:**
1. Use ONLY CSS defined in provided images
2. Prioritize existing component SCSS from `client-ngx/src/app`
3. Reference existing component styles before creating new ones
4. Never add vanilla/custom CSS without explicit approval
5. Document all CSS sources in comments

**CSS Process:**
```typescript
// ✅ GOOD: Reference existing component styles
import { CommonModule } from '@angular/common';
import { NgxFormsModule } from '@shared/forms';
// Using existing Form component styles from client-ngx

// ❌ BAD: Creating new custom CSS without reference
.employee-table { /* Where did this CSS come from? */ }
```

---

### **Principle 4: Branch Naming & Git Workflow**

**Branch Naming Standard:**
```
Format: migration/<ticket-id>/<component-name>-to-angular

Examples:
  migration/emp-mgmt-001/employee-management-to-angular
  migration/gaws-123/employee-management-to-angular
  migration/no-ticket/employee-management-to-angular
```

**Commit Message Format:**
```
migration(hr): migrate employee-management to Angular

Source: gaws02/client/components/employee-management/
        gaws02/client/components/employee-management.js
Target: client-ngx/src/app/pages/employee-management/
        client-ngx/src/app/core/services/

Modules Migrated:
  - Employee CRUD operations
  - Department management
  - Payroll processing
  - Performance reviews

Validation:
  - TypeScript strict mode: PASS
  - Build: ng build --prod
  - Tests: ng test --watch=false
  - Component route: /#/employee-management

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

**Push Checklist:**
- [ ] `git status --short` - Only intended files staged
- [ ] Validation command run
- [ ] Branch created: `migration/<ticket>/<component>-to-angular`
- [ ] Commit message follows format
- [ ] Ready to push with upstream tracking

---

### **Principle 5: Migration Item Tracking**

**Files to Create/Update:**

**1. migrated-components.json**
```json
{
  "migration_id": "emp-mgmt-001",
  "component_name": "employee-management",
  "status": "in_progress",
  "items": [
    {
      "id": "item-001",
      "type": "component",
      "name": "EmployeeManagementComponent",
      "old_path": "gaws02/client/components/employee-management.html",
      "new_path": "client-ngx/src/app/pages/employee-management/employee-management.component.html",
      "description": "Main component template with 5 tabs...",
      "status": "pending"
    }
  ]
}
```

**2. migrated-services.json**
```json
{
  "services": [
    {
      "name": "EmployeeService",
      "old_location": "EmployeeManagementCtrl (inline)",
      "new_location": "client-ngx/src/app/core/services/employee.service.ts",
      "functions": ["getAll", "getById", "create", "update", "delete"],
      "status": "pending"
    }
  ]
}
```

**3. migrated-functions.json**
```json
{
  "functions": [
    {
      "name": "loadEmployees",
      "type": "service-method",
      "source": "EmployeeManagementCtrl.loadEmployees()",
      "target": "EmployeeService.getAll()",
      "description": "Fetch all employees from API",
      "status": "pending"
    }
  ]
}
```

**4. migration-history.md**
```markdown
# Employee Management Migration History

## Migration ID: emp-mgmt-001

### 2026-04-27 16:00 - Initialization
- Created branch: migration/emp-mgmt-001/employee-management-to-angular
- Started Phase 1: Analysis
- Read source files and documentation

### 2026-04-27 17:00 - Analysis Complete
- Identified 5 main modules
- 30+ functions catalogued
- 12 API endpoints documented
- 4 forms with validation rules identified

### 2026-04-27 18:00 - Planning Complete
- Created 4 sub-components
- 4 services to extract
- 4 model interfaces to create
- Migration plan approved

[Continue with updates as migration progresses]
```

---

## MIGRATION AGENT ROLES

### **Role 1: AngularJS Analyzer Agent**

**Primary Responsibility:** Understand and document the legacy AngularJS component structure.

**Input:**
- AngularJS source files
- Component location
- Related dependencies

**Process:**

1. **Read Source Files**
   ```
   └─ gaws02/client/components/employee-management/employee-management.html
   └─ gaws02/client/components/employee-management.js
   └─ gaws02/client/init.js (routing)
   ```

2. **Analyze Structure**
   - Template breakdown (HTML structure, bindings, directives)
   - Controller scope fields and methods
   - Injected services and dependencies
   - Route configuration
   - Form validation rules
   - User-visible messages
   - API call patterns

3. **Document Findings**
   ```markdown
   # AngularJS Component Analysis - Employee Management

   ## Template Structure
   - 5 tabs with ng-repeat navigation
   - Multiple forms with ng-model binding
   - Tables with sorting and pagination
   - Confirmation modal for delete operations

   ## Controller Scope Variables
   - $scope.employees: Employee array
   - $scope.filteredEmployees: Filtered employee array
   - $scope.tabs: Tab names array
   - $scope.activeTab: Current active tab
   - [... list all scope variables ...]

   ## Methods
   - loadEmployees()
   - filterEmployees()
   - editEmployee(emp)
   - submitEmployeeForm()
   - [... list all methods ...]

   ## Injected Services
   - $scope
   - $http
   - $timeout

   ## API Endpoints Used
   - GET /api/employees
   - POST /api/employees
   - [... list all endpoints ...]

   ## Validation Rules
   - First Name: Required
   - Email: Required, valid email format
   - [... all validation rules ...]
   ```

**Output:**
- Comprehensive implementation notes
- Checklist of functionality
- Dependencies and concerns
- Migration roadmap

---

### **Role 2: Migration Planner Agent**

**Primary Responsibility:** Create a detailed, executable migration plan.

**Input:**
- Analysis from Analyzer Agent
- Target Angular structure
- Ticket ID (optional)

**Process:**

1. **Identify Migration Unit**
   - Main component: EmployeeManagementComponent
   - Sub-components: 4 (Directory, Form, Departments, Payroll, Reviews)
   - Services: 4 (Employee, Department, Payroll, Review)
   - Models: 4 (Employee, Department, Payroll, Review)

2. **Create File Mapping**
   ```
   SOURCE                                    →  TARGET
   employee-management.html                  →  employee-management.component.html
   employee-management.js (controller)       →  employee-management.component.ts
   [inline employee CRUD]                    →  employee.service.ts
   [inline department CRUD]                  →  department.service.ts
   [inline payroll ops]                      →  payroll.service.ts
   [inline review ops]                       →  review.service.ts
   [mock Employee data]                      →  models/employee.model.ts
   [mock Department data]                    →  models/department.model.ts
   [mock Payroll data]                       →  models/payroll.model.ts
   [mock Review data]                        →  models/review.model.ts
   ```

3. **Create Execution Plan**
   ```markdown
   # Migration Plan: Employee Management

   ## Phase 1: Setup (30 min)
   - [ ] Create directory structure
   - [ ] Create model interfaces
   - [ ] Set up service files

   ## Phase 2: Services (1 hour)
   - [ ] Implement EmployeeService
   - [ ] Implement DepartmentService
   - [ ] Implement PayrollService
   - [ ] Implement ReviewService

   ## Phase 3: Main Component (1.5 hours)
   - [ ] Create component class
   - [ ] Convert template to Angular syntax
   - [ ] Implement tab logic
   - [ ] Wire services

   ## Phase 4: Forms (1 hour)
   - [ ] Implement Reactive Forms
   - [ ] Add validation
   - [ ] Implement form submission

   ## Phase 5: Testing (1 hour)
   - [ ] Component loads
   - [ ] All tabs functional
   - [ ] CRUD operations work
   - [ ] Validation works
   - [ ] API calls successful

   ## Acceptance Criteria
   - [ ] No console errors
   - [ ] All tests pass
   - [ ] No regressions vs AngularJS
   - [ ] TypeScript strict mode passes
   ```

4. **Identify Risks & Dependencies**
   - Dependency on HttpClient module
   - Dependency on ReactiveFormsModule
   - Dependency on CommonModule
   - Need for dialog component (delete confirmation)
   - Need for alert/toast service

5. **Branch Name Suggestion**
   ```
   migration/emp-mgmt-001/employee-management-to-angular
   ```

**Output:**
- Executable migration plan
- File mapping document
- Risk assessment
- Acceptance checklist
- Recommended branch name

---

### **Role 3: Angular Implementer Agent**

**Primary Responsibility:** Build the Angular version of the component.

**Rules:**
1. Keep write scope to target component and directly required service files
2. Preserve user-visible behavior from AngularJS
3. Use standalone Angular components
4. Use typed services and reactive state
5. Add TODO comments only for confirmed follow-up work with ticket IDs

**Process:**

1. **Create Models** (TypeScript Interfaces)
2. **Create Services** (HTTP + Business Logic)
3. **Create Main Component** (with forms and logic)
4. **Create Sub-Components** (if needed)
5. **Update Routing** (in app.routes.ts)
6. **Run Validation** (build, type-check, tests)
7. **Report Results** (files changed, gaps remaining)

**Output:**
- Migrated Angular component
- Test results
- Files changed report
- Known gaps list

---

### **Role 4: Migration Reviewer Agent**

**Primary Responsibility:** Verify migrated component against legacy source.

**Review Priorities:**
1. Behavior regressions vs. AngularJS source
2. Missing route wiring, form validation, redirects
3. Untyped or brittle data contracts
4. Missing tests for non-trivial branching

**Process:**

1. **Behavioral Testing**
   - Load all employees ✓/✗
   - Search functionality ✓/✗
   - Filter by department ✓/✗
   - Sort by column ✓/✗
   - Pagination works ✓/✗
   - Add employee form ✓/✗
   - Edit employee ✓/✗
   - Delete with confirmation ✓/✗
   - Department CRUD ✓/✗
   - Payroll calculations ✓/✗
   - Performance review CRUD ✓/✗

2. **Code Quality**
   - TypeScript strict mode ✓/✗
   - All types defined ✓/✗
   - Services properly injected ✓/✗
   - No console errors ✓/✗
   - Form validation identical ✓/✗
   - API calls correct ✓/✗

3. **Documentation**
   - All functions documented ✓/✗
   - Models documented ✓/✗
   - Services documented ✓/✗
   - Migration decisions recorded ✓/✗

**Output:**
```markdown
# Migration Review Report

## Behavioral Fidelity: PASS / FAIL
- [List any regressions]

## Code Quality: PASS / FAIL
- [List any issues]

## Type Safety: PASS / FAIL
- [List any untyped areas]

## Recommended Actions:
- [List any follow-ups needed]

## Residual Risk: [HIGH / MEDIUM / LOW]
```

---

## MIGRATION SKILLS & WORKFLOWS

### **Skill 1: gaws-component-migration**

**When to Use:** When migrating an AngularJS component to Angular

**Workflow:**

**Step 1: Identify Migration Unit**
- One page or component
- Identify all dependencies
- List shared services needed
- Map all routes

**Step 2: Read Legacy Files**
- HTML template: `employee-management.html`
- JS controller: `employee-management.js`
- Configuration: `init.js` (routes)
- Services used: `shared/services/auth.service.js`

**Step 3: Plan Structure**
- Angular component location: `src/app/pages/employee-management/`
- Service locations: `src/app/core/services/`
- Model locations: `src/app/models/`
- Route location: `src/app/app.routes.ts`

**Step 4: Implement**
- Create directory structure
- Create models (interfaces)
- Create services (HTTP)
- Create main component
- Create sub-components
- Convert forms to Reactive Forms
- Wire routes

**Step 5: Validate**
```bash
# Type checking
ng build --prod

# Run tests
ng test --watch=false

# Check routes
ng serve  # Navigate to /#/employee-management
```

**Step 6: Report**
- Files created: [list]
- Files modified: [list]
- Build status: PASS/FAIL
- Test status: PASS/FAIL
- Remaining gaps: [list]

**Conventions:**
- Prefer standalone Angular components
- Keep one focused migration per run
- Mirror user-visible messages exactly
- Put shared logic in `core/services`
- Keep TODO comments short and ticket-based

**Reference:**
- See COMPONENT_SPEC.md for detailed specifications
- See MIGRATION_LOG.md for migration details
- See MIGRATION_INSTRUCTIONS.md for step-by-step

---

### **Skill 2: gaws-git-workflow**

**When to Use:** When creating branches, formatting commits, or pushing migration code

**Branch Creation:**
```bash
# Script: start-migration-branch.ps1
.\scripts\start-migration-branch.ps1 -Ticket "emp-mgmt-001" -Component "employee-management"

# Result: Creates branch migration/emp-mgmt-001/employee-management-to-angular
```

**Commit Workflow:**

1. **Stage Changes**
   ```bash
   git status --short
   # Verify only intended files are staged
   ```

2. **Format Commit Message**
   ```
   migration(hr): migrate employee-management to Angular
   
   Source: gaws02/client/components/employee-management/
   Target: client-ngx/src/app/pages/employee-management/
   Validation: ng build --prod, ng test --watch=false
   ```

3. **Commit**
   ```bash
   git commit -m "migration(hr): migrate employee-management to Angular" \
     -m "Source: gaws02/client/components/employee-management/" \
     -m "Target: client-ngx/src/app/pages/employee-management/" \
     -m "" \
     -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
   ```

4. **Push**
   ```bash
   git push -u origin migration/emp-mgmt-001/employee-management-to-angular
   ```

**Push Checklist:**
- [ ] Branch named: `migration/<ticket>/<component>-to-angular`
- [ ] Commit message format correct
- [ ] Validation commands run and passed
- [ ] Only intended files included
- [ ] Co-author trailer included

---

## PRE-MIGRATION ANALYSIS

### **Component Overview**

**Name:** Employee Management Portal  
**Type:** Complex, multi-tab application  
**Location:** `gaws02/client/components/employee-management/`  
**Complexity Level:** HIGH  

### **Component Metrics**

| Metric | Value |
|--------|-------|
| **Files** | 2 (HTML + JS) |
| **Lines of Code** | ~1600 |
| **Templates Size** | 23KB |
| **Controller Size** | 16KB |
| **Functions** | 30+ |
| **Forms** | 4 |
| **Tables** | 2 |
| **Tabs** | 5 |
| **API Endpoints** | 12 |
| **Services Used** | 3 ($scope, $http, $timeout) |
| **Modules Used** | 6 (ngRoute, ngRepeat, ngModel, etc.) |

### **Feature Breakdown**

**Tab 1: Employee Directory**
- Table display with columns: Name, ID, Department, Position, Salary, Status
- Search by name, ID, email
- Filter by department, status
- Sort by name, ID
- Pagination (10 items/page)
- Edit/Delete actions

**Tab 2: Add/Edit Employee**
- Personal info form: First Name, Last Name, Email, Phone, DOB, Gender
- Employment info: Department, Position, Start Date, Manager
- Salary info: Base Salary, Bonus %, Currency, Pay Frequency
- Status section: Employment Status, Remote checkbox
- Form validation with error messages
- Add/Edit/Cancel buttons

**Tab 3: Departments**
- Add department form
- Department cards showing: Head, Employee Count, Budget
- Edit/Delete department actions

**Tab 4: Payroll**
- Month selector
- Payroll table: Employee, Department, Base, Bonus, Deductions, Net
- Summary statistics: Total Base, Bonuses, Deductions, Net Pay
- Generate Payroll, Export CSV buttons

**Tab 5: Performance Reviews**
- Review filter: Year, Status
- Create/Edit review form
- Employee selector, Period, Rating (1-5), Date, Comments, Strengths, Improvements
- Review cards display
- Edit/Delete actions

### **API Endpoints**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/departments` | Get all departments |
| POST | `/api/departments` | Create department |
| DELETE | `/api/departments/:id` | Delete department |
| GET | `/api/payroll` | Get payroll data |
| GET | `/api/reviews` | Get all reviews |
| POST | `/api/reviews` | Create review |
| PUT | `/api/reviews/:id` | Update review |
| DELETE | `/api/reviews/:id` | Delete review |

---

## COMPONENT DEEP DIVE

### **AngularJS Controller Structure**

```javascript
// Current Structure
angular.module('gawsLegacy').controller('EmployeeManagementCtrl', [
  '$scope', '$http', '$timeout',
  function($scope, $http, $timeout) {
    
    // Initialization
    $scope.init = function() { ... }
    
    // Employee Management (Section 1)
    $scope.loadEmployees = function() { ... }
    $scope.filterEmployees = function() { ... }
    $scope.sortBy = function(field) { ... }
    $scope.editEmployee = function(emp) { ... }
    $scope.submitEmployeeForm = function() { ... }
    $scope.confirmDelete = function(id) { ... }
    
    // Department Management (Section 2)
    $scope.loadDepartments = function() { ... }
    $scope.submitDepartmentForm = function() { ... }
    $scope.deleteDepartment = function(id) { ... }
    
    // Payroll Management (Section 3)
    $scope.loadPayrollData = function() { ... }
    $scope.calculatePayrollSummary = function() { ... }
    $scope.generatePayroll = function() { ... }
    $scope.exportPayroll = function() { ... }
    
    // Performance Reviews (Section 4)
    $scope.loadReviews = function() { ... }
    $scope.filterReviews = function() { ... }
    $scope.submitReviewForm = function() { ... }
    $scope.editReview = function(review) { ... }
    $scope.deleteReview = function(id) { ... }
    
    // Utility Functions
    $scope.switchTab = function(tabName) { ... }
    $scope.addAlert = function(message, type) { ... }
  }
]);
```

### **Data Models (Current)**

```javascript
// Employee
{
  id: "EMP001",
  name: "John Smith",
  email: "john@company.com",
  phone: "(555) 123-4567",
  dob: "1985-05-15",
  gender: "male",
  department: "IT",
  position: "Senior Developer",
  startDate: "2020-01-15",
  salary: 95000,
  bonus: 15,
  currency: "USD",
  payFrequency: "monthly",
  status: "active",
  remote: true
}

// Department
{
  id: "IT",
  name: "Information Technology",
  head: "John Smith",
  employeeCount: 15,
  budget: 500000
}

// Payroll
{
  employeeId: "EMP001",
  employeeName: "John Smith",
  department: "IT",
  baseSalary: 95000,
  bonus: 14250,
  deductions: 14250,
  netPay: 95000,
  status: "pending"
}

// Review
{
  id: "REV001",
  employeeId: "EMP001",
  employeeName: "John Smith",
  period: "Q1 2024",
  rating: 4,
  date: "2024-03-15",
  comments: "Excellent performance",
  strengths: "Technical expertise",
  improvements: "Work-life balance",
  status: "completed"
}
```

### **Form Validation Rules**

**Employee Form:**
- First Name: Required
- Last Name: Required
- Email: Required, must be valid email
- Department: Required
- Position: Required
- Start Date: Required
- Salary: Required, must be > 0
- Bonus: 0-100 range
- Status: Required

**Department Form:**
- Name: Required

**Review Form:**
- Employee: Required
- Period: Required
- Rating: Required (1-5)
- Date: Required

---

## 5-PHASE MIGRATION PROCESS

### **Phase 1: ANALYZE (1 hour)**

**Task:** Understand the legacy component completely

**Use:** AngularJS Analyzer Agent

**Checklist:**
- [ ] Read `employee-management.html` completely
- [ ] Read `employee-management.js` completely
- [ ] Understand scope variables (30+)
- [ ] Understand all methods (30+)
- [ ] Understand form validation rules (10+)
- [ ] Understand API call patterns
- [ ] Understand user-visible messages (15+)
- [ ] Understand routing setup
- [ ] Identify all injected services
- [ ] Identify all nested components
- [ ] Document findings in analysis.md

**Output Document:**
```markdown
# Employee Management - AngularJS Analysis

## Template Breakdown
[List all HTML structure, directives, bindings]

## Scope Variables (30+)
[List all $scope.variable with description]

## Controller Methods (30+)
[List all methods with descriptions]

## Forms
- employeeForm: [fields list]
- departmentForm: [fields list]
- reviewForm: [fields list]

## Validation Rules
[Complete list of all validation]

## API Integration
[All endpoints and how they're called]

## User-Visible Messages
[All alerts, toasts, messages]

## Dependencies & Services
[List all external dependencies]

## Concerns & Considerations
[Any special handling needed]
```

**Questions to Ask User:**
- [ ] Where should new Angular component be created?
- [ ] Should I create 1 large component or 5 sub-components?
- [ ] Where should services be placed?
- [ ] Are there existing models I should use?
- [ ] What's the Angular project structure preference?

---

### **Phase 2: PLAN (1.5 hours)**

**Task:** Create detailed, executable migration plan

**Use:** Migration Planner Agent

**Checklist:**
- [ ] Identify migration unit (main + 4 subs)
- [ ] Create file mapping (source → target)
- [ ] Plan component hierarchy
- [ ] List services to extract (4)
- [ ] List models to create (4)
- [ ] Create implementation checklist
- [ ] Identify all risks & dependencies
- [ ] Suggest branch name
- [ ] Create acceptance criteria

**Output Document:**
```markdown
# Employee Management - Migration Plan

## File Mapping
| Source | Target | Type |
|--------|--------|------|
| employee-management.html | employee-management.component.html | Template |
| employee-management.js | employee-management.component.ts | Component |
| [inline] | employee.service.ts | Service |
[... complete mapping ...]

## Component Architecture
```
EmployeeManagementComponent (Main)
  ├── EmployeeDirectoryComponent
  ├── EmployeeFormComponent
  ├── DepartmentListComponent
  ├── PayrollTableComponent
  └── ReviewCardsComponent
```

## Services to Create
1. EmployeeService - CRUD + filtering
2. DepartmentService - CRUD
3. PayrollService - Calculations + retrieval
4. ReviewService - CRUD

## Models to Create
1. Employee interface
2. Department interface
3. Payroll interface
4. Review interface

## Implementation Steps
1. Create models
2. Create services
3. Create main component
4. Convert template
5. Implement forms
6. Test

## Acceptance Criteria
- [ ] All tabs render
- [ ] All CRUD works
- [ ] No console errors
- [ ] No regressions
- [ ] TypeScript strict mode passes

## Risks & Mitigations
[List any risks and how to handle them]

## Recommended Branch
migration/emp-mgmt-001/employee-management-to-angular
```

**Questions to Ask User:**
- [ ] Approval to create 4 sub-components?
- [ ] Where exactly should files be placed?
- [ ] Any naming conventions to follow?
- [ ] Should I use Reactive Forms or Template Forms?
- [ ] Any styling/CSS framework to use?

---

### **Phase 3: IMPLEMENT (2-3 hours)**

**Task:** Build the Angular component

**Use:** Angular Implementer Agent

**Step 3.1: Create Models** (20 min)

**Files to Create:**
```
client-ngx/src/app/models/
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
  gender?: 'male' | 'female' | 'other';
  department: string;
  position: string;
  startDate: string;
  salary: number;
  bonus: number;
  currency: 'USD' | 'EUR' | 'GBP';
  payFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  status: 'active' | 'inactive' | 'on-leave';
  remote: boolean;
  manager?: string;
}
```

**Validation:**
- [ ] Models compile without errors
- [ ] Types are specific (no 'any')
- [ ] Enums used for restricted values
- [ ] Optional fields marked with ?

---

**Step 3.2: Create Services** (1 hour)

**Files to Create:**
```
client-ngx/src/app/core/services/
├── employee.service.ts
├── department.service.ts
├── payroll.service.ts
└── review.service.ts
```

**Example - employee.service.ts:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '@models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = '/api/employees';

  constructor(private http: HttpClient) {}

  /**
   * Get all employees
   * Falls back to mock data if API fails
   */
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading employees:', error);
        // Return mock data
        return this.getMockEmployees();
      })
    );
  }

  /**
   * Get employee by ID
   */
  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create new employee
   */
  create(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update existing employee
   */
  update(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete employee
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('API Error'));
  }

  private getMockEmployees(): Observable<Employee[]> {
    return new Observable(observer => {
      observer.next([
        /* mock data */
      ]);
      observer.complete();
    });
  }
}
```

**Validation:**
- [ ] All methods have JSDoc comments
- [ ] Error handling implemented
- [ ] Mock data fallback works
- [ ] Types properly specified
- [ ] Observable patterns used correctly

---

**Step 3.3: Create Main Component** (1.5 hours)

**Files to Create:**
```
client-ngx/src/app/pages/employee-management/
├── employee-management.component.ts
├── employee-management.component.html
├── employee-management.component.scss
└── employee-management.component.spec.ts
```

**Component Class Structure:**
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EmployeeService } from '@services/employee.service';
import { DepartmentService } from '@services/department.service';
import { PayrollService } from '@services/payroll.service';
import { ReviewService } from '@services/review.service';

import { Employee } from '@models/employee.model';
import { Department } from '@models/department.model';
import { Payroll } from '@models/payroll.model';
import { Review } from '@models/review.model';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EmployeeManagementComponent implements OnInit, OnDestroy {
  
  // Tabs
  tabs = ['Employee Directory', 'Add/Edit Employee', 'Departments', 'Payroll', 'Performance Reviews'];
  activeTab = 'Employee Directory';
  
  // Data
  employees: Employee[] = [];
  departments: Department[] = [];
  payrollData: Payroll[] = [];
  reviews: Review[] = [];
  
  // Forms
  employeeForm!: FormGroup;
  departmentForm!: FormGroup;
  reviewForm!: FormGroup;
  
  // UI State
  alerts: Array<{ message: string; type: string }> = [];
  isSubmitting = false;
  editingEmployee: Employee | null = null;
  
  // Cleanup
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private payrollService: PayrollService,
    private reviewService: ReviewService
  ) {
    this.initializeForms();
  }
  
  ngOnInit(): void {
    this.loadAllData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initializeForms(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // ... more fields
    });
    // ... other forms
  }
  
  private loadAllData(): void {
    this.employeeService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        this.employees = employees;
        this.filterEmployees();
      });
    
    // Load other data
  }
  
  // ... rest of methods
}
```

**Validation:**
- [ ] Component initializes without errors
- [ ] Services properly injected
- [ ] Forms properly initialized
- [ ] Data loading works
- [ ] Type safety verified

---

**Step 3.4: Convert Template** (1 hour)

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

**Template Structure:**
```html
<div class="employee-management-container">
  <!-- Header -->
  <div class="header">
    <h1>Employee Management Portal</h1>
  </div>
  
  <!-- Alerts -->
  <div class="alerts" *ngIf="alerts.length > 0">
    <div class="alert" *ngFor="let alert of alerts; let i = index" 
         [ngClass]="'alert-' + alert.type">
      {{ alert.message }}
      <button (click)="removeAlert(i)">×</button>
    </div>
  </div>
  
  <!-- Tabs -->
  <div class="tabs-wrapper">
    <ul class="tabs">
      <li *ngFor="let tab of tabs" 
          [class.active]="activeTab === tab"
          (click)="switchTab(tab)">
        {{ tab }}
      </li>
    </ul>
  </div>
  
  <!-- Tab Content -->
  <div *ngIf="activeTab === 'Employee Directory'" class="tab-content">
    <!-- Employee Directory Content -->
  </div>
  
  <!-- Other tabs... -->
</div>
```

**Validation:**
- [ ] Template compiles without errors
- [ ] All bindings work
- [ ] All directives correct
- [ ] Forms display properly
- [ ] Tables render correctly

---

**Step 3.5: Implement Forms** (45 min)

**Convert from ng-model to Reactive Forms:**

```typescript
// Before (AngularJS)
$scope.employeeForm = {};
$scope.formData = {};
$scope.submitEmployeeForm = function() {
  if (!$scope.employeeForm.$valid) { ... }
};

// After (Angular)
employeeForm: FormGroup;

constructor(private fb: FormBuilder) {
  this.employeeForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
    position: ['', Validators.required],
    startDate: ['', Validators.required],
    salary: ['', [Validators.required, Validators.min(0)]],
    bonus: ['', [Validators.min(0), Validators.max(100)]],
    status: ['active', Validators.required]
  });
}

submitEmployeeForm(): void {
  if (!this.employeeForm.valid) {
    this.addAlert('Please fill all required fields', 'error');
    return;
  }

  this.isSubmitting = true;
  const employee = this.employeeForm.value;
  
  const operation = this.editingEmployee
    ? this.employeeService.update(this.editingEmployee.id, employee)
    : this.employeeService.create(employee);

  operation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      result => {
        this.addAlert('Employee saved successfully', 'success');
        this.loadEmployees();
        this.resetForm();
      },
      error => {
        this.addAlert('Failed to save employee', 'error');
      },
      () => {
        this.isSubmitting = false;
      }
    );
}
```

**Validation:**
- [ ] Forms validate correctly
- [ ] Error messages display
- [ ] Submit handlers work
- [ ] Reactive patterns used
- [ ] Type safety verified

---

**Step 3.6: Update Routing** (15 min)

**Add to src/app/app.routes.ts:**
```typescript
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';

export const routes: Routes = [
  // ... existing routes
  {
    path: 'employee-management',
    component: EmployeeManagementComponent,
    data: { title: 'Employee Management' }
  }
];
```

**Validation:**
- [ ] Route added correctly
- [ ] Component imports correctly
- [ ] Route is accessible
- [ ] No import errors

---

**Step 3.7: Validation** (30 min)

```bash
# 1. Type checking
ng build --prod

# 2. Run tests (if available)
ng test --watch=false

# 3. Start dev server
ng serve

# 4. Navigate to http://localhost:4200/#/employee-management

# 5. Check browser console for errors
```

**Output:**
```markdown
# Implementation Report

## Files Created
- employee.model.ts
- department.model.ts
- payroll.model.ts
- review.model.ts
- employee.service.ts
- department.service.ts
- payroll.service.ts
- review.service.ts
- employee-management.component.ts
- employee-management.component.html
- employee-management.component.scss

## Files Modified
- src/app/app.routes.ts

## Build Status
✓ Type checking PASSED
✓ Build PASSED
✓ Tests PASSED (or N/A)

## Remaining Gaps
[List any incomplete items]

## Known Issues
[List any issues found]
```

---

### **Phase 4: REVIEW (1.5 hours)**

**Task:** Verify component quality and correctness

**Use:** Migration Reviewer Agent

**Checklist:**

**Behavioral Testing:**
- [ ] Component loads without errors
- [ ] All 5 tabs display and navigate
- [ ] Employee Directory tab works
  - [ ] Load employees displays correctly
  - [ ] Search filters employees
  - [ ] Filter by department works
  - [ ] Filter by status works
  - [ ] Sort by name/ID works
  - [ ] Pagination works
  - [ ] Edit button opens form
  - [ ] Delete button shows confirmation

- [ ] Add/Edit Employee tab works
  - [ ] Form displays all fields
  - [ ] Required fields validation works
  - [ ] Email validation works
  - [ ] Submit creates new employee
  - [ ] Submit updates existing employee
  - [ ] Cancel returns to directory

- [ ] Department tab works
  - [ ] Add department form works
  - [ ] Department cards display
  - [ ] Delete works

- [ ] Payroll tab works
  - [ ] Month selector works
  - [ ] Payroll table displays
  - [ ] Calculations are correct
  - [ ] Summary stats are correct

- [ ] Reviews tab works
  - [ ] Filter by year works
  - [ ] Filter by status works
  - [ ] Create review form works
  - [ ] Edit review works
  - [ ] Delete review works

**Code Quality:**
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript strict mode passes
- [ ] All types properly defined
- [ ] No 'any' types used
- [ ] Services properly injected
- [ ] Error handling implemented
- [ ] Memory leaks prevented (unsubscribe)

**Comparison vs AngularJS:**
- [ ] All user-visible messages match
- [ ] All form validations identical
- [ ] All CRUD operations work the same
- [ ] All calculations match
- [ ] No behavior regressions

**Output Document:**
```markdown
# Migration Review Report

## Behavioral Testing: PASS/FAIL
- Employee Directory: ✓
- Employee Form: ✓
- Departments: ✓
- Payroll: ✓
- Reviews: ✓

## Code Quality: PASS/FAIL
- No console errors: ✓
- Type safety: ✓
- Error handling: ✓
- Memory management: ✓

## Regression Testing: PASS/FAIL
- Form validations: ✓
- API calls: ✓
- User messages: ✓
- Calculations: ✓

## Issues Found
[List any issues]

## Recommendations
[List any follow-ups]

## Overall Status: APPROVED / NEEDS WORK

## Residual Risk: LOW / MEDIUM / HIGH
```

---

### **Phase 5: COMMIT & DOCUMENT (30 min)**

**Task:** Commit code and document migration

**Use:** gaws-git-workflow Skill

**Checklist:**

1. **Create Migration Log**
   - File: `client-ngx/migration-log/emp-mgmt-migration-YYYYMMDD-HHMMSS.log`
   - Include all timestamps and status updates

2. **Update Migration Tracking**
   - Update `migrated-components.json` with "done" status
   - Update `migrated-services.json`
   - Update `migrated-functions.json`
   - Update `migration-history.md`

3. **Create Branch**
   ```bash
   git checkout -b migration/emp-mgmt-001/employee-management-to-angular
   ```

4. **Stage Changes**
   ```bash
   git add .
   git status --short  # Verify
   ```

5. **Commit**
   ```bash
   git commit -m "migration(hr): migrate employee-management to Angular" \
     -m "Source: gaws02/client/components/employee-management/" \
     -m "Target: client-ngx/src/app/pages/employee-management/" \
     -m "" \
     -m "Modules Migrated:" \
     -m "  - Employee CRUD operations" \
     -m "  - Department management" \
     -m "  - Payroll processing" \
     -m "  - Performance reviews" \
     -m "" \
     -m "Validation:" \
     -m "  - TypeScript strict mode: PASS" \
     -m "  - Build: ng build --prod: PASS" \
     -m "  - Manual testing: PASS" \
     -m "  - No regressions detected" \
     -m "" \
     -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
   ```

6. **Push**
   ```bash
   git push -u origin migration/emp-mgmt-001/employee-management-to-angular
   ```

7. **Document in Database**
   ```sql
   UPDATE migrations 
   SET status = 'done', updated_at = CURRENT_TIMESTAMP 
   WHERE id = 'emp-mgmt-001';

   UPDATE migrated_items 
   SET status = 'done' 
   WHERE migration_id = 'emp-mgmt-001';
   ```

---

## DETAILED IMPLEMENTATION GUIDE

### **Creating TypeScript Models**

**Pattern for All Models:**

```typescript
// employee.model.ts
/**
 * Employee interface representing an employee in the system
 * Maps to API response from /api/employees
 */
export interface Employee {
  // Required fields
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  
  // Optional fields
  phone?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  bonus?: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  payFrequency?: 'weekly' | 'bi-weekly' | 'monthly';
  remote?: boolean;
  manager?: string;
}
```

**Best Practices:**
- Use specific types, never 'any'
- Use enums or union types for restricted values
- Mark optional fields with ?
- Add JSDoc comments
- Group related fields

---

### **Creating Services**

**Pattern for All Services:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Private API URL
  private readonly apiUrl = '/api/employees';
  
  // Observable for component subscriptions
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get all employees with error handling and mock fallback
   */
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap(employees => this.employeesSubject.next(employees)),
      catchError(error => {
        console.error('Error loading employees:', error);
        // Return empty array or mock data
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }
  
  /**
   * Get employee by ID
   */
  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  /**
   * Create new employee
   */
  create(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap(() => this.getAll().subscribe()), // Refresh list
      catchError(error => this.handleError(error))
    );
  }
  
  /**
   * Update employee
   */
  update(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      tap(() => this.getAll().subscribe()), // Refresh list
      catchError(error => this.handleError(error))
    );
  }
  
  /**
   * Delete employee
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe()), // Refresh list
      catchError(error => this.handleError(error))
    );
  }
  
  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    const errorMsg = error.error?.message || 'An error occurred';
    return throwError(() => new Error(errorMsg));
  }
}
```

**Best Practices:**
- Use HttpClient (not legacy Http)
- Error handling with catchError
- Observable patterns for reactive code
- BehaviorSubject for shared state
- JSDoc comments for all methods
- Tap for side effects
- Type all responses

---

### **Creating Components**

**Component Structure:**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EmployeeManagementComponent implements OnInit, OnDestroy {
  
  // Lifecycle subject for cleanup
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}
  
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadData(): void {
    this.employeeService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        // Handle data
      });
  }
}
```

**Best Practices:**
- Use OnInit and OnDestroy lifecycle hooks
- Use takeUntil for subscription cleanup
- Use FormBuilder for reactive forms
- Use standalone components
- Proper TypeScript types everywhere
- Private methods for internal logic

---

### **Converting Templates**

**AngularJS vs Angular Syntax:**

| Feature | AngularJS | Angular |
|---------|-----------|---------|
| Property Binding | `{{ variable }}` | `{{ variable }}` (same) |
| Two-Way Binding | `ng-model="var"` | `[(ngModel)]="var"` |
| Event Binding | `ng-click="fn()"` | `(click)="fn()"` |
| Conditional | `ng-if="bool"` | `*ngIf="bool"` |
| Loop | `ng-repeat="x in xs"` | `*ngFor="let x of xs"` |
| Class | `ng-class="{'cls':bool}"` | `[ngClass]="{'cls': bool}"` |
| Style | `ng-style="{}"` | `[ngStyle]="{}"` |
| Disabled | `ng-disabled="bool"` | `[disabled]="bool"` |
| Show/Hide | `ng-show="bool"` | `[hidden]="!bool"` or `*ngIf="bool"` |
| Submit | `ng-submit="fn()"` | `(ngSubmit)="fn()"` |
| Model | `ng-model="form.field"` | `[formControl]` or `[(ngModel)]` |

---

### **Form Conversion Example**

**AngularJS Form:**
```html
<form name="employeeForm" ng-submit="submitEmployeeForm()">
  <div>
    <label>First Name *</label>
    <input type="text" 
           name="firstName" 
           ng-model="formData.firstName" 
           required>
    <span ng-show="employeeForm.firstName.$error.required">
      First name is required
    </span>
  </div>
  
  <button type="submit" ng-disabled="employeeForm.$invalid">
    Save Employee
  </button>
</form>
```

**Angular Form (Reactive):**
```html
<form [formGroup]="employeeForm" (ngSubmit)="submitEmployeeForm()">
  <div>
    <label>First Name *</label>
    <input type="text" 
           formControlName="firstName" 
           [class.error]="isFieldInvalid('firstName')">
    <span *ngIf="isFieldInvalid('firstName')">
      First name is required
    </span>
  </div>
  
  <button type="submit" 
          [disabled]="employeeForm.invalid || isSubmitting">
    Save Employee
  </button>
</form>
```

**Component Code:**
```typescript
employeeForm: FormGroup;

constructor(private fb: FormBuilder) {
  this.employeeForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    // ... other fields
  });
}

isFieldInvalid(fieldName: string): boolean {
  const field = this.employeeForm.get(fieldName);
  return !!(field && field.invalid && (field.dirty || field.touched));
}

submitEmployeeForm(): void {
  if (!this.employeeForm.valid) {
    return;
  }
  // Submit logic
}
```

---

## TESTING & VERIFICATION

### **Unit Testing (Component)**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmployeeManagementComponent', () => {
  let component: EmployeeManagementComponent;
  let fixture: ComponentFixture<EmployeeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeeManagementComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [EmployeeService]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    fixture.detectChanges();
    expect(component.employees.length).toBeGreaterThan(0);
  });

  it('should validate employee form', () => {
    component.employeeForm.patchValue({
      firstName: 'John'
      // missing required fields
    });
    expect(component.employeeForm.valid).toBeFalsy();
  });
});
```

### **Integration Testing**

```bash
# Run all tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/employee-management.component.spec.ts'
```

### **Manual Testing Checklist**

**Employee Directory Tab:**
- [ ] Load employees from API
- [ ] Search by name works
- [ ] Search by ID works
- [ ] Filter by department works
- [ ] Filter by status works
- [ ] Sort by name changes order
- [ ] Sort by ID changes order
- [ ] Pagination displays 10 items per page
- [ ] Next/Previous buttons work
- [ ] Edit button opens form
- [ ] Delete button shows confirmation
- [ ] Confirm delete removes employee

**Add/Edit Employee Tab:**
- [ ] Form displays all fields
- [ ] Form shows error for empty required fields
- [ ] Form shows error for invalid email
- [ ] Add new employee creates record
- [ ] Edit existing employee updates record
- [ ] Cancel button returns to directory
- [ ] Success alert displays

**Departments Tab:**
- [ ] Add department form works
- [ ] New department appears in list
- [ ] Department cards display correctly
- [ ] Delete department removes it

**Payroll Tab:**
- [ ] Month selector works
- [ ] Payroll table displays employees
- [ ] Salary calculations are correct
- [ ] Summary totals are correct
- [ ] Generate payroll button works

**Performance Reviews Tab:**
- [ ] Filter by year works
- [ ] Filter by status works
- [ ] Create review form works
- [ ] Edit review pre-populates form
- [ ] Delete review removes it

**General:**
- [ ] No console errors
- [ ] No console warnings
- [ ] All alerts display properly
- [ ] No broken images or styling
- [ ] Responsive design works

---

## GIT WORKFLOW & COMMITS

### **Branch Creation**

```bash
# Create migration branch
git checkout -b migration/emp-mgmt-001/employee-management-to-angular

# Verify branch created
git branch -a | grep employee-management
```

### **Staging Changes**

```bash
# Check status
git status --short

# Stage all changes
git add .

# Or stage specific files
git add client-ngx/src/app/pages/employee-management/
git add client-ngx/src/app/core/services/
git add client-ngx/src/app/models/

# Review staged changes
git diff --staged
```

### **Committing**

**Single commit (recommended):**
```bash
git commit -m "migration(hr): migrate employee-management to Angular" \
  -m "Source: gaws02/client/components/employee-management/" \
  -m "Target: client-ngx/src/app/pages/employee-management/" \
  -m "" \
  -m "Modules Migrated:" \
  -m "  - Employee CRUD" \
  -m "  - Department management" \
  -m "  - Payroll processing" \
  -m "  - Performance reviews" \
  -m "" \
  -m "Validation:" \
  -m "  - TypeScript strict: PASS" \
  -m "  - Build: PASS" \
  -m "  - Tests: PASS" \
  -m "" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### **Pushing**

```bash
# Push to remote with upstream tracking
git push -u origin migration/emp-mgmt-001/employee-management-to-angular

# Verify push
git branch -vv
```

---

## LOGGING & DOCUMENTATION

### **Migration Log File**

**Location:** `client-ngx/migration-log/emp-mgmt-migration-20260427-160000.log`

**Format:**
```markdown
# Employee Management Migration Log

**Migration ID:** emp-mgmt-001
**Component:** employee-management  
**Start Time:** 2026-04-27 16:00:00 UTC
**Status:** IN PROGRESS

---

## Phase 1: Analysis
**Time:** 2026-04-27 16:00:00 - 2026-04-27 17:00:00 (1 hour)
**Status:** COMPLETED

### Findings
- 5 main tabs identified
- 30+ functions catalogued
- 12 API endpoints documented
- 4 forms with validation analyzed
- Service injection patterns identified

### Questions Asked
1. Component structure preference? → Answer: Single main + 4 sub-components
2. Service location? → Answer: src/app/core/services/

---

## Phase 2: Planning
**Time:** 2026-04-27 17:00:00 - 2026-04-27 18:30:00 (1.5 hours)
**Status:** COMPLETED

### Plan Created
- 4 services planned: Employee, Department, Payroll, Review
- 4 models planned: Employee, Department, Payroll, Review
- Component structure finalized
- File mapping completed

---

## Phase 3: Implementation
**Time:** 2026-04-27 18:30:00 - In Progress
**Status:** IN PROGRESS

### Step 3.1: Models Created (20 min)
- [x] employee.model.ts
- [x] department.model.ts
- [x] payroll.model.ts
- [x] review.model.ts

### Step 3.2: Services Created (1 hour)
- [x] employee.service.ts
- [x] department.service.ts
- [x] payroll.service.ts
- [x] review.service.ts

### Step 3.3: Main Component (In Progress)
- [x] Component class created
- [ ] Template converted
- [ ] Forms implemented
- [ ] Routes updated

### Issues Encountered
[None yet]

### Decisions Made
- Used Reactive Forms over Template Forms
- Used BehaviorSubject for state management
- Created single main component with 5 tab sections

---

## Timeline
- Phase 1 (Analysis): ✓ Done
- Phase 2 (Planning): ✓ Done
- Phase 3 (Implementation): ~ In Progress
- Phase 4 (Review): ○ Pending
- Phase 5 (Commit): ○ Pending

---

**End of Log**
```

### **Migrated Items Tracking**

**File:** `client-ngx/migration-log/migrated-components.json`

```json
{
  "migration_id": "emp-mgmt-001",
  "component_name": "employee-management",
  "status": "in_progress",
  "start_date": "2026-04-27T16:00:00Z",
  "items": [
    {
      "id": "item-001",
      "type": "component",
      "name": "EmployeeManagementComponent",
      "old_path": "gaws02/client/components/employee-management/employee-management.html",
      "new_path": "client-ngx/src/app/pages/employee-management/employee-management.component.html",
      "description": "Main component with 5 tabs managing employees, departments, payroll, and reviews",
      "status": "in_progress"
    },
    {
      "id": "item-002",
      "type": "service",
      "name": "EmployeeService",
      "old_path": "gaws02/client/components/employee-management.js (inline)",
      "new_path": "client-ngx/src/app/core/services/employee.service.ts",
      "description": "Service for employee CRUD operations: getAll, getById, create, update, delete, filter, sort",
      "status": "done"
    }
    // ... more items
  ]
}
```

---

## TROUBLESHOOTING GUIDE

### **Common Issues & Solutions**

**Issue 1: "Cannot find module '@services/employee.service'"**
```
Cause: Path alias not configured
Solution: Check tsconfig.json paths are set up:
  "paths": {
    "@services/*": ["src/app/core/services/*"],
    "@models/*": ["src/app/models/*"]
  }
```

**Issue 2: "ERROR in template(...): Property 'employees' does not exist"**
```
Cause: Component property not declared
Solution: Add to component class:
  employees: Employee[] = [];
```

**Issue 3: "Form validation errors not showing"**
```
Cause: Incorrect error checking syntax
Before (AngularJS): form.field.$error.required
After (Angular): form.get('field')?.hasError('required')
```

**Issue 4: "API calls not working"**
```
Cause: Missing HttpClientModule import
Solution: Add to component imports:
  imports: [HttpClientModule, ReactiveFormsModule, ...]
```

**Issue 5: "Memory leak warnings"**
```
Cause: Subscriptions not unsubscribed
Solution: Use takeUntil pattern:
  this.service.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe(...)
```

### **Build Errors**

```bash
# TypeScript errors
ng build --prod

# Type checking only
npx tsc --noEmit

# Check for any type
npm run lint
```

### **Runtime Errors**

```bash
# Start dev server with source maps
ng serve --source-map

# Check browser DevTools console for errors
# Look for red errors and stack traces
```

---

## SUMMARY & CHECKLIST

### **Pre-Migration**
- [ ] Read all documentation
- [ ] Understand component structure
- [ ] Ask clarifying questions
- [ ] Get user approvals
- [ ] Set up tracking

### **Migration Execution**
- [ ] Phase 1: Analyze (1 hour)
- [ ] Phase 2: Plan (1.5 hours)
- [ ] Phase 3: Implement (2-3 hours)
- [ ] Phase 4: Review (1.5 hours)
- [ ] Phase 5: Commit (30 min)

### **Post-Migration**
- [ ] Create migration log
- [ ] Update tracking files
- [ ] Commit and push code
- [ ] Document lessons learned
- [ ] Archive migration artifacts

### **Success Criteria**
- [ ] All tabs functional
- [ ] All CRUD operations work
- [ ] No console errors
- [ ] No regressions vs AngularJS
- [ ] TypeScript strict mode passes
- [ ] All tests pass (if applicable)
- [ ] Migration tracked in database

---

## FINAL NOTES

**This Document Is Your Guide**

Use this document as your primary reference during the entire migration process. Follow the phases in order, ask questions using the no-guesswork policy, and track everything in the logging system.

**Success Depends On:**
1. Following the phases in order
2. Not making assumptions (ask instead)
3. Testing thoroughly after each phase
4. Documenting everything as you go
5. Comparing behavior against the AngularJS version

**When In Doubt:**
- Re-read the relevant section
- Ask the user for clarification
- Check the COMPONENT_SPEC.md for details
- Review the MIGRATION_LOG.md for context

---

**Happy Migrating!** 🚀

This complete instruction set contains everything needed to successfully migrate the Employee Management Portal from AngularJS to Angular. Use it as your roadmap and documentation standard.

---

**Version:** 1.0  
**Last Updated:** 2026-04-27  
**Status:** Production Ready  
**Next Step:** Begin Phase 1: Analysis
