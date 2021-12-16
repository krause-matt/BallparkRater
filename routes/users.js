const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const users = require("../controllers/users");
const catchError = require("../utilities/catchError");

router.get("/register", users.registerForm);

router.post("/register", catchError(users.userRegistration));

router.get("/login", users.loginForm);

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.submitLogin);

router.get("/logout", users.logout);

module.exports = router;