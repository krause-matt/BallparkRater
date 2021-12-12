const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchError = require("../utilities/catchError");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", catchError(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const regUser = await User.register(newUser, password);
    req.login(regUser, error => {
      if(error) return next(error);
      req.flash("success", "Welcome to Ballpark Rater!");
      res.redirect("/ballparks");
    })    
  } catch(error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }  
}));

router.get("/login", (req, res) => {
  res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res, next) => {
  req.flash("success", "Welcome back!");
  const loginRedirect = req.session.returnUrl || "/ballparks";
  delete req.session.originalUrl;
  res.redirect(loginRedirect);
})

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/ballparks");
})



module.exports = router;