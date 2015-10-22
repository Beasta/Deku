//This is where we will put our http req handling functions for 
//for 'api/users' calls. Our functions here will make calls to 
//functions inside our model files, which in turn make the desired
//db queries.

var User = require('../models/userModel');
var bcrypt = require('bcrypt-nodejs');


module.exports = {
  //Put all http req handling functions here
  getProfile: function (req, res, id) {
    User.getUserByID(id, function (err, userProfile) {
      if (err) {
        console.error(err);
        res.status(404).send(err);
      } else {
        res.json(userProfile[0]);
      }

    });
  },

  updateProfile: function (req, res) {
    var data = req.body;
    data.id = req.params.id;
    User.updateUser(data, function (err, result) {
      if (err) {
        //Error handling
        console.error(err);
        res.send(404);
      } else {
        res.send(result)
      }
    })
  },

  // createUser: function (req, res, id) {
  //   User.addUser(req.body, function (err, user) {
  //     if (err) {
  //       console.error(err);
  //       res.status(404).send(err);
  //     } else {
  //       res.json(user);
  //     }
  //   });
  // },

  getUser: function (req, res, id) {
    User.getUserByID(id, function (err, user) {
      if (err) {
        console.error(err);
        res.status(404).send(err);
      } else {
        res.json(user);
      }
    })
  },

  getProfilePhoto: function (req, res, id) {
    User.getProfilePhoto(id, function (err, photo) {
      if (err) {
        console.error(err);
        res.status(404).send(err);
      } else {
        res.send(photo);
      }
    });
  },

  addProfilePhoto: function (req, res, id) {
    User.addProfilePhoto(id, req.body.photo, function (err, result) {
      if (err) {
        console.error(err);
        res.status(404).send(err);
      } else {
        res.send(result);
      }
    })
  },

  getNotifications: function (req, res, id) {
    User.getNotifications(id, function (err, notifications) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.json(notifications);
      }
    })
  },

  createNotification: function (req, res, id) {
    User.addNotification(id, req.body.content, function (err, result) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.send(result);
      }
    })
  },

  getScopedKey: function (req, res) {
    var id = req.params.id;
    User.getScopedKey(id, function (err, key) {
      if (err) {
        console.error(err);
        return res.status(500).send();
      } else {
        return res.status(200).json(key[0]);
      }
    });
  },

  getTags: function (req, res) {
    var id = req.params.id; 
    User.getUserTags(id, function (err, tags) {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).json(tags);
      }
    });
  },

  addTag: function (req, res) {
    var data = req.body;
    data.id = req.params.id;
    User.addTag(data, function (err, tag) {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).json(tag);
      }
    })
  }



}