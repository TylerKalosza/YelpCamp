const port = process.env.PORT || 1337;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const seedDb = require("./seeds")

// Requiring routes.
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

// const Campground = require("./models/campground");
// const Comment = require("./models/comment");
const User = require("./models/user");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Connected to database!"))
.catch(error => console.log(error.message));

//seedDb();

app.use(require("express-session")({
    secret: "This is my secret. This can be anything.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// My own middleware, this will pass current user to every route.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Set up the route files to use.
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // If I include "/campgrounds" here then I can take them out of the routes in the campgrounds.js file. This is called a nested route.
app.use("/campgrounds/:id/comments", commentRoutes);

// Tell Express to listen for requests (start server).
app.listen(port, () => {
    console.log("The YelpCamp server is running, listening on port " + port);
});