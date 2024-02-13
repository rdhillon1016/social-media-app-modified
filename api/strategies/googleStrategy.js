
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { generateFromEmail } = require("unique-username-generator");
const User = require('../models/User');
require('dotenv').config();

module.exports = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/login/google/callback'
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    let checkUser = await User.findOne({ googleId: profile.id });
    if (!checkUser) {
      const usernameVal = generateFromEmail(profile.emails[0].value, 4)
      const user = new User({
        username: usernameVal,
        email: profile.emails[0].value,
        friends: [],
        profilePicUrl: "https://api.dicebear.com/5.x/big-ears/svg?seed=Felix",
        googleId: profile.id,
        signedUpWithSocialMedia: true
      })
      checkUser = await user.save();
    }
    return cb(null, checkUser);
  } catch (error) {
    console.log(error)
    return cb(error, null)
  }
}); 