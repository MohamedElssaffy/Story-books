const ensureAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

const ensureGeust = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};

module.exports = {
  ensureAuth,
  ensureGeust,
};
