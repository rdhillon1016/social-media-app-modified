const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
require("dotenv").config()

exports.hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

exports.findUser = (val) => User.findOne({ username: val }).exec();

exports.saveNewUser = async (req, res, next) => {
  try {
    const hash = await exports.hashPassword(req.body.password);

    const user = new User({
      username: req.body.username,
      password: hash,
      email: req.body.email,
      friends: [],
      bio: req.body.bio,
      profilePicUrl: "https://api.dicebear.com/5.x/big-ears/svg?seed=Felix",
    });

    const savedUser = await user.save();

    if (savedUser !== user) {
      throw new Error();
    }

    res.status(200).send({ success: [{ msg: "Thanks for signing up" }] });
  } catch (error) {
    next({
      statusCode: 500,
      errors: ["Internal server error: Could not register user"],
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();

    if (user === null) {
      next({ statusCode: 404, errors: ["Username or password is incorrect"] });
    } else if (user.signedUpWithSocialMedia === true) {
      next({ statusCode: 400, 
        errors: ["Cannot login with username if account was signed up with social media"]});
    } else {
      const result = await bcrypt.compare(req.body.password, user.password);

      if (result) {
        //  token will expire in 5 days
        const expiresDate = 1000 * 60 * 60 * 24 * 5 + Date.now();
        const opts = {};
        opts.expiresIn = expiresDate;
        const secret = process.env.SECRET;
        // eslint-disable-next-line no-underscore-dangle
        const token = jwt.sign({ userid: user._id }, secret, opts);
        res.status(200).send({
          success: true,
          token: `Bearer ${token}`,
          expiresDate,
        });
      } else {
        next({
          statusCode: 404,
          errors: ["Username or password is incorrect"],
        });
      }
    }
  } catch (error) {
    next({
      statusCode: 500,
      errors: ["Internal server error: Could not login user"],
    });
  }
};

exports.googleLoginCallBack = async (req, res, next) => {
  try {

    if (req.user != null) {
      //  token will expire in 5 days
      const expiresDate = 1000 * 60 * 60 * 24 * 5 + Date.now();
      const opts = {};
      opts.expiresIn = expiresDate;
      const secret = process.env.SECRET;
      const token = jwt.sign({ userid: req.user._id }, secret, opts);
      res.cookie('token', `Bearer ${token}`, { expiresDate })
      res.redirect(302, `${process.env.FE_URL}/profile`);
    } else {
      next({
        statusCode: 404,
        errors: ["Username or password is incorrect"],
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      errors: ["Internal server error: Could not login user"],
    });
  }
}


