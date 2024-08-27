const asyncHandler = require("express-async-handler");
const passport = require("passport");
const db = require("../db/queries");
const bcrpyt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { isAuth, isAdmin } = require("../utils/authMiddleware");
const { formatDistance } = require("date-fns");

const validateSignUp = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("First name should only contain letters and spaces")
    .bail()
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Last name should only contain letters and spaces")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.indexGet = asyncHandler(async (req, res) => {
  const messages = await db.getMessagesWithAuthors();

  const formattedMessages = messages.map((message) => ({
    ...message,
    created_at_text: formatDistance(new Date(message.created_at), new Date(), {
      addSuffix: true,
    }),
  }));

  res.render("index", { user: req.user, messages: formattedMessages });
});

exports.signUpGet = (req, res) => {
  res.render("sign-up");
};

exports.signUpPost = [
  validateSignUp,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    const { first_name, last_name, username, password } = req.body;

    const usernameExists = db.doesUsernameExist(username);
    if (usernameExists) {
      return res
        .status(400)
        .render("sign-up", { errors: [{ msg: "Username already exists" }] });
    }

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
  }),
];

exports.logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.logInGet = (req, res) => {
  if (req.user) res.redirect("/");

  const errors = req.session.messages
    ? [{ msg: req.session.messages.pop() }]
    : null;

  res.render("log-in", { errors });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true,
});

exports.joinClubGet = [
  isAuth,
  (req, res) => {
    if (req.user.is_member) {
      return res.redirect("/");
    }

    res.render("join-club", { user: req.user });
  },
];

exports.joinClubPost = asyncHandler(async (req, res) => {
  const { passcode } = req.body;
  const id = req.user.id;
  const correctPasscode = "HideSPOT";

  if (passcode !== correctPasscode) {
    return res.status(400).render("join-club", {
      user: req.user,
      errors: [{ msg: "Incorrect secret passcode" }],
    });
  }

  await db.updateMemberStatus(id);
  res.render("join-club", { success: true });
});

exports.adminGet = [
  isAuth,
  (req, res) => {
    if (req.user.is_admin) {
      return res.redirect("/");
    }

    res.render("admin", { user: req.user });
  },
];

exports.adminPost = asyncHandler(async (req, res) => {
  const { passcode } = req.body;
  const id = req.user.id;
  const correctPasscode = "HideSPOTadmin";

  if (passcode !== correctPasscode) {
    return res.status(400).render("admin", {
      user: req.user,
      errors: [{ msg: "Incorrect secret passcode" }],
    });
  }

  await db.updateAdminStatus(id);
  res.render("admin", { success: true });
});
