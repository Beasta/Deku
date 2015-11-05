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
    vm.activeUser = false;  // is user viewing his/her own profile?
    vm.addStatus = addStatus;
    vm.avatar = '';
    vm.deleteStatus = deleteStatus;
    vm.follow = follow;
    vm.followees = [];
    vm.followers = [];
    vm.getUsersForTag = getUsersForTag;
    vm.isFollowing = false;  // is active user following the user of this profile?
    vm.location = '';
    vm.photos = [];
    vm.recentThreads = {};
    vm.statuses = [];
    vm.tags = [];
    vm.tagModalData = [];
    vm.unfollow = unfollow;
    vm.username = $stateParams.username;

    checkActiveUser();
    getProfile();

    ///////////////////////
    /// SCOPE FUNCTIONS ///
    ///////////////////////

    // post status to database and clear form
    function addStatus() {
      var newStatus = vm.status;

      // reset form
      vm.statusUpdate.$setPristine();
      vm.status = '';

      vm.statuses.unshift({ status: newStatus });

      User.addStatus(newStatus, User.getID())
        .then(function(status) {
          vm.statuses[0] = status;
        })
        .catch(function(err) {
          vm.statuses.shift();
        });
    }

    // remove status from database
    function deleteStatus(statusID) {
      User.deleteStatus(statusID);

      for (var i = 0; i < vm.statuses.length; i++) {
        if (vm.statuses[i].id === statusID) {
          vm.statuses.splice(i, 1);
          break;
        }
      }
    }

    // make the active user a follower of this profile's user
    function follow() {
      User.follow(User.getID(), vm.username);
      vm.isFollowing = true;
    }

    function getUsersForTag(tagname) {
      User.getUsersForTag(tagname)
        .then(function (data) {
          vm.tagModalData = [];
          for (var i = 0; i < data.length; i++) {
            var userObj = {
              profile_photo: data[i].profile_photo,
              username: data[i].username,
              location: data[i].location
            };
            vm.tagModalData.push(userObj);
          }
        });
    }

    function unfollow() {
      User.unfollow(User.getID(), vm.username);
      vm.isFollowing = false;
    }

    ///////////////////////////
    /// NON-SCOPE FUNCTIONS ///
    ///////////////////////////

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
          getFolloweesStatuses();
          getFollowers();
          getRecentThreads();
          getAvatar();
          getPhotos();
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

    function getFollowers() {
      User.getFollowers(vm.username)
        .then(function(data) {
          for (var i = 0; i < data.length; i++) {
            vm.followers.push(data[i].username);

          }

          // check whether active user is following this user
          if (!vm.activeUser && (vm.followers.indexOf($window.localStorage.username) !== -1)) {
            vm.isFollowing = true;
          }
        });

      User.getFollowees(vm.username)
        .then(function(data) {
          for (var i = 0; i < data.length; i++) {
            vm.followees.push(data[i].username);
          }
        });
    }

    // store thread names for listing on page
    // make obj so thread id can be referenced from thread name
    function getRecentThreads() {
      User.getRecentThreads(vm.username)
        .then(function(threads) {
          vm.recentThreads = threads;

          // transform timestamp to readable format
          for (var i = 0; i < vm.recentThreads.length; i++) {
            vm.recentThreads[i].created_at = moment(vm.recentThreads[i].created_at).fromNow();
          }
        });
    }

    function getStatuses() {
      User.getStatuses(vm.username)
        .then(function(statuses) {
          vm.statuses = statuses;

          // transform timestamp to readable format
          for (var i = 0; i < vm.statuses.length; i++) {
            vm.statuses[i].timestamp = moment(vm.statuses[i].timestamp).fromNow();
          }
        });
    }

    function getFolloweesStatuses() {
      User.getFolloweesStatuses(User.getID())
        .then(function (statuses) {
          vm.followeesStatuses = statuses;

          // transform timestamp to readable format
          for (var i = 0; i < vm.followeesStatuses.length; i++) {
            vm.followeesStatuses[i].timestamp = moment(vm.followeesStatuses[i].timestamp).fromNow();
          }
        });
    }

    //Get current profile picture(avatar)
    function getAvatar () {
      User.getAvatar(vm.username)
        .then(function (avatar) {
          vm.avatar = avatar[0].profile_photo;
        });
    }

    //Get users greenhouse photos from the server
    function getPhotos () {
      User.getPhotos(vm.username)
        .then(function (data) {
          vm.photos = [];
          for (var i = 0; i < data.length; i++) {
            vm.photos.push(data[i]);
          }
        });
    }
  }
})();
