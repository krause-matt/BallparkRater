const express = require("express");
const router = express.Router();
const ExpressErr = require("../utilities/ExpressErr");
const Ballpark = require('../models/ballparks');
const ballpark = require("../controllers/ballparks");

const catchError = require("../utilities/catchError");
const { validateBallpark, isRegUser, isBallparkOwner, isReviewOwner } = require("../middleware");

router.get("/", catchError(ballpark.main));

router.get("/new", isRegUser, ballpark.addBallparkForm);

router.post("/", validateBallpark, isRegUser, catchError(ballpark.addBallpark));

router.get("/:id", catchError(ballpark.showBallpark));

router.get("/:id/edit", isRegUser, isBallparkOwner, catchError(ballpark.editBallparkForm));

router.put("/:id", validateBallpark, isRegUser, isBallparkOwner, catchError(ballpark.editBallpark));

router.delete("/:id/delete", isRegUser, isBallparkOwner, catchError(ballpark.deleteBallpark));

module.exports = router;