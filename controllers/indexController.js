const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.indexGet = asyncHandler(async (req, res) => {
  const messages = await db.getMessagesWithAuthors();
  res.json({ messages });
});
