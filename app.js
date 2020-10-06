const port = process.env.PORT || 1337;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const seedDb = require("./seeds")

const Campground = require("./models/campground");
const Comment = require("./models/comment");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Connected to database!"))
.catch(error => console.log(error.message));

//seedDb();

//--------
// Routes
//--------

app.get("/", (req, res) => {
    res.render("landing");
});

// Index route
app.get("/campgrounds", (req, res) => {
    // Get all campgrounds from the database and render the campgrounds page with the data.
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
});

// Create route
app.post("/campgrounds", (req, res) => {
    // Get the data from the form.
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newCampground = {
        name: name,
        image: image,
        description: description
    };

    // Create the new object in the database.
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            // If successful redirect to campgrounds page.
            res.redirect("/campgrounds");
        }
    });
});

// New route - This needs to be declared before the show route.
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// Show route
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Create comment route.
app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// New comment route.
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// Tell Express to listen for requests (start server).
app.listen(port, () => {
    console.log("The YelpCamp server is running, listening on port " + port);
});