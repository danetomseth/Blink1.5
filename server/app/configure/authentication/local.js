'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {

    var signupStrategyFn = function(req, user, email, done) {
        console.log(3, req.body, user)
        user = req.body
        User.findOne({email: user.email})
        .then(returnedUser => {
            if (returnedUser) {
                //email is in use already
                return done(null, false)
            } else {
                // otherwise create user
                return User.create(user)
                .then(newUser => {
                    console.log(4, newUser)
                    return done(null, newUser)
                })
            }
        })
        .catch(done)
    }

    passport.use('signup', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, signupStrategyFn))

    app.post('/signup', (req, res, next) => {

        let signupCB = (err, user) => {
            if (err) return next(err);

            if (!user) {
                var error = new Error('Something went horribly wrong');
                error.status = 401;
                return next(error);
            }

            res.status(200).send({
                user: user.sanitize()
            });
        }

        passport.authenticate('signup', signupCB)(req, res, next);
    })
    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
        User.findOne({ email: email })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            })
            .catch(done);
    };

    passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));


    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {

        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (loginErr) {
                if (loginErr) return next(loginErr);
                // We respond with a response object that has user with _id and email.
                res.status(200).send({
                    user: user.sanitize()
                });
            });

        };

        passport.authenticate('login', authCb)(req, res, next);

    });

};
