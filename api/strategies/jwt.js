const JWTStrategy = require('passport-jwt').Strategy;

const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
require('dotenv').config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

module.exports = new JWTStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.userid);
    if (user) {
      return done (null, user);
    } else {
      return done (null, false);
    }
  } catch (err) {
    return done (err, false);
  }
});