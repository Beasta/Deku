//This is where we will put our http req handling functions for 
//for 'api/users' calls. Our functions here will make calls to 
//functions inside our model files, which in turn make the desired
//db queries.

var Thread = require('../models/threadModel.js');


module.exports = {
  //Put all http req handling functions here

  //Get all threads
  getAllThreads: function (req, res) {
    Thread.getAllThreads(function (err, threads) {
      if (err) {
        //do some error handing
        res.status(404).send();
      } else {
        res.status(200).json(threads);
      }
    })
  },

  //Get all messages from one thread
  getThread: function (req, res) {
    var id = req.params.id;
    Thread.getThread(id, function (err, threadMessages) {
      if (err) {
        //Error handling
        res.status(404).send();
      } else {
        res.status(200).json(threadMessages);
      }
    })
  },

  //write a new message to a particular thread
  postToThread: function (req, res) {
    var id = req.params.id;
    Thread.postToThread(id, function (err, newMessage) {
      if (err) {
        //Error handling
        res.status(404).send();
      } else {
        res.status(200).json(newMessage);
      }
    })
  }
}