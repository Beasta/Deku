//This is where we will put our http req handling functions for 
//for 'api/users' calls. Our functions here will make calls to 
//functions inside our model files, which in turn make the desired
//db queries.

var Thread = require('../models/threadModel.js');


module.exports = {
  //Put all http req handling functions here

  //Get all threads
  getThreadsByPage: function (req, res) {
    Thread.getThreadsByPage(function (err, threads) {
      if (err) {
        //do some error handing
        res.status(500).end();
      } else {
        res.status(200).json(threads);
      }
    })
  },

  getMessagesByPage: function (req, res) {
    Thread.getMessagesByPage(req.params.threadID, req.params.page, function (err, messages) {
      if (err) {
        console.error(err);
        res.status(500).end();
      } else {
        res.status(200).json(messages);
      }
    });
  },

  // write a new message to a particular thread
  // update lastupdated column of that thread
  addMessageToThread: function (req, res) {
    var id = req.params.id;
    Thread.addMessageToThread(id, function (err, newMessage) {
      if (err) {
        //Error handling
        res.status(500).end();
      } else {
        // update time in thread table
        Thread.updateTime(id, function (err, result) {
          if (err) {
            res.status(500).end();
          } else {
            res.status(201).send(result);
          }
        })
      }
    });
  },

  deleteThread: function (req, res) {
    Thread.deleteThread(req.params.id, function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).end();
      } else {
        res.status(204).end();
      }
    });
  }


}