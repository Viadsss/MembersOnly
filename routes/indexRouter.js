const { Router } = require("express");
const router = Router();
const controller = require("../controllers/indexController");

router.get("/", controller.indexGet);
router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", controller.signUpPost);
router.get("/log-out", controller.logOutGet);
router.get("/log-in", controller.logInGet);
router.post("/log-in", controller.logInPost);
router.get("/protected", controller.protectedGet);
router.get("/admin", controller.adminGet);

module.exports = router;
