const Ballpark = require("../models/ballparks");
const Review = require("../models/review");

module.exports.addReview = async(req, res, next) => {
  const ballpark = await Ballpark.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  ballpark.reviews.push(review);  
  await ballpark.save();
  await review.save();
  req.flash("success", "New review posted!");
  res.redirect(`/ballparks/${ballpark.id}`);
}

module.exports.deleteReview = async(req, res, next) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Ballpark.findByIdAndUpdate( id, { $pull : { reviews : reviewId}});
  req.flash("success", "Review deleted!");
  res.redirect(`/ballparks/${id}`);
}