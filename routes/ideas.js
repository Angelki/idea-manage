const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

// load Idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// ideas index page
// 只有当前想法的user属性等于当前用户的id时才会显示
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// add idea
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// edit idea
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // 如果当前idea的userid不等于当前用户 则不给访问 防止复制url直接进入编辑页面
    if (idea.user !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

// process form
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newIdea).save().then(idea => {
      req.flash("success_msg", "IDEA Added!");
      res.redirect("./ideas");
    });
  }
});

// edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    (idea.title = req.body.title), (idea.details = req.body.details);
    idea.save().then(idea => {
      req.flash("success_msg", "IDEA Updated!");
      res.redirect("/ideas");
    });
  });
});

// delete Idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "IDEA Removed!");
    res.redirect("/ideas");
  });
});

module.exports = router;
