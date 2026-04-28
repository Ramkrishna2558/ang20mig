(function registerLoginController() {
  'use strict';

  angular.module('gawsLegacy').controller('LoginController', [
    '$location',
    'AuthService',
    function LoginController($location, AuthService) {
      var vm = this;

      vm.credentials = {
        username: '',
        password: ''
      };
      vm.error = '';

      vm.login = function login() {
        vm.error = '';

        if (!vm.credentials.username || !vm.credentials.password) {
          vm.error = 'Enter user name and password.';
          return;
        }

        AuthService.login(vm.credentials).then(function onSuccess() {
          $location.path('/home');
        });
      };
    }
  ]);
})();
