const router = require("express").Router();
const { ensureAuth, ensureGeust } = require("../middleware/auth");
const Stroy = require("../models/Story");

// Log in Route

router.get("/", ensureGeust, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// Dashboard Router

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Stroy.find({ user: req.user.id }).lean();

    res.render("dashboard", {
      name: req.user.name,
      stories,
    });
  } catch (e) {
    console.error(e);
    res.render("errors/500");
  }
});

module.exports = router;
