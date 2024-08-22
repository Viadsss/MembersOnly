const asyncHandler = require("express-async-handler");
const passport = require("passport");
const db = require("../db/queries");
const bcrpyt = require("bcryptjs");

exports.indexGet = asyncHandler(async (req, res) => {
  console.log({ messages, user: req.user });
  res.render("index", { user: req.user });
});

exports.signUpGet = (req, res) => {
  res.render("sign-up");
};

exports.signUpPost = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, username, password } = req.body;

  const hashedPassword = await bcrpyt.hash(password, 10);
  const user = await db.insertUser(
    first_name,
    last_name,
    username,
    hashedPassword
  );

  req.logIn(user, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

exports.logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.logInGet = (req, res) => {
  res.render("log-in");
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});
