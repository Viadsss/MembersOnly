const { Router } = require("express");
const router = Router();
const controller = require("../controllers/indexController");
const passport = require("passport");

router.get("/", controller.indexGet);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
