const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressErr = require("../utilities/ExpressErr");
const catchError = require("../utilities/catchError");

const Ballpark = require('../models/ballparks');
const Review = require('../models/review');
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const errorMsg = error.details.map(item => item.message).join(", ");
      throw new ExpressErr(errorMsg, 400);
  } else {
      next();
  };
};

router.post("/", validateReview, catchError(async(req, res, next) => {
  const ballpark = await Ballpark.findById(req.params.id);
  const review = new Review(req.body.review);
  ballpark.reviews.push(review);
  await ballpark.save();
  await review.save();
  req.flash("success", "New review posted!");
  res.redirect(`/ballparks/${ballpark.id}`);
}));

router.delete("/:reviewId", async(req, res, next) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Ballpark.findByIdAndUpdate( id, { $pull : { reviews : reviewId}});
  req.flash("success", "Review deleted!");
  res.redirect(`/ballparks/${id}`);
});

module.exports = router;