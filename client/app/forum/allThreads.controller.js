(function() {
  'use strict';

  angular.module('app')
    .controller('AllThreadsController', AllThreadsController);

  AllThreadsController.$inject = ['$state', '$stateParams', 'User', 'Forum'];

  function AllThreadsController($state, $stateParams, User, Forum) {
    // capture variable for binding members to controller; vm stands for ViewModel
    // (https://github.com/johnpapa/angular-styleguide#controlleras-with-vm)
    var vm = this;

    vm.changePage = changePage;
    vm.createThread = createThread;
    vm.page = $stateParams.page; // current page
    vm.pageSize = 20; // number of threads displayed per page
    vm.newThread = '';
    vm.threads = [];
    /*
    *  vm.total is set artificially high to prevent angular-materialize from
    *  changing vm.page to 1 for being less than the page count.
    *  It will be set correctly upon the return of getThreads AJAX call.
    */
    vm.total = 1e9; // total number of threads
    vm.upvote = upvote;

    getThreads(vm.page);

    function changePage(page) {
      $state.transitionTo('allThreads', { page: page });
    }

    function createThread() {
      Forum.createThread(User.getID(), vm.newThread)
        .then(function(thread) {
          $state.transitionTo('thread', { threadID: thread.id, page: 1 });
        });
    }

    function getThreads(page) {
      Forum.getThreads(page)
        .then(function(data) {
          vm.threads = data.threads;
          vm.total = data.count;

          for (var i = 0; i < vm.threads.length; i++) {
            vm.threads[i].created_at = moment(vm.threads[i].created_at).fromNow();
            vm.threads[i].last_updated = moment(vm.threads[i].last_updated).fromNow();
          }
        });
    }

    function upvote(threadID) {
      // Forum.upvoteThread(User.getID(), threadID);
    }
  }
})();
