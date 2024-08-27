const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/log-in");
  }
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    next();
  } else {
    res.status(401).send("You are not admin to view this");
  }
};

module.exports = { isAuth, isAdmin };
