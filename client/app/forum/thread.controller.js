(function() {
  'use strict';

  angular.module('app')
    .controller('ThreadController', ThreadController);

  ThreadController.$inject = ['$state', '$stateParams', 'User', 'Forum'];

  function ThreadController($state, $stateParams, User, Forum) {
    // capture variable for binding members to controller; vm stands for ViewModel
    // (https://github.com/johnpapa/angular-styleguide#controlleras-with-vm)
    var vm = this;

    vm.messages = [];
    vm.newMessage = '';
    vm.thread = {};
    vm.page = $stateParams.page;
    vm.pageSize = 20;
    vm.total = 100000;

    //user action methods
    vm.changePage = changePage;
    vm.navToUser = navToUser;
    vm.postToThread = postToThread;
    vm.likeMessage = likeMessage;

    getMessages();

    function changePage(page) {
      $state.transitionTo('thread', { threadID: vm.messages[0].thread_id, page: page });
    }

    function navToUser (username) {
      $state.transitionTo('profile', { username : username });
    }

    function getMessages () {
      Forum.getMessages(User.getID(), $stateParams.threadID, $stateParams.page)
        .then(function(data) {
          vm.messages = [];

          var uservotes = {};
          for (i = 0; i < data.uservotes.length; i++) {
            uservotes[data.uservotes[i].id] = true;
          }

          for (var i = 0; i < data.messages.length; i++) {
            vm.messages.push(data.messages[i])
            vm.messages[i].created_at = moment(vm.messages[i].created_at).fromNow();

            if (uservotes[vm.messages[i].id]) {
              vm.messages[i].votedFor = true;
            } else {
              vm.messages[i].votedFor = false;
            }
          }
          vm.thread = data.thread;
          vm.thread.last_updated = moment(vm.thread.last_updated).fromNow();
          vm.total = data.count;
        });
    }

    function postToThread () {
      Forum.postToThread(User.getID(), vm.thread.id, vm.newMessage)
        .then(function(data) {
          vm.newMessage = '';
          getMessages();
        });
    }

    function likeMessage(messageID, index) {
      Forum.likeMessage(User.getID(), messageID, vm.thread.id)
      .then(function (status) {
        if (status === 201) {
          vm.messages[index].vote_tally++;
          vm.messages[index].votedFor = true;
        }
      })
    }

  }
})();
