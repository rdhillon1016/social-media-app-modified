const v = require("../middleware/validators/AuthValidator");
const q = require("../middleware/query-executors/AuthQueryExecutor");
const { sendResponseOnError } = require("../middleware/validators/util");
const passport = require('passport')
require("dotenv").config();

exports.jwtSignupPost = [
  ...v.validateSignupBody,
  sendResponseOnError,
  q.saveNewUser,
];

exports.jwtLoginPost = [
  // eslint-disable-next-line consistent-return
  ...v.validateLoginBody,
  sendResponseOnError,
  q.loginUser,
];

exports.googleSignIn = [
  passport.authenticate(['google', 'jwt'], {
    scope: ['profile', 'email']
  })
]

exports.googleSignInCallback = [
  passport.authenticate(['google', 'jwt'], {
    session: false,
    failureRedirect: `${process.env.FE_URL}/login`,
  }),
  q.googleLoginCallBack
]
