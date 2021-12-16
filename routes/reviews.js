const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utilities/catchError");

const Ballpark = require("../models/ballparks");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

const { validateReview, isRegUser, isReviewOwner } = require("../middleware");

router.post("/", validateReview, isRegUser, catchError(reviews.addReview));

router.delete("/:reviewId", isRegUser, isReviewOwner, reviews.deleteReview);

module.exports = router;