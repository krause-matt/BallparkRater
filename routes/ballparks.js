const express = require("express");
const router = express.Router();
const ExpressErr = require("../utilities/ExpressErr");
const Ballpark = require('../models/ballparks');
const { ballparkSchema } = require("../schemas");
const catchError = require("../utilities/catchError");

const validateBallpark = (req, res, next) => {
  const {error} = ballparkSchema.validate(req.body);
  if (error) {
      const errorMsg = error.details.map(item => item.message).join(", ");
      throw new ExpressErr(errorMsg, 400);
  } else {
      next();
  };
};

router.get("/", catchError(async (req, res, next) => {
  const ballparks = await Ballpark.find({});
  res.render("ballparks/index", {ballparks});
}));

router.get("/new", (req, res) => {
  res.render("ballparks/new");
});

router.post("/", validateBallpark, catchError(async (req, res, next) => {
  const ballpark = new Ballpark(req.body.ballpark);
  if (!ballpark.image.includes(".")) {
      throw new ExpressErr("Invalid image URL", 400);
  }
  if (ballpark.image.includes(".")) {
      await ballpark.save();
      req.flash("success", "New ballpark created!");
      res.redirect(`ballparks/${ballpark._id}`);
  }
}));

router.get("/:id", catchError(async (req, res, next) => {
  const ballpark = await Ballpark.findById(req.params.id).populate("reviews");
  if (!ballpark) {
    req.flash("error", "Cannot find that ballpark!");
    return res.redirect("/ballparks");
  }
  res.render("ballparks/show", {ballpark});
}));

router.get("/:id/edit", catchError(async (req, res, next) => {
  const ballpark = await  Ballpark.findById(req.params.id);
  if (!ballpark) {
    req.flash("error", "Cannot find that ballpark!");
    return res.redirect("/ballparks");
  }
  res.render("ballparks/edit", {ballpark});
}));

router.put("/:id", validateBallpark, catchError(async (req, res, next) => {
  const ballpark = await Ballpark.findByIdAndUpdate(req.params.id, {...req.body.ballpark});
  req.flash("success", "Ballpark edited!");
  res.redirect(`/ballparks/${ballpark._id}`);
}));

router.delete("/:id/delete", catchError(async (req, res, next) => {
  const ballpark = await Ballpark.findByIdAndDelete(req.params.id);
  req.flash("success", "Ballpark deleted!");
  res.redirect("/ballparks");
}));

module.exports = router;