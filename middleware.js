const { ballparkSchema, reviewSchema } = require("./schemas");
const ExpressErr = require("./utilities/ExpressErr");

module.exports.isRegUser = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  };
  next();
};

module.exports.validateBallpark = (req, res, next) => {
  const {error} = ballparkSchema.validate(req.body);
  if (error) {
      const errorMsg = error.details.map(item => item.message).join(", ");
      throw new ExpressErr(errorMsg, 400);
  } else {
      next();
  };
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const errorMsg = error.details.map(item => item.message).join(", ");
      throw new ExpressErr(errorMsg, 400);
  } else {
      next();
  };
};