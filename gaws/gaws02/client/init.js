(function initLegacyApp() {
  'use strict';

  angular
    .module('gawsLegacy', ['ngRoute'])
    .config([
      '$routeProvider',
      function configureRoutes($routeProvider) {
        $routeProvider
          .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
          })
          .when('/home', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
          })
          .when('/change-password', {
            templateUrl: 'change-password.html',
            controller: 'ChangePasswordController',
            controllerAs: 'vm'
          })
          .when('/logout', {
            templateUrl: 'logout.html',
            controller: 'LogoutController',
            controllerAs: 'vm'
          })
          .when('/employee-management', {
            templateUrl: 'components/employee-management/employee-management.html',
            controller: 'EmployeeManagementCtrl'
          })
          .otherwise({ redirectTo: '/login' });
      }
    ]);
})();
