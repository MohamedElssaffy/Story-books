const router = require("express").Router();
const Story = require("../models/Story");
const { ensureAuth } = require("../middleware/auth");
const Stroy = require("../models/Story");

// Route For Show Add Story

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//  Route For Save Sotry

router.post("/", ensureAuth, async (req, res) => {
  try {
    const story = new Story({
      user: req.user.id,
      ...req.body,
    });

    await story.save();

    res.redirect("/dashboard");
  } catch (e) {
    console.error(e);
    res.render("errors/500");
  }
});

// Route For Show Public Stories

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/public", { stories });
  } catch (e) {
    console.error(e);
    res.render("errors/500");
  }
});

// Router For Show A Single Story

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("errors/404");
    }

    res.render("stories/show", { story });
  } catch (e) {
    console.error(e);

    res.render("errors/404");
  }
});

//  Route For Edit Story

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!story) {
      return res.render("errors/404");
    }

    res.render("stories/edit", { story });
  } catch (e) {
    res.render("errors/500");
  }
});

//  Route For Save Changes In Story

router.put("/:id", ensureAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdate = ["title", "status", "body"];
  const validation = updates.every((update) => allowUpdate.includes(update));
  if (!validation) {
    throw new Error();
  }

  try {
    let story = await Stroy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!story) {
      return res.render("errors/404");
    } else {
      updates.forEach((update) => (story[update] = req.body[update]));
      story.save();
      res.redirect("/dashboard");
    }
  } catch (e) {
    console.error(e);
    res.render("errors/500");
  }
});

//  Route For Delete Story

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!story) {
      return res.render("errors/404");
    }
    res.redirect("/dashboard");
  } catch (e) {
    console.error(e);
    res.render("errors/500");
  }
});

//  Route To Show User Story

router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/public", { stories });
  } catch (e) {
    console.error(e);
    res.render("errors/500");
  }
});

module.exports = router;
