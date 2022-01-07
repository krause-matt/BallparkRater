if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
};

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressErr = require("./utilities/ExpressErr");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const User = require("./models/user");

const ballparkRoutes = require("./routes/ballparks");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const mongoDb = process.env.MONGODB;

//mongoose.connect("mongodb://localhost:27017/ballparks"

mongoose.connect("mongodb://localhost:27017/ballparks", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
//app.use(helmet({contentSecurityPolicy: false,}));

const store = MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/ballparks",
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: "Comiskey"
    }
});

store.on("error", function (err) {
    console.log("Session store error", err);
});

const sessionSettings = {
    store,
    name: "BR_Session",
    secret: "Comiskey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionSettings));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.loggedInUser = req.user;
    next();
});

app.use("/ballparks", ballparkRoutes);
app.use("/ballparks/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

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