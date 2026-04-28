(function registerProfileCard() {
  'use strict';

  angular.module('gawsLegacy').component('profileCard', {
    bindings: {
      user: '<'
    },
    templateUrl: 'components/profile-card/profile-card.html'
  });
})();
