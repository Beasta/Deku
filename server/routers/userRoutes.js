var userController = require('../controllers/userController.js');
var expressJWT = require('express-jwt');
// var auth = require('../config/auth');
var auth = require('../config/auth.deploy.js');

module.exports = function (app, passport) {
  //app === userRouter injected from middlware.js
  
  // // protect routes with JWT
  // app.use('/:id', expressJWT({ secret: auth.secret }));

  app.get('/:id', function (req, res) {
    //Get the id
    var id = req.params.id;
    userController.getProfile(req, res, id);
  });

  app.put('/:id', function (req, res) {
    //Get the id
    var id = req.params.id;
    userController.updateProfile(req, res, id);
  });

  app.get('/scopekey/:id', userController.getScopedKey);

  app.get('/tags/:id', userController.getTags);

  app.post('/tags/:id', userController.addTag);
  
}