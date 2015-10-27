(function() {
  'use strict';

  angular.module('app')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$stateParams', '$window', 'jwtHelper', 'User'];

  function ProfileController($stateParams, $window, jwtHelper, User) {
    // capture variable for binding members to controller; vm stands for ViewModel
    // (https://github.com/johnpapa/angular-styleguide#controlleras-with-vm)
    var vm = this;

    vm.about = '';
    vm.activeUser = false;
    vm.addStatus = addStatus;
    vm.avatar = '';
    vm.deleteStatus = deleteStatus;
    vm.follow = follow;
    vm.followees = [];
    vm.followers = [];
    vm.location = '';
    vm.recentThreadNames = [];
    vm.recentThreads = {};
    vm.statuses = [];
    vm.tags = [];
    vm.username = $stateParams.username;

    checkActiveUser();
    getProfile();

    // link statuses to IDs to aid in deletion
    var statusObj = {};

    // post status to database and clear form
    function addStatus() {
      var newStatus = vm.status;

      // reset form
      vm.statusUpdate.$setPristine();
      vm.status = '';

      vm.statuses.unshift(newStatus);

      User.addStatus(newStatus, getID())
        .then(function(status) {
          // add new status and ID to status object
          statusObj[newStatus] = status.id;
        });
    }

    // remove status from database
    function deleteStatus(status) {
      // call delete with status ID
      User.deleteStatus(statusObj[status]);
      vm.statuses.splice(vm.statuses.indexOf(status), 1);
    }

    // make the active user a follower of this profile's user
    function follow() {
      User.follow(getID(), vm.username);
    }

    // return active user's ID
    function getID() {
      return jwtHelper.decodeToken($window.localStorage.token).id;
    }

    // return true if the active user is viewing his/her own profile
    function checkActiveUser() {
      // checking token is more secure than checking localStorage.username
      var user = jwtHelper.decodeToken($window.localStorage.token).username;
      vm.activeUser = user === $stateParams.username;
    }

    function getProfile() {
      User.getProfile(vm.username)
        .then(function(data) {
          vm.about = data.about || 'Talk a little about yourself...';
          vm.location = data.location || 'Where are you?';
          getTags();
          getStatuses();
          getFollowers();
          // getRecentThreads();
          // getAvatar();
        });
    }

    function getTags() {
      User.getTags(vm.username)
        .then(function(tags) {
          if (tags.length === 0) {
            vm.tags = ['Plants?', 'Methods/Technologies?', 'Interests?', 'Put them here.'];
          } else {
            for (var i = 0; i < tags.length; i++) {
              vm.tags.push(tags[i].tag);
            }
          }
        });
    }

    function getStatuses() {
      User.getStatuses(vm.username)
        .then(function(statuses) {
          vm.statuses = [];
          for (var i = 0; i < statuses.length; i++) {
            vm.statuses.push(statuses[i].status);
            statusObj[statuses[i].status] = statuses[i].id;
          }
        });
    }

    function getFollowers() {
      User.getFollowers(vm.username)
        .then(function(data) {
          vm.followers = data.followers;
        });

      User.getFollowees(vm.username)
        .then(function(data) {
          vm.followees = data.followees;
        });
    }

    // store thread names for listing on page
    // make obj so thread id can be referenced from thread name
    function getRecentThreads() {
      User.getRecentThreads(vm.username)
        .then(function(data) {
          for (var i = 0; i < data.length; i++) {
            vm.recentThreadNames.push(data[i].thread);
            vm.recentThreads[data[i].thread] = data[i].id;
          }
        });
    }

    // this may change
    function getAvatar() {
      User.getAvatar(vm.username)
        .then(function(avatar) {
          vm.avatar = avatar;
        });
    }
  }
})();
