require('dotenv').config();
const passport = require('passport');
const GglStrategy = require('passport-google-oauth20').Strategy;
const FbStrategy = require('passport-facebook').Strategy;
const User = require("./models/userModel");

module.exports = {
    google: passport.use(new GglStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/users/auth/google/callback',
        },
        
        function(accesstoken, refreshtoken, profile, done) {
            return done(null, profile)
        }
    )),

    facebook: passport.use(new FbStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        
        function(accesstoken, refreshtoken, profile, done) {
            return done(null, profile)
        }
    ))
}