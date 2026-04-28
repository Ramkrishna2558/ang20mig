(function registerEmployeeManagement() {
  'use strict';

  angular.module('gawsLegacy').controller('EmployeeManagementCtrl', [
    '$scope',
    '$http',
    '$timeout',
    EmployeeManagementCtrl
  ]);

  function EmployeeManagementCtrl($scope, $http, $timeout) {
    // Initialize
    $scope.tabs = [
      'Employee Directory',
      'Add/Edit Employee',
      'Departments',
      'Payroll',
      'Performance Reviews'
    ];
    $scope.activeTab = 'Employee Directory';
    $scope.alerts = [];
    $scope.isSubmitting = false;

    // Employee Data
    $scope.employees = [];
    $scope.filteredEmployees = [];
    $scope.departments = [];
    $scope.payrollData = [];
    $scope.payrollSummary = {};

    // Form Data
    $scope.formData = {};
    $scope.newDepartment = {};
    $scope.reviewFormData = {};
    $scope.showDeleteModal = false;
    $scope.showReviewForm = false;
    $scope.editingEmployee = null;
    $scope.editingReview = null;

    // Pagination
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.totalPages = 1;

    // Sorting
    $scope.sortField = 'name';

    // Filtering
    $scope.employeeSearch = '';
    $scope.departmentFilter = '';
    $scope.statusFilter = '';
    $scope.reviewYearFilter = '';
    $scope.reviewStatusFilter = '';
    $scope.availableYears = [2024, 2023, 2022];
    $scope.filteredReviews = [];

    // API Endpoints
    const API_BASE = '/api';
    const ENDPOINTS = {
      employees: API_BASE + '/employees',
      departments: API_BASE + '/departments',
      payroll: API_BASE + '/payroll',
      reviews: API_BASE + '/reviews'
    };

    // Initialize data
    $scope.init = function() {
      $scope.loadEmployees();
      $scope.loadDepartments();
      $scope.loadPayrollData();
      $scope.loadReviews();
    };

    // === EMPLOYEE MANAGEMENT ===

    $scope.loadEmployees = function() {
      $http.get(ENDPOINTS.employees)
        .then(function(response) {
          $scope.employees = response.data;
          $scope.filterEmployees();
          $scope.addAlert('Employees loaded successfully', 'success');
        })
        .catch(function(error) {
          console.error('Error loading employees:', error);
          $scope.addAlert('Failed to load employees', 'error');
          // Mock data for demo
          $scope.employees = [
            {
              id: 'EMP001',
              name: 'John Smith',
              email: 'john.smith@company.com',
              phone: '(555) 123-4567',
              dob: '1985-05-15',
              gender: 'male',
              department: 'IT',
              position: 'Senior Developer',
              startDate: '2020-01-15',
              salary: 95000,
              bonus: 15,
              currency: 'USD',
              payFrequency: 'monthly',
              status: 'active',
              remote: true,
              manager: null
            },
            {
              id: 'EMP002',
              name: 'Sarah Johnson',
              email: 'sarah.johnson@company.com',
              phone: '(555) 234-5678',
              dob: '1990-08-22',
              gender: 'female',
              department: 'HR',
              position: 'HR Manager',
              startDate: '2019-03-10',
              salary: 75000,
              bonus: 10,
              currency: 'USD',
              payFrequency: 'monthly',
              status: 'active',
              remote: false,
              manager: null
            },
            {
              id: 'EMP003',
              name: 'Michael Chen',
              email: 'michael.chen@company.com',
              phone: '(555) 345-6789',
              dob: '1988-11-30',
              gender: 'male',
              department: 'IT',
              position: 'DevOps Engineer',
              startDate: '2021-06-01',
              salary: 85000,
              bonus: 12,
              currency: 'USD',
              payFrequency: 'monthly',
              status: 'active',
              remote: true,
              manager: 'EMP001'
            }
          ];
          $scope.filterEmployees();
        });
    };

    $scope.filterEmployees = function() {
      let filtered = $scope.employees;

      // Search filter
      if ($scope.employeeSearch) {
        const search = $scope.employeeSearch.toLowerCase();
        filtered = filtered.filter(function(emp) {
          return emp.name.toLowerCase().includes(search) ||
                 emp.id.toLowerCase().includes(search) ||
                 emp.email.toLowerCase().includes(search);
        });
      }

      // Department filter
      if ($scope.departmentFilter) {
        filtered = filtered.filter(function(emp) {
          return emp.department === $scope.departmentFilter;
        });
      }

      // Status filter
      if ($scope.statusFilter) {
        filtered = filtered.filter(function(emp) {
          return emp.status === $scope.statusFilter;
        });
      }

      // Calculate pagination
      $scope.totalPages = Math.ceil(filtered.length / $scope.itemsPerPage);
      $scope.currentPage = Math.max(1, Math.min($scope.currentPage, $scope.totalPages));

      // Apply pagination
      const start = ($scope.currentPage - 1) * $scope.itemsPerPage;
      $scope.filteredEmployees = filtered.slice(start, start + $scope.itemsPerPage);
    };

    $scope.sortBy = function(field) {
      $scope.sortField = field;
      $scope.filterEmployees();
    };

    $scope.previousPage = function() {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.filterEmployees();
      }
    };

    $scope.nextPage = function() {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.filterEmployees();
      }
    };

    $scope.editEmployee = function(employee) {
      $scope.editingEmployee = employee;
      $scope.formData = angular.copy(employee);
      $scope.switchTab('Add/Edit Employee');
    };

    $scope.cancelEdit = function() {
      $scope.editingEmployee = null;
      $scope.formData = {};
      $scope.switchTab('Employee Directory');
    };

    $scope.submitEmployeeForm = function() {
      if (!$scope.employeeForm.$valid) {
        $scope.addAlert('Please fill all required fields', 'error');
        return;
      }

      $scope.isSubmitting = true;

      const endpoint = $scope.editingEmployee
        ? ENDPOINTS.employees + '/' + $scope.editingEmployee.id
        : ENDPOINTS.employees;

      const method = $scope.editingEmployee ? 'PUT' : 'POST';

      $http({
        method: method,
        url: endpoint,
        data: $scope.formData
      })
        .then(function(response) {
          const message = $scope.editingEmployee
            ? 'Employee updated successfully'
            : 'Employee added successfully';
          $scope.addAlert(message, 'success');
          $scope.loadEmployees();
          $scope.cancelEdit();
        })
        .catch(function(error) {
          console.error('Error saving employee:', error);
          $scope.addAlert('Failed to save employee', 'error');
        })
        .finally(function() {
          $scope.isSubmitting = false;
        });
    };

    $scope.confirmDelete = function(employeeId) {
      $scope.showDeleteModal = true;
      $scope.deleteConfirmMessage = 'Are you sure you want to delete this employee?';
      $scope.pendingDeleteId = employeeId;
    };

    $scope.confirmDeleteAction = function() {
      $http.delete(ENDPOINTS.employees + '/' + $scope.pendingDeleteId)
        .then(function() {
          $scope.addAlert('Employee deleted successfully', 'success');
          $scope.loadEmployees();
        })
        .catch(function(error) {
          console.error('Error deleting employee:', error);
          $scope.addAlert('Failed to delete employee', 'error');
        })
        .finally(function() {
          $scope.showDeleteModal = false;
        });
    };

    $scope.cancelDelete = function() {
      $scope.showDeleteModal = false;
      $scope.pendingDeleteId = null;
    };

    // === DEPARTMENT MANAGEMENT ===

    $scope.loadDepartments = function() {
      $http.get(ENDPOINTS.departments)
        .then(function(response) {
          $scope.departments = response.data;
        })
        .catch(function(error) {
          console.error('Error loading departments:', error);
          // Mock data
          $scope.departments = [
            { id: 'IT', name: 'Information Technology', head: 'John Smith', employeeCount: 15, budget: 500000 },
            { id: 'HR', name: 'Human Resources', head: 'Sarah Johnson', employeeCount: 8, budget: 200000 },
            { id: 'FIN', name: 'Finance', head: 'Robert Brown', employeeCount: 10, budget: 300000 }
          ];
        });
    };

    $scope.submitDepartmentForm = function() {
      if (!$scope.departmentForm.$valid || !$scope.newDepartment.name) {
        $scope.addAlert('Please enter a department name', 'error');
        return;
      }

      $http.post(ENDPOINTS.departments, $scope.newDepartment)
        .then(function(response) {
          $scope.addAlert('Department added successfully', 'success');
          $scope.loadDepartments();
          $scope.newDepartment = {};
        })
        .catch(function(error) {
          console.error('Error adding department:', error);
          $scope.addAlert('Failed to add department', 'error');
        });
    };

    $scope.editDepartment = function(dept) {
      $scope.addAlert('Edit functionality coming soon', 'info');
    };

    $scope.deleteDepartment = function(deptId) {
      $http.delete(ENDPOINTS.departments + '/' + deptId)
        .then(function() {
          $scope.addAlert('Department deleted successfully', 'success');
          $scope.loadDepartments();
        })
        .catch(function(error) {
          console.error('Error deleting department:', error);
          $scope.addAlert('Failed to delete department', 'error');
        });
    };

    // === PAYROLL MANAGEMENT ===

    $scope.loadPayrollData = function() {
      const month = $scope.payrollPeriod || new Date().toISOString().slice(0, 7);

      $http.get(ENDPOINTS.payroll + '?month=' + month)
        .then(function(response) {
          $scope.payrollData = response.data;
          $scope.calculatePayrollSummary();
        })
        .catch(function(error) {
          console.error('Error loading payroll:', error);
          // Mock data
          $scope.payrollData = $scope.employees.map(function(emp) {
            return {
              employeeId: emp.id,
              employeeName: emp.name,
              department: emp.department,
              baseSalary: emp.salary,
              bonus: emp.salary * (emp.bonus / 100),
              deductions: emp.salary * 0.15,
              netPay: emp.salary + (emp.salary * (emp.bonus / 100)) - (emp.salary * 0.15),
              status: 'pending'
            };
          });
          $scope.calculatePayrollSummary();
        });
    };

    $scope.calculatePayrollSummary = function() {
      $scope.payrollSummary = {
        totalBaseSalary: 0,
        totalBonuses: 0,
        totalDeductions: 0,
        totalNetPay: 0
      };

      $scope.payrollData.forEach(function(payroll) {
        $scope.payrollSummary.totalBaseSalary += payroll.baseSalary;
        $scope.payrollSummary.totalBonuses += payroll.bonus;
        $scope.payrollSummary.totalDeductions += payroll.deductions;
        $scope.payrollSummary.totalNetPay += payroll.netPay;
      });
    };

    $scope.generatePayroll = function() {
      $scope.addAlert('Generating payroll...', 'info');
      $timeout(function() {
        $scope.addAlert('Payroll generated successfully', 'success');
        $scope.loadPayrollData();
      }, 2000);
    };

    $scope.exportPayroll = function() {
      $scope.addAlert('Exporting payroll to CSV...', 'info');
    };

    $scope.viewPayrollDetails = function(payroll) {
      $scope.addAlert('Viewing details for ' + payroll.employeeName, 'info');
    };

    $scope.editPayroll = function(payroll) {
      $scope.addAlert('Edit functionality coming soon', 'info');
    };

    // === PERFORMANCE REVIEWS ===

    $scope.loadReviews = function() {
      $http.get(ENDPOINTS.reviews)
        .then(function(response) {
          $scope.reviews = response.data;
          $scope.filterReviews();
        })
        .catch(function(error) {
          console.error('Error loading reviews:', error);
          // Mock data
          $scope.reviews = [
            {
              id: 'REV001',
              employeeId: 'EMP001',
              employeeName: 'John Smith',
              period: 'Q1 2024',
              rating: 4,
              date: '2024-03-15',
              comments: 'Excellent performance, great leadership',
              strengths: 'Technical expertise, mentoring skills',
              improvements: 'Work-life balance',
              status: 'completed'
            },
            {
              id: 'REV002',
              employeeId: 'EMP002',
              employeeName: 'Sarah Johnson',
              period: 'Q1 2024',
              rating: 5,
              date: '2024-03-10',
              comments: 'Outstanding HR management',
              strengths: 'Employee relations, strategic planning',
              improvements: 'None identified',
              status: 'completed'
            }
          ];
          $scope.filterReviews();
        });
    };

    $scope.filterReviews = function() {
      let filtered = $scope.reviews || [];

      if ($scope.reviewYearFilter) {
        filtered = filtered.filter(function(review) {
          return review.date.includes($scope.reviewYearFilter);
        });
      }

      if ($scope.reviewStatusFilter) {
        filtered = filtered.filter(function(review) {
          return review.status === $scope.reviewStatusFilter;
        });
      }

      $scope.filteredReviews = filtered;
    };

    $scope.submitReviewForm = function() {
      if (!$scope.reviewForm.$valid) {
        $scope.addAlert('Please fill all required fields', 'error');
        return;
      }

      const endpoint = $scope.editingReview
        ? ENDPOINTS.reviews + '/' + $scope.editingReview.id
        : ENDPOINTS.reviews;

      const method = $scope.editingReview ? 'PUT' : 'POST';

      $http({
        method: method,
        url: endpoint,
        data: $scope.reviewFormData
      })
        .then(function(response) {
          $scope.addAlert('Review saved successfully', 'success');
          $scope.loadReviews();
          $scope.cancelReview();
        })
        .catch(function(error) {
          console.error('Error saving review:', error);
          $scope.addAlert('Failed to save review', 'error');
        });
    };

    $scope.editReview = function(review) {
      $scope.editingReview = review;
      $scope.reviewFormData = angular.copy(review);
      $scope.showReviewForm = true;
    };

    $scope.cancelReview = function() {
      $scope.editingReview = null;
      $scope.reviewFormData = {};
      $scope.showReviewForm = false;
    };

    $scope.deleteReview = function(reviewId) {
      $http.delete(ENDPOINTS.reviews + '/' + reviewId)
        .then(function() {
          $scope.addAlert('Review deleted successfully', 'success');
          $scope.loadReviews();
        })
        .catch(function(error) {
          console.error('Error deleting review:', error);
          $scope.addAlert('Failed to delete review', 'error');
        });
    };

    // === UTILITY FUNCTIONS ===

    $scope.switchTab = function(tabName) {
      $scope.activeTab = tabName;
    };

    $scope.addAlert = function(message, type) {
      $scope.alerts.push({ message: message, type: type });
      // Auto-remove alert after 5 seconds
      $timeout(function() {
        $scope.removeAlert(0);
      }, 5000);
    };

    $scope.removeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    // Initialize on load
    $scope.init();
  }
})();
