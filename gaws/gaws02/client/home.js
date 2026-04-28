(function registerHomeController() {
  'use strict';

  angular.module('gawsLegacy').controller('HomeController', [
    'AuthService',
    function HomeController(AuthService) {
      var vm = this;

      vm.user = AuthService.currentUser();
      vm.summary = 'This legacy AngularJS page is the baseline for migration testing.';
    }
  ]);
})();
