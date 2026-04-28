(function registerLogoutController() {
  'use strict';

  angular.module('gawsLegacy').controller('LogoutController', [
    '$location',
    'AuthService',
    function LogoutController($location, AuthService) {
      var vm = this;

      vm.message = 'Ending your session.';
      AuthService.logout();
      $location.path('/login');
    }
  ]);
})();
