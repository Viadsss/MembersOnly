const { Router } = require("express");
const router = Router();
const controller = require("../controllers/messageController");

router.get("/create", controller.messageCreateGet);
router.post("/create", controller.messageCreatePost);
router.post("/:id/delete", controller.messageDeletePost);

module.exports = router;
