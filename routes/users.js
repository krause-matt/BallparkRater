const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const users = require("../controllers/users");
const catchError = require("../utilities/catchError");

router.route("/register")
  .get(users.registerForm)
  .post(catchError(users.userRegistration));

router.route("/login")
  .get(users.loginForm)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.submitLogin)

router.get("/logout", users.logout);

module.exports = router;