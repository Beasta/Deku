(function() {
  'use strict';

  angular.module('app')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$window', '$state', 'User'];

  function EditProfileController($window, $state, User) {
    // capture variable for binding members to controller; vm stands for ViewModel
    // (https://github.com/johnpapa/angular-styleguide#controlleras-with-vm)
    var vm = this;

    //View model properties
    vm.about = '';
    vm.avatar = '';
    vm.followers = [];
    vm.followees = [];
    vm.location = '';
    vm.tags = [];
    vm.username = $window.localStorage.username;
    vm.photoPath = '';
    vm.avatarPath = '';
    vm.photos = [];
    vm.currentPhotos = [];
    vm.photoIndex = 0;
    vm.morePhotos = true;
    vm.lessPhotos = false;

    //editProfile user actions
    vm.updateProfile = updateProfile;
    vm.addTag = addTag;
    vm.removeTag = removeTag;
    vm.unfollow = unfollow;
    vm.addAvatarPath = addAvatarPath;
    vm.addPhotoByPath = addPhotoByPath;
    vm.addPhotoByUpload = addPhotoByUpload;
    vm.deletePhoto = deletePhoto;
    vm.getNextPhoto = getNextPhoto;
    vm.getPrevPhoto = getPrevPhoto;

    //Populate profile assets
    getProfile();
    getTags();
    getFollowers();
    getAvatar();
    getPhotos();

    ////////////////////////////
    /////PROFILE INFO///////////
    ////////////////////////////

    function getProfile () {
      User.getProfile(vm.username)
        .then(function(data) {
          vm.about = data.about;
          vm.location = data.location;
        });
    }

    function updateProfile () {
      User.updateProfile(vm, User.getID())
        .then(function(data) {
          $state.transitionTo('profile', {username : vm.username});
        })
        .catch(function(status) {
          vm.message = 'Bad things';
        });
    }

    ////////////////////////////
    /////FOLLOWER ACTIONS///////
    ////////////////////////////

    function getFollowers() {
      User.getFollowers(vm.username)
        .then(function(data) {
          vm.followers = [];
          for (var i = 0; i < data.length; i++) {
            vm.followers.push(data[i].username);
          }
        });

      User.getFollowees(vm.username)
        .then(function(data) {
          vm.followees = [];
          for (var i = 0; i < data.length; i++) {
            vm.followees.push(data[i].username);
          }
        });
    }

    function unfollow (followee) {
      User.unfollow(User.getID(), followee)
        .then(function (data) {
          getFollowers();
        });
    }

    ////////////////////////////
    //////TAG ACTIONS///////////
    ////////////////////////////

    function getTags () {
      User.getTags(vm.username)
        .then(function (data) {
          vm.tags = data;
        });
    }

    function addTag () {
      User.addTag(vm.newTag, User.getID())
        .then(function successCallback(res) {
          getTags();
        });
      vm.newTag='';
    }

    function removeTag (tag) {
      User.removeTag(tag.id, User.getID())
        .then(function(data) {
          getTags();
        });
    }

    ////////////////////////////
    //////PHOTO ACTIONS/////////
    ////////////////////////////

    function getAvatar () {
      User.getAvatar(vm.username)
        .then(function (avatar) {
          vm.avatar = avatar[0].profile_photo;
        });
    }

    function addAvatarPath () {
      User.addAvatarPath(User.getID(), vm.avatarPath)
        .then(function(data) {
          getAvatar();
        });
    }

    function getPhotos () {
      User.getPhotos(vm.username)
        .then(function (data) {
          vm.photos = data;

          if (vm.photos.length < 2) {
            vm.lessPhotos = false;
            vm.morePhotos = false;
          }

          vm.currentPhotos = vm.photos.slice(0, 2);
        });
    }

    function deletePhoto (photoID) {
      User.deletePhoto(User.getID(), photoID)
        .then(function (data) {
          getPhotos();
        });
    }

    function addPhotoByPath () {
      User.addPhotoByPath(User.getID(), vm.photoPath)
        .then(function (data) {
          getPhotos();
        });
    }

    function addPhotoByUpload (file) {
      User.addPhotoByUpload(User.getID(), file)
        .then(function (data) {
          getPhotos();
        });
    }

    function getNextPhoto () {
      vm.photoIndex = vm.photoIndex + 1;
      if (vm.photoIndex === vm.photos.length - 1) {
        vm.currentPhotos = [vm.photos[vm.photoIndex]];
        vm.morePhotos = false;
      } else {
        vm.currentPhotos = vm.photos.slice(vm.photoIndex, vm.photoIndex + 2);
      }
      vm.lessPhotos = true;
    }

    function getPrevPhoto () {
      vm.photoIndex = vm.photoIndex - 1;
      vm.currentPhotos = vm.photos.slice(vm.photoIndex, vm.photoIndex + 2);
      if (vm.photoIndex === 0) {
        vm.lessPhotos = false;
      }
      vm.morePhotos = true;
    }

    
  }
})();