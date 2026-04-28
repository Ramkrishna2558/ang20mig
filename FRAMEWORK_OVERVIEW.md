# GAWS AngularJS → Angular Migration Framework

**Status:** ✅ Production Ready

**Date:** 2026-04-27

---

## Overview

This framework provides structured guidance for migrating AngularJS components from `gaws02/client` to Angular in `gaws02/client-ngx`, using specialized agents and skills.

---

## Framework Components

### **1. Agents** (.agents/ folder)

Four specialized agents handle different migration phases:

#### **AngularJS Analyzer Agent**
- **Role:** Analyze legacy AngularJS component without changing it
- **Input:** Path to legacy component files
- **Output:** Implementation notes for migration
- **Checklist:**
  - Read HTML template and JS controller
  - Identify scope/ViewModel fields
  - List all functions and methods
  - Document injected services
  - Note validation rules
  - Record user-visible messages
  - Identify shared dependencies

#### **Migration Planner Agent**
- **Role:** Decide smallest safe migration unit
- **Input:** AngularJS source + Angular target paths + Optional ticket ID
- **Output:** Migration plan with:
  - Migration unit name
  - Source files list
  - Target files list
  - Branch name suggestion
  - Acceptance checklist
- **Responsibility:** Call out missing dependencies BEFORE implementation

#### **Angular Implementer Agent**
- **Role:** Implement migration in client-ngx
- **Rules:**
  - Keep write scope focused to target component
  - Preserve user-visible behavior from AngularJS
  - Use standalone Angular components
  - Use typed services and reactive state
  - Add TODO comments only for confirmed follow-up work with ticket IDs
- **Verification:**
  - Run build/type-check validation
  - Report files changed
  - Report remaining gaps

#### **Migration Reviewer Agent**
- **Role:** Review migrated Angular code against legacy source
- **Review Priorities:**
  - Behavior regressions vs. AngularJS
  - Missing route wiring, form validation, redirects
  - Untyped or brittle data contracts
  - Missing tests for non-trivial branching
- **Output:** Findings with file/line references + residual risk

---

### **2. Skills** (.codex/skills/ folder)

#### **gaws-component-migration**
- **Skill:** Migrate one AngularJS page or component
- **Usage:** Run when migrating individual AngularJS → Angular components
- **Workflow:**
  1. Identify migration unit (one page, route, or component)
  2. Read AngularJS `.html` and `.js` files
  3. Read referenced shared services, components, assets, routes
  4. Create Angular target under `client-ngx/src/app`
  5. Preserve visible behavior first
  6. Improve typing and Angular structure
  7. Wire route in `app.routes.ts`
  8. Run lightest available validation

**Conventions:**
- Prefer standalone Angular components
- Keep one focused migration per skill run
- Mirror user-visible messages exactly
- Put shared logic in `core/services` or `shared`
- Keep compatibility comments short and ticket-based

**Reference:**
- `SKILL.md` - Detailed skill description
- `migration-checklist.md` - Migration checklist
- `scripts/new-migration.ps1` - Create component folders

#### **gaws-git-workflow**
- **Skill:** Standardize branch, commit, and push operations
- **Usage:** Run when creating branches, formatting commits, or pushing migration code
- **Branch Naming:** `migration/<ticket-or-area>/<legacy-name>-to-angular`
- **Commit Format:**
  ```
  migration(<area>): migrate <legacy-name> to Angular
  
  Source: gaws02/client/<source files>
  Target: gaws02/client-ngx/src/app/<target files>
  Validation: <commands run or reason not run>
  ```
- **Scripts:**
  - `start-migration-branch.ps1` - Create branch with ticket + component
  - `push-migration-branch.ps1` - Validate and push branch

---

### **3. Test Component**

**Employee Management Portal** - Complex demo/test component featuring:
- ✅ 5 tabs (Employee Directory, Forms, Departments, Payroll, Reviews)
- ✅ 4 forms with comprehensive validation
- ✅ 2 data tables with search/filter/sort/pagination
- ✅ 12 API endpoints (GET/POST/PUT/DELETE)
- ✅ 30+ controller functions
- ✅ Multiple services and dependencies
- ✅ Real-world complexity

**Location:** `gaws02/client/components/employee-management/`

**Access:** `http://localhost:3000/#/employee-management`

**Documentation:**
- `COMPONENT_SPEC.md` - Technical specifications
- `MIGRATION_LOG.md` - Migration details
- `MIGRATION_INSTRUCTIONS.md` - Step-by-step guide

---

## Migration Workflow

### **Step 1: Setup**
```bash
cd gaws/gaws02
npm install
npm start  # Server runs on http://localhost:3000
```

### **Step 2: Analyze**
Use **AngularJS Analyzer Agent** to review legacy component

### **Step 3: Plan**
Use **Migration Planner Agent** to create migration plan

### **Step 4: Implement**
Use **Angular Implementer Agent** to code the migration

### **Step 5: Review**
Use **Migration Reviewer Agent** to verify against source

### **Step 6: Commit & Push**
Use **gaws-git-workflow** skill for version control

---

## File Structure

```
gaws/
├── .agents/                          # Agent role definitions
│   ├── migration-planner.md
│   ├── migration-reviewer.md
│   ├── angular-implementer.md
│   └── angularjs-analyzer.md
├── .codex/
│   └── skills/
│       ├── gaws-component-migration/
│       │   ├── SKILL.md
│       │   ├── references/migration-checklist.md
│       │   ├── scripts/new-migration.ps1
│       │   └── agents/openai.yaml
│       └── gaws-git-workflow/
│           ├── SKILL.md
│           ├── references/message-standards.md
│           ├── scripts/start-migration-branch.ps1
│           ├── scripts/push-migration-branch.ps1
│           └── agents/openai.yaml
├── MIGRATION_GUIDELINES.md           # Core guidelines
├── MIGRATION_INSTRUCTIONS.md         # Step-by-step guide
├── README.md
└── gaws02/
    ├── client/                        # Legacy AngularJS
    │   ├── components/
    │   │   ├── employee-management/
    │   │   │   ├── employee-management.html
    │   │   │   ├── COMPONENT_SPEC.md
    │   │   │   └── MIGRATION_LOG.md
    │   │   └── employee-management.js
    │   ├── index.html
    │   └── init.js
    ├── client-ngx/                    # Target Angular (to be migrated to)
    ├── backend/server.js              # Mock API server
    └── package.json
```

---

## Key Principles

### **1. No Guesswork**
Always ask about:
- Routes structure and wiring
- File locations and dependencies
- Component hierarchy and imports
- Service dependencies
- API contracts

### **2. Logging & Documentation**
Every migration creates:
- Log file with timestamp and status
- List of migrated files/functions/services
- Description of each item
- Validation status

### **3. CSS Standards**
- Use ONLY CSS from provided images
- Prioritize existing component styles
- Avoid custom/undefined CSS

### **4. Branch Naming**
Standard format: `migration/<ticket-id>/<component-name>-to-angular`

Example: `migration/gaws-123/login-to-angular`

### **5. Git Commits**
Format: `migration(<area>): migrate <component> to Angular`

Include source, target, and validation info in body

---

## Migration Checklist Template

### **Analyze Phase**
- [ ] Source template path identified
- [ ] Source controller/component path identified
- [ ] AngularJS injections documented
- [ ] Scope/controller-as fields listed
- [ ] Methods called from template documented
- [ ] Validation rules recorded
- [ ] User-visible messages noted
- [ ] Navigation and route changes identified
- [ ] Shared service calls documented
- [ ] Nested components and assets noted

### **Implement Phase**
- [ ] Angular standalone component created
- [ ] Strongly typed inputs/outputs added
- [ ] Service logic extracted into Angular injectable
- [ ] Route behavior preserved in app.routes.ts
- [ ] CSS intent preserved with component styles
- [ ] Forms converted to Reactive Forms
- [ ] HTTP calls converted to HttpClient
- [ ] Type safety verified

### **Verify Phase**
- [ ] Build/type-check passes
- [ ] Migrated route accessible
- [ ] Manual testing exercises all features
- [ ] Comparison against legacy template/controller complete
- [ ] No behavior regressions found

---

## Success Metrics

✅ **Behavioral Fidelity**
- All user-visible functionality preserved
- Form validation identical
- API calls work the same way
- Error messages match

✅ **Code Quality**
- TypeScript strict mode compliant
- Type safety throughout
- Services properly injected
- Models provide interfaces

✅ **Testing**
- Manual testing passes all use cases
- No console errors/warnings
- Responsive design maintained
- Cross-browser compatibility

---

## Resources

**Documentation:**
- `MIGRATION_GUIDELINES.md` - Core principles
- `MIGRATION_INSTRUCTIONS.md` - Step-by-step guide
- `.agents/` folder - Agent role definitions
- `.codex/skills/` folder - Skill reference

**Test Component:**
- `gaws02/client/components/employee-management/` - Demo component
- `COMPONENT_SPEC.md` - Detailed specifications
- `MIGRATION_LOG.md` - Migration details

**Backend:**
- `gaws02/backend/server.js` - Mock API server
- Endpoints: `/api/employees`, `/api/departments`, `/api/payroll`, `/api/reviews`

---

## Quick Start

```bash
# 1. Navigate to project
cd "C:\Users\r.vijay.more\Documents\My Web Sites\ang20mig"

# 2. Start the AngularJS application
cd gaws02
npm start

# 3. Access in browser
# http://localhost:3000/#/employee-management

# 4. Begin migration using the framework
# - Read MIGRATION_INSTRUCTIONS.md
# - Execute AngularJS Analyzer Agent
# - Run Migration Planner Agent
# - Use Angular Implementer Agent
# - Verify with Migration Reviewer Agent
```

---

## Support

For questions or issues:
1. Check MIGRATION_GUIDELINES.md
2. Review agent definitions in .agents/
3. Consult skill documentation in .codex/skills/
4. Review test component examples

---

**Framework Version:** 1.0  
**Last Updated:** 2026-04-27  
**Status:** ✅ Production Ready
