 var threadController = require('../controllers/threadController.js');


module.exports = function (app) {
  //app === userRouter injected from middlware.js

  //Route for getting all threads
  app.get('/:userID/:page', threadController.getThreadsByPage);

  // get all the messages for a page of a thread
  app.get('/messages/:userID/:threadID/:page', threadController.getMessagesByPage);

  //Route for posting a message to a particular thread
  app.post('/:userID/:threadID', threadController.addMessageToThread);

  // Get recent messages posted to the forum for a user
  app.get('/recent/:username', threadController.getRecentForumActivity);

  // get recent messages posted to forums by people the user is following
  app.get('/recent/followees/:userID', threadController.getRecentFolloweeActivity);

  // Create thread
  app.post('/:userID', threadController.addThread);

  // Pass in the thread ID to be deleted
  app.delete('/:threadID', threadController.deleteThread);

  // Delete message from a thread
  app.delete('/messages/:messageID', threadController.deleteMessage);

  // Voting
  app.post('/vote/:userID/:threadID', threadController.likeThread);

  app.delete('/vote/:userID/:threadID', threadController.unlikeThread);

  app.post('/vote/message/:userID/:messageID/:threadID', threadController.likeMessage);

  app.delete('/vote/message/:userID/:messageID/:threadID', threadController.unlikeMessage);
}