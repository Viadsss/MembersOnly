const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const { isAuth, isAdmin } = require("../utils/authMiddleware");

const validateMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title must not exceed 50 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .bail()
    .isLength({ max: 300 })
    .withMessage("Content must not exceed 300 characters"),
];

exports.messageCreateGet = [
  isAuth,
  (req, res) => {
    res.render("create", { user: req.user });
  },
];

exports.messageCreatePost = [
  validateMessage,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("create", { errors: errors.array() });
    }

    const { title, content } = req.body;
    const author_id = req.user.id;

    await db.insertMessage(author_id, title, content);
    res.redirect("/");
  }),
];
exports.messageDeletePost = [
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const message = await db.getMessageById(id);
    if (!message) res.redirect("/");

    await db.deleteMessage(id);

    res.redirect("/");
  }),
];
