const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Ballpark = require('./models/ballparks');
const catchError = require("./utilities/catchError");
const ExpressErr = require("./utilities/ExpressErr");
const {ballparkSchema} = require("./schemas");

mongoose.set("useFindAndModify", false);

mongoose.connect('mongodb://localhost:27017/ballparks', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateBallpark = (req, res, next) => {
    const {error} = ballparkSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(item => item.message).join(", ")
        throw new ExpressErr(errorMsg, 400)
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/ballparks", catchError(async (req, res, next) => {
    const ballparks = await Ballpark.find({});
    res.render("ballparks/index", {ballparks});
}));

app.get("/ballparks/new", (req, res) => {
    res.render("ballparks/new");
});

app.post("/ballparks", validateBallpark, catchError(async (req, res, next) => {
    const ballpark = new Ballpark(req.body.ballpark);
    if (!ballpark.image.includes(".")) {
        throw new ExpressErr("Invalid image URL", 400);
    }
    if (ballpark.image.includes(".")) {
        await ballpark.save();
        res.redirect(`ballparks/${ballpark._id}`);
    }
}));

app.get("/ballparks/:id", catchError(async (req, res, next) => {
    const ballpark = await Ballpark.findById(req.params.id);
    res.render("ballparks/show", {ballpark});
}));

app.get("/ballparks/:id/edit", catchError(async (req, res, next) => {
    const ballpark = await  Ballpark.findById(req.params.id);
    res.render("ballparks/edit", {ballpark});
}));

app.put("/ballparks/:id", validateBallpark, catchError(async (req, res, next) => {
    const ballpark = await Ballpark.findByIdAndUpdate(req.params.id, {...req.body.ballpark});
    res.redirect(`/ballparks/${ballpark._id}`);
}));

app.delete("/ballparks/:id/delete", catchError(async (req, res, next) => {
    const ballpark = await Ballpark.findByIdAndDelete(req.params.id);
    res.redirect("/ballparks");
}));

app.all("*", (req, res, next) => {
    next(new ExpressErr("That page doesn't exist", 404));
});

app.use((err, req, res, next) => {
    const {code = 500} = err;
    if(!err.message) err.message = "Cannot load page";
    res.status(code).render("errors", {err, code})
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});