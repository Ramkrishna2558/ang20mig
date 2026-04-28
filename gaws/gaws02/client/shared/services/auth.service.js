(function registerAuthService() {
  'use strict';

  angular.module('gawsLegacy').factory('AuthService', [
    '$q',
    function AuthService($q) {
      var user = {
        displayName: 'Migration Tester',
        email: 'tester@gaws.local',
        role: 'Operations Analyst'
      };

      return {
        login: function login() {
          return $q.resolve(user);
        },
        logout: function logout() {
          return true;
        },
        currentUser: function currentUser() {
          return user;
        },
        changePassword: function changePassword() {
          return $q.resolve({ changed: true });
        }
      };
    }
  ]);
})();
