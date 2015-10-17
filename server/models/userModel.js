//Require DB connection!
var db = require('../db/connection.js');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  //Example function for querying the db for all users
  //and passing the result to the callback
  getAllUsers: function (callback) {
    //Some DB queries here
    db.query('select id, username, scoped_key, about, location, growth_methods, plants from Users', function (err, users) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, users);
      }
    });
  },

  getUserByID: function (id, callback) {
    // we don't need a password since a profile is viewable by anyone
    db.query('select id, username, scoped_key, about, location, growth_methods, plants from Users where id = ?', [id], function (err, userObj) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, userObj);
      }
    });
  },

  getUserByName: function (username, callback) {
    db.query('select id, username, password, scoped_key, about, location, growth_methods, plants from Users where username = ?', [username], function (err, user) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, user);
      }
    })
  },

  getUserByEmail: function (email, callback) {
    db.query('select id, username, email, fb_id, fb_token, google_id, google_token, scoped_key, about, location, growth_methods, plants from Users where email = ?',
      [email], function (err, user) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, user);
        }
      })
  },

  updateUser: function (data, callback) {
    db.query('update Users set about = ?, profile_photo = ?, location = ?, \
      growth_methods = ?, plants = ? where id = ?', 
      [data.about, data.photo, data.location, data.growthMethods, data.plants, data.id],
      function (err, user) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, user);
        }
    });
  },

  addUserByLocal: function (data, callback) {
    var password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
  
    db.query('insert into users values ((username = ?), (password = ?))', [data.username, password], function (err, user) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, user);
      }
    });
  },

  addUserByFB: function (data, callback) {
    db.query('insert into users values ((username = ?), (email = ?), (fb_id = ?), (fb_token = ?))', [data.username, data.email, data.fbID, data.fbToken],
      function (err, user) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, user);
        }
      });
  },

  addUserByGoogle: function (data, callback) {
    db.query('insert insert into users values ((username = ?), (email = ?), (google_id = ?), (google_token = ?))', [data.username, data.email, data.googleID, data.googleToken],
      function (err, user) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, user);
        }
      });
  },

  getProfilePhoto: function (id, callback) {
    db.query('select profile_photo from users where id = ?', [id], function (err, photo) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, photo);
      }
    });
  },

  addProfilePhoto: function (id, photo, callback) {
    db.query('update users set photo = ? where id = ?', [photo, id], function (err, photo) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, photo);
      }
    });
  },

  getFollowers: function (id, callback) {
    db.query('select u.username from users u inner join followers f on (f.follower_id = u.id) where f.user_id = ?',
      [id],
      function (err, followers) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, followers);
        }
    });
  },

  addFollower: function (userID, targetID, callback) {
    db.query('insert into followers values (?, ?)', [userID, targetID], function (err, target) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, target);
      }
    });
  },

  getStatuses: function (id, callback) {
    db.query('select * from statuses where user_id = ?', [id], function (err, statuses) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, statuses);
      }
    })
  },

  addStatus: function (data, callback) {
    db.query('insert into statuses values ( (user_id = ?), (status = ?))', [data.userID, data.status],
      function (err, status) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, status);
        }
    });
  },

  getNotifications: function (id, callback) {
    db.query('select n.content from notifications n inner join users u on (n.user_id = u.id) where user_id = ?', [id],
      function (err, notifications) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, notifications);
        }
    });
  },

  addNotification: function (id, content, callback) {
    db.query('insert into notifications values (?, ?)', [id, content], function (err, notification) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, notification);
      }
    });
  },

  isValidPassword: function (candidatePassword, hashedPassword) {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  },

  getPassword: function (id, callback) {
    db.query('select password from users where id = ?', [id], function (err, password) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, password);
      }
    });
  }
}