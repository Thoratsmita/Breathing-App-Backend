require('dotenv').config();
const passport = require('passport');
const UserService = require('./service/userService');
const GglStrategy = require('passport-google-oauth20').Strategy;
const FbStrategy = require('passport-facebook').Strategy;

module.exports = {
    google: passport.use(new GglStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/users/auth/google/callback',
        },
        
        async function(accesstoken, refreshtoken, profile, done) {
            const email = profile.emails[0].value;
            const name = profile.name.givenName + " " + profile.name.familyName;
            const photo = profile.photos[0].value;
            const source = "google";
            
            const currentUser = await UserService.getUserByEmail({email});

            if(!currentUser) {
                const newUser = await UserService.addUser({
                    email,
                    name,
                    photo,
                    source
                })

                return done(null, newUser);
            }

            if (currentUser.source !== 'google') {
                return done(null, false)
            }
        }
    )),

    facebook: passport.use(new FbStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ["email", "name"]
        },
        
        async function(accesstoken, refreshtoken, profile, done) {
            console.log(profile)
            const { email, first_name, last_name, photo } = profile._json;
            const userData = {
                email,
                name: first_name + " " + last_name,
                photo: photo,
                source: 'facebook'
            };
            
            const currentUser = await UserService.getUserByEmail({email});

            if(!currentUser) {
                const newUser = await UserService.addUser(userData)

                return done(null, newUser);
            }

            if (currentUser.source !== 'facebook') {
                return done(null, false)
            }
        }
    ))
}