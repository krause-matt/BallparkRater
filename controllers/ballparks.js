const Ballpark = require("../models/ballparks");
const ExpressErr = require("../utilities/ExpressErr");
const { cloudinary } = require("../cloudinary/index");

module.exports.main = async (req, res, next) => {
  const ballparks = await Ballpark.find({});
  res.render("ballparks/index", {ballparks});
}

module.exports.addBallparkForm = (req, res) => {
  res.render("ballparks/new");
}

module.exports.addBallpark = async (req, res, next) => {
  const ballpark = new Ballpark(req.body.ballpark);
  ballpark.images = req.files.map(item => ({url: item.path, filename: item.filename}))
  ballpark.author = req.user._id;
  await ballpark.save();
  req.flash("success", "New ballpark created!");
  res.redirect(`ballparks/${ballpark._id}`);
}

module.exports.showBallpark = async (req, res, next) => {
  const ballpark = await Ballpark.findById(req.params.id).populate({path: "reviews", populate: {path: "author"}}).populate("author");
  if (!ballpark) {
    req.flash("error", "Cannot find that ballpark!");
    return res.redirect("/ballparks");
  }
  res.render("ballparks/show", {ballpark});
}

module.exports.editBallparkForm = async (req, res, next) => {
  const ballpark = await Ballpark.findById(req.params.id);
  if (!ballpark) {
    req.flash("error", "Cannot find that ballpark!");
    return res.redirect("/ballparks");
  }
  res.render("ballparks/edit", {ballpark});
}

module.exports.editBallpark = async (req, res, next) => {
  const ballpark = await Ballpark.findByIdAndUpdate(req.params.id, {...req.body.ballpark});
  const images = req.files.map(item => ({url: item.path, filename: item.filename}))
  ballpark.images.push(...images);
  await ballpark.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    };
    await ballpark.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  };
  req.flash("success", "Ballpark edited!");
  res.redirect(`/ballparks/${ballpark._id}`);
}

module.exports.deleteBallpark = async (req, res, next) => {
  const ballpark = await Ballpark.findByIdAndDelete(req.params.id);
  req.flash("success", "Ballpark deleted!");
  res.redirect("/ballparks");
}