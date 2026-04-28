(function registerChangePasswordController() {
  'use strict';

  angular.module('gawsLegacy').controller('ChangePasswordController', [
    'AuthService',
    function ChangePasswordController(AuthService) {
      var vm = this;

      vm.form = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      vm.message = '';

      vm.changePassword = function changePassword() {
        if (vm.form.newPassword !== vm.form.confirmPassword) {
          vm.message = 'New password and confirmation must match.';
          return;
        }

        AuthService.changePassword(vm.form).then(function onChanged() {
          vm.message = 'Password updated.';
        });
      };
    }
  ]);
})();
