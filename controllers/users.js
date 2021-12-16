const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.userRegistration = async (req, res, next) => {
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
  }; 
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
}

module.exports.submitLogin = (req, res, next) => {
  req.flash("success", "Welcome back!");
  const loginRedirect = req.session.returnUrl || "/ballparks";
  delete req.session.originalUrl;
  res.redirect(loginRedirect);
}

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/ballparks");
};