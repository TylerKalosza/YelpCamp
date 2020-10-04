const port = process.env.PORT || 1337;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to database!"))
.catch(error => console.log(error.message));

//--------
// Schema
//--------

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//--------
// Routes
//--------

app.get("/", (req, res) => {
    res.render("home");
});

// Index route
app.get("/campgrounds", (req, res) => {
    // Get all campgrounds from the database and render the campgrounds page with the data.
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds})
        }
    });
});

// Create route
app.post("/campgrounds", (req, res) => {
    // Get the data from the form.
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {
        name: name,
        image: image
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
    res.render("new.ejs");
});

// Show route
app.get("/campgrounds/:id", (req, res) => {
    res.send("This will be the show page one day!");
});

// Tell Express to listen for requests (start server).
app.listen(port, () => {
    console.log("The YelpCamp server is running, listening on port " + port);
});