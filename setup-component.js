const fs = require('fs');
const path = require('path');

// Create directories
const componentDir = path.join(__dirname, 'gaws02', 'client', 'components', 'employee-management');

if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
  console.log(`✓ Created directory: ${componentDir}`);
} else {
  console.log(`✓ Directory already exists: ${componentDir}`);
}

// HTML Template
const htmlContent = `<div class="employee-management-container" ng-controller="EmployeeManagementCtrl">
  <div class="header">
    <h1>Employee Management Portal</h1>
    <p class="subtitle">Manage employees, departments, payroll, and performance reviews</p>
  </div>

  <!-- Alert Messages -->
  <div class="alerts" ng-if="alerts.length > 0">
    <div class="alert" ng-repeat="alert in alerts" ng-class="'alert-' + alert.type">
      <span>{{ alert.message }}</span>
      <button class="close-btn" ng-click="removeAlert($index)">×</button>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="tabs-wrapper">
    <ul class="tabs">
      <li ng-repeat="tab in tabs" 
          ng-class="{ active: activeTab === tab }"
          ng-click="switchTab(tab)">
        {{ tab }}
      </li>
    </ul>
  </div>

  <!-- Tab 1: Employee Directory -->
  <div class="tab-content" ng-if="activeTab === 'Employee Directory'">
    <div class="section employee-directory">
      <h2>Employee Directory</h2>
      
      <!-- Search & Filter -->
      <div class="search-filter-bar">
        <input type="text" 
               class="search-input" 
               placeholder="Search employees..." 
               ng-model="employeeSearch"
               ng-keyup="filterEmployees()">
        <select ng-model="departmentFilter" ng-change="filterEmployees()" class="filter-select">
          <option value="">All Departments</option>
          <option ng-repeat="dept in departments" value="{{ dept.id }}">{{ dept.name }}</option>
        </select>
        <select ng-model="statusFilter" ng-change="filterEmployees()" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select>
      </div>

      <!-- Employee Table -->
      <div class="table-wrapper">
        <table class="employee-table">
          <thead>
            <tr>
              <th ng-click="sortBy('name')">Name <span ng-show="sortField === 'name'">▼</span></th>
              <th ng-click="sortBy('id')">Employee ID</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="emp in filteredEmployees | orderBy:sortField"
                ng-class="emp.status">
              <td>{{ emp.name }}</td>
              <td>{{ emp.id }}</td>
              <td>{{ emp.department }}</td>
              <td>{{ emp.position }}</td>
              <td>\${{ emp.salary | number:2 }}</td>
              <td><span class="badge" ng-class="'badge-' + emp.status">{{ emp.status }}</span></td>
              <td>
                <button class="btn-small edit" ng-click="editEmployee(emp)">Edit</button>
                <button class="btn-small delete" ng-click="confirmDelete(emp.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button ng-disabled="currentPage === 1" ng-click="previousPage()">← Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button ng-disabled="currentPage === totalPages" ng-click="nextPage()">Next →</button>
      </div>
    </div>
  </div>

  <!-- Tab 2: Add/Edit Employee -->
  <div class="tab-content" ng-if="activeTab === 'Add/Edit Employee'">
    <div class="section employee-form">
      <h2 ng-if="!editingEmployee">Add New Employee</h2>
      <h2 ng-if="editingEmployee">Edit Employee</h2>

      <form name="employeeForm" ng-submit="submitEmployeeForm()" class="form-container">
        <!-- Personal Information -->
        <fieldset>
          <legend>Personal Information</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="emp-firstName">First Name *</label>
              <input type="text" 
                     id="emp-firstName"
                     name="firstName" 
                     ng-model="formData.firstName" 
                     required
                     placeholder="Enter first name">
              <span class="error" ng-show="employeeForm.firstName.$error.required">First name is required</span>
            </div>
            <div class="form-group">
              <label for="emp-lastName">Last Name *</label>
              <input type="text" 
                     id="emp-lastName"
                     name="lastName" 
                     ng-model="formData.lastName" 
                     required
                     placeholder="Enter last name">
              <span class="error" ng-show="employeeForm.lastName.$error.required">Last name is required</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="emp-email">Email *</label>
              <input type="email" 
                     id="emp-email"
                     name="email" 
                     ng-model="formData.email" 
                     required
                     placeholder="employee@company.com">
              <span class="error" ng-show="employeeForm.email.$error.required">Email is required</span>
              <span class="error" ng-show="employeeForm.email.$error.email">Invalid email format</span>
            </div>
            <div class="form-group">
              <label for="emp-phone">Phone</label>
              <input type="tel" 
                     id="emp-phone"
                     name="phone" 
                     ng-model="formData.phone"
                     placeholder="(123) 456-7890">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="emp-dob">Date of Birth</label>
              <input type="date" 
                     id="emp-dob"
                     name="dob" 
                     ng-model="formData.dob">
            </div>
            <div class="form-group">
              <label for="emp-gender">Gender</label>
              <select id="emp-gender" name="gender" ng-model="formData.gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </fieldset>

        <!-- Employment Information -->
        <fieldset>
          <legend>Employment Information</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="emp-department">Department *</label>
              <select id="emp-department"
                      name="department" 
                      ng-model="formData.department" 
                      required
                      ng-options="dept.id as dept.name for dept in departments">
                <option value="">Select Department</option>
              </select>
              <span class="error" ng-show="employeeForm.department.$error.required">Department is required</span>
            </div>
            <div class="form-group">
              <label for="emp-position">Position *</label>
              <input type="text" 
                     id="emp-position"
                     name="position" 
                     ng-model="formData.position" 
                     required
                     placeholder="e.g., Senior Developer">
              <span class="error" ng-show="employeeForm.position.$error.required">Position is required</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="emp-startDate">Start Date *</label>
              <input type="date" 
                     id="emp-startDate"
                     name="startDate" 
                     ng-model="formData.startDate" 
                     required>
              <span class="error" ng-show="employeeForm.startDate.$error.required">Start date is required</span>
            </div>
            <div class="form-group">
              <label for="emp-manager">Manager</label>
              <select id="emp-manager"
                      name="manager" 
                      ng-model="formData.manager"
                      ng-options="emp.id as emp.name for emp in employees">
                <option value="">Direct Report Only</option>
              </select>
            </div>
          </div>
        </fieldset>

        <!-- Salary Information -->
        <fieldset>
          <legend>Salary Information</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="emp-salary">Base Salary *</label>
              <input type="number" 
                     id="emp-salary"
                     name="salary" 
                     ng-model="formData.salary" 
                     required
                     min="0"
                     placeholder="0.00">
              <span class="error" ng-show="employeeForm.salary.$error.required">Salary is required</span>
              <span class="error" ng-show="employeeForm.salary.$error.min">Salary must be positive</span>
            </div>
            <div class="form-group">
              <label for="emp-bonus">Annual Bonus %</label>
              <input type="number" 
                     id="emp-bonus"
                     name="bonus" 
                     ng-model="formData.bonus"
                     min="0"
                     max="100"
                     placeholder="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="emp-currency">Currency</label>
              <select id="emp-currency" name="currency" ng-model="formData.currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div class="form-group">
              <label for="emp-payFrequency">Pay Frequency</label>
              <select id="emp-payFrequency" name="payFrequency" ng-model="formData.payFrequency">
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </fieldset>

        <!-- Status & Additional -->
        <fieldset>
          <legend>Status</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="emp-status">Employment Status *</label>
              <select id="emp-status"
                      name="status" 
                      ng-model="formData.status" 
                      required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div class="form-group checkbox-group">
              <label for="emp-remote">
                <input type="checkbox" 
                       id="emp-remote"
                       name="remote" 
                       ng-model="formData.remote">
                Remote Work
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" ng-disabled="employeeForm.$invalid || isSubmitting">
            <span ng-if="!isSubmitting">{{ editingEmployee ? 'Update Employee' : 'Add Employee' }}</span>
            <span ng-if="isSubmitting">Processing...</span>
          </button>
          <button type="button" class="btn btn-secondary" ng-click="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Tab 3: Departments -->
  <div class="tab-content" ng-if="activeTab === 'Departments'">
    <div class="section departments">
      <h2>Manage Departments</h2>

      <!-- Add Department Form -->
      <div class="add-department-form">
        <h3>Add New Department</h3>
        <form name="departmentForm" ng-submit="submitDepartmentForm()" class="form-row">
          <div class="form-group">
            <input type="text" 
                   name="deptName" 
                   ng-model="newDepartment.name" 
                   placeholder="Department name"
                   required>
          </div>
          <div class="form-group">
            <input type="text" 
                   name="deptHead" 
                   ng-model="newDepartment.head" 
                   placeholder="Department head">
          </div>
          <button type="submit" class="btn btn-small btn-primary">Add Department</button>
        </form>
      </div>

      <!-- Departments List -->
      <div class="departments-list">
        <div class="department-card" ng-repeat="dept in departments">
          <h3>{{ dept.name }}</h3>
          <p><strong>Head:</strong> {{ dept.head }}</p>
          <p><strong>Employees:</strong> {{ dept.employeeCount }}</p>
          <p><strong>Budget:</strong> \${{ dept.budget | number:2 }}</p>
          <div class="card-actions">
            <button class="btn-small edit" ng-click="editDepartment(dept)">Edit</button>
            <button class="btn-small delete" ng-click="deleteDepartment(dept.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab 4: Payroll -->
  <div class="tab-content" ng-if="activeTab === 'Payroll'">
    <div class="section payroll">
      <h2>Payroll Management</h2>

      <!-- Payroll Period Selector -->
      <div class="payroll-controls">
        <div class="form-group">
          <label for="payroll-month">Payroll Month:</label>
          <input type="month" 
                 id="payroll-month"
                 ng-model="payrollPeriod" 
                 ng-change="loadPayrollData()">
        </div>
        <button class="btn btn-primary" ng-click="generatePayroll()">Generate Payroll</button>
        <button class="btn btn-secondary" ng-click="exportPayroll()">Export to CSV</button>
      </div>

      <!-- Payroll Table -->
      <div class="table-wrapper">
        <table class="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="payroll in payrollData">
              <td>{{ payroll.employeeName }}</td>
              <td>{{ payroll.department }}</td>
              <td>\${{ payroll.baseSalary | number:2 }}</td>
              <td>\${{ payroll.bonus | number:2 }}</td>
              <td>\${{ payroll.deductions | number:2 }}</td>
              <td class="net-pay"><strong>\${{ payroll.netPay | number:2 }}</strong></td>
              <td><span class="badge" ng-class="'badge-' + payroll.status">{{ payroll.status }}</span></td>
              <td>
                <button class="btn-small" ng-click="viewPayrollDetails(payroll)">View</button>
                <button class="btn-small" ng-click="editPayroll(payroll)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payroll Summary -->
      <div class="payroll-summary">
        <h3>Payroll Summary</h3>
        <div class="summary-stats">
          <div class="stat">
            <span class="label">Total Base Salary:</span>
            <span class="value">\${{ payrollSummary.totalBaseSalary | number:2 }}</span>
          </div>
          <div class="stat">
            <span class="label">Total Bonuses:</span>
            <span class="value">\${{ payrollSummary.totalBonuses | number:2 }}</span>
          </div>
          <div class="stat">
            <span class="label">Total Deductions:</span>
            <span class="value">\${{ payrollSummary.totalDeductions | number:2 }}</span>
          </div>
          <div class="stat">
            <span class="label">Total Net Pay:</span>
            <span class="value highlight">\${{ payrollSummary.totalNetPay | number:2 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab 5: Performance Reviews -->
  <div class="tab-content" ng-if="activeTab === 'Performance Reviews'">
    <div class="section performance">
      <h2>Performance Reviews</h2>

      <!-- Review Filter -->
      <div class="review-filters">
        <select ng-model="reviewYearFilter" ng-change="filterReviews()" class="filter-select">
          <option value="">All Years</option>
          <option ng-repeat="year in availableYears" value="{{ year }}">{{ year }}</option>
        </select>
        <select ng-model="reviewStatusFilter" ng-change="filterReviews()" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      <!-- Performance Review Form -->
      <div class="review-form-section" ng-if="showReviewForm">
        <h3>{{ editingReview ? 'Edit' : 'Create' }} Performance Review</h3>
        <form name="reviewForm" ng-submit="submitReviewForm()" class="form-container">
          <div class="form-row">
            <div class="form-group">
              <label for="review-employee">Employee *</label>
              <select id="review-employee"
                      name="employee" 
                      ng-model="reviewFormData.employeeId" 
                      required
                      ng-options="emp.id as emp.name for emp in employees">
                <option value="">Select Employee</option>
              </select>
            </div>
            <div class="form-group">
              <label for="review-period">Review Period *</label>
              <input type="text" 
                     id="review-period"
                     name="period" 
                     ng-model="reviewFormData.period" 
                     placeholder="e.g., Q1 2024"
                     required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="review-rating">Overall Rating (1-5) *</label>
              <select id="review-rating"
                      name="rating" 
                      ng-model="reviewFormData.rating" 
                      required>
                <option value="">Select Rating</option>
                <option value="1">1 - Below Expectations</option>
                <option value="2">2 - Meets Some Expectations</option>
                <option value="3">3 - Meets Expectations</option>
                <option value="4">4 - Exceeds Expectations</option>
                <option value="5">5 - Far Exceeds Expectations</option>
              </select>
            </div>
            <div class="form-group">
              <label for="review-date">Review Date *</label>
              <input type="date" 
                     id="review-date"
                     name="date" 
                     ng-model="reviewFormData.date" 
                     required>
            </div>
          </div>

          <div class="form-group full-width">
            <label for="review-comments">Comments & Feedback</label>
            <textarea id="review-comments"
                      name="comments" 
                      ng-model="reviewFormData.comments" 
                      rows="4"
                      placeholder="Enter performance review comments..."></textarea>
          </div>

          <div class="form-group full-width">
            <label for="review-strengths">Key Strengths</label>
            <textarea id="review-strengths"
                      name="strengths" 
                      ng-model="reviewFormData.strengths" 
                      rows="3"
                      placeholder="List employee strengths..."></textarea>
          </div>

          <div class="form-group full-width">
            <label for="review-improvements">Areas for Improvement</label>
            <textarea id="review-improvements"
                      name="improvements" 
                      ng-model="reviewFormData.improvements" 
                      rows="3"
                      placeholder="List areas for improvement..."></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">{{ editingReview ? 'Update' : 'Submit' }} Review</button>
            <button type="button" class="btn btn-secondary" ng-click="cancelReview()">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        <button class="btn btn-primary" ng-click="showReviewForm = !showReviewForm">
          {{ showReviewForm ? 'Hide Form' : 'Create New Review' }}
        </button>
        
        <div class="review-card" ng-repeat="review in filteredReviews">
          <div class="review-header">
            <h3>{{ review.employeeName }}</h3>
            <span class="badge" ng-class="'badge-' + review.status">{{ review.status }}</span>
          </div>
          <p><strong>Period:</strong> {{ review.period }}</p>
          <p><strong>Rating:</strong> <span class="rating">{{ review.rating }}/5</span></p>
          <p><strong>Comments:</strong> {{ review.comments }}</p>
          <div class="card-actions">
            <button class="btn-small edit" ng-click="editReview(review)">Edit</button>
            <button class="btn-small delete" ng-click="deleteReview(review.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal-overlay" ng-if="showDeleteModal">
    <div class="modal">
      <h2>Confirm Delete</h2>
      <p>{{ deleteConfirmMessage }}</p>
      <div class="modal-actions">
        <button class="btn btn-danger" ng-click="confirmDeleteAction()">Delete</button>
        <button class="btn btn-secondary" ng-click="cancelDelete()">Cancel</button>
      </div>
    </div>
  </div>
</div>`;

fs.writeFileSync(
  path.join(componentDir, 'employee-management.html'),
  htmlContent
);
console.log('✓ Created employee-management.html');

console.log('\n✓ Component setup complete! Run "npm start" to launch the AngularJS project.');
