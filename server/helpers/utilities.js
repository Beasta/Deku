var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
// var auth = require('../config/auth');
if (process.env.PORT) {
  var auth = require('../config/auth.deploy.js');
} else {
  var auth = require('../config/auth.js');
}

module.exports = {
  isValidPassword: function (candidatePassword, hashedPassword) {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  },

  generateWebToken: function (userObj) {
    // set expiration to 5 hours
    var profile = {
      id: userObj.id,
      username: userObj.username,
      email: userObj.email,
      scopedKey: userObj.write_scoped_key,
      tessel: userObj.tessel
    };

    return jwt.sign(profile, auth.secret, { expiresIn: 86400 });
  }
}