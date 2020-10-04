const port = process.env.PORT || 1337;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to database!"))
.catch(error => console.log(error.message));

// This is temporary.
// var campgrounds = [
//     {, },
//     {, },
//     {name: "Letchworth State Park", image: "https://www.travelingmom.com/wp-content/uploads/2015/10/DSC04764_edited-1-800x450.jpg"}
// ];

//--------
// Schema
//--------

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Killbear Provincial Park",
//     image: "https://i0.wp.com/rvplacestogo.com/wp-content/uploads/2017/07/feature-1.jpg"
// }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Created campground:");
//         console.log(campground);
//     }
// });

//--------
// Routes
//--------

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;

    campgrounds.push({name: name, image: image});
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

// Tell Express to listen for requests (start server).
app.listen(port, () => {
    console.log("The YelpCamp server is running, listening on port " + port);
});