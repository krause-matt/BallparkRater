const express = require("express");
const router = express.Router();
const ballpark = require("../controllers/ballparks");
const catchError = require("../utilities/catchError");
const { validateBallpark, isRegUser, isBallparkOwner } = require("../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.route("/")
  .get(catchError(ballpark.main))
  .post(validateBallpark, isRegUser, catchError(ballpark.addBallpark))

router.get("/new", isRegUser, ballpark.addBallparkForm);

router.route("/:id")
  .get(catchError(ballpark.showBallpark))
  .put(validateBallpark, isRegUser, isBallparkOwner, catchError(ballpark.editBallpark))

router.get("/:id/edit", isRegUser, isBallparkOwner, catchError(ballpark.editBallparkForm));

router.delete("/:id/delete", isRegUser, isBallparkOwner, catchError(ballpark.deleteBallpark));

module.exports = router;