const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res, next) => {
  res.send(req.body);
})

module.exports = router;