(function() {
  'use strict';

  angular.module('app')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$window', '$state', 'User'];

  function NavbarController($window, $state, User) {
    // capture variable for binding members to controller; vm stands for ViewModel
    // (https://github.com/johnpapa/angular-styleguide#controlleras-with-vm)
    var vm = this;

    vm.getActiveProfile = getActiveProfile;
    vm.notifications = ['Beasta is now following you',
                        'shadedprofit is now following you'];
    vm.signout = signout;
    vm.username = $window.localStorage.username;

    // options for notification dropdown
    angular.element('.dropdown-button').dropdown({
      constrain_width: false,
      hover: true,
      belowOrigin: true
    });

    // on mobile-sized screen, make the nav bar appear on menu icon click
    angular.element('.button-collapse').sideNav({
      menuWidth: 200,
      edge: 'right',
      closeOnClick: true
    });

    getNotifications();

    function getActiveProfile() {
      $state.transitionTo('profile', { username: $window.localStorage.username });
    }

    function getNotifications() {
      // User.getNotifications();
      // vm.showNotifications = vm.notifications.length;
    }

    function signout() {
      User.signout();
    }
  }
})();
