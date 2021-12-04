const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Ballpark = require('./models/ballparks');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get("/", (req, res) => {
    res.render('home');
});

app.get("/ballparks", async (req, res) => {
    const ballparks = await Ballpark.find({});
    res.render("ballparks/index", {ballparks});
})

app.get("/ballparks/:id", async (req, res) => {
    const ballparks = await Ballpark.findById(req.params.id);
    res.render("ballparks/show", {ballparks});
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});