const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Load User Modal
require("../models/user");
const User = mongoose.model("users");

// User Login Route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// User register  Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Login form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Register Form Post
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/login");
      } else {
        // 创建User的实例
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "you are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
        console.log(newUser);
      }
    });
  }
});

// logout user
router.get("/logout", (req, res) => {
  // passport暴露在req上的一个函数，终止login session 移除req.user 清除login session
  req.logout();
  req.flash("success_msg", "Your are Logged out");
  res.redirect("/users/login");
});

module.exports = router;
