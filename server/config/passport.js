// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../models/userModel');

// load the auth variables
var configAuth = require('../config/auth');

// load helpers
var util = require('../helpers/utilities');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // passport.serializeUser(function(user, done) {
    //     done(null, user[0].id);
    // });

    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     User.getUserByID(id, function(err, user) {
    //         done(err, user);
    //     });
    // });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.getUserByName(username, function(err, user) {

            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if there's already a user with that email
            if (user.length === 1) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {
                // if there is no user with that email
                // create the user
                var newUser = {
                    username: username,
                    password: password
                };

                User.addUserByLocal(newUser, function (err, user) {
                    if (err) {
                        console.error(err);
                    } else {
                        return done(null, user[0]);
                    }
                });
            }

        });    

        });

    }));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.getUserByName(username, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            }
            // if no user is found, return the message
            if (user.length === 0) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            if (!util.isValidPassword(password, user[0].password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, user[0]);
        });

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their email
            User.getUserByEmail(profile.emails[0].value, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user.length === 1) {
                    return done(null, user[0]); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = {
                        username: profile.name.givenName + ' ' + profile.name.familyName,
                        fbID: profile.id,
                        fbToken: token,
                        email: profile.emails[0].value
                    };
                    User.addUserByFB(newUser, function (err, user) {
                        if (err) {
                            return console.error(err);
                        } else {
                            return done(null, user[0]);
                        }
                    });
                }

            });
        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.getUserByEmail(profile.emails[0].value, function(err, user) {
                if (err)
                    return done(err);

                if (user.length === 1) {
                    // if a user is found, log them in

                    return done(null, user[0]);
                } else {
                    var newUser = {
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        googleID: profile.id,
                        googleToken: token
                    };

                    User.addUserByGoogle(newUser, function (err, user) {
                        if (err) {
                            return console.error(err);
                        } else {
                            return done(null, user[0]);
                        }
                    });
                }
            });
        });

    }));


};