
const db = require('../config/db');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require("../models/userModel.js");

passport.use(new LocalStrategy(
  (email, password, done) => {

    User.findOneEmail(email)
        .then(([user]) => {
            if(!user || !User.validatePassword(password, user)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }

            return done(null, user);
        }).catch(done);
}));

module.exports = function (app) {
};