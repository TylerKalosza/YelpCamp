const port = process.env.PORT || 1337;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

// This is temporary.
var campgrounds = [
    {name: "Algonquin National Park", imageUrl: "https://www.hinzie.com/media/image/60103_max.jpg"},
    {name: "Killbear Provincial Park", imageUrl: "https://i0.wp.com/rvplacestogo.com/wp-content/uploads/2017/07/feature-1.jpg"},
    {name: "Letchworth State Park", imageUrl: "https://www.travelingmom.com/wp-content/uploads/2015/10/DSC04764_edited-1-800x450.jpg"}
];

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;

    campgrounds.push({name: name, imageUrl: imageUrl});
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

// Tell Express to listen for requests (start server).
app.listen(port, () => {
    console.log("The YelpCamp server is running, listening on port " + port);
});