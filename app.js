const port = process.env.PORT || 1337;
const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    var campgrounds = [
        {name: "Algonquin National Park", image: "https://www.hinzie.com/media/image/60103_max.jpg"},
        {name: "Killbear Provincial Park", image: "https://i0.wp.com/rvplacestogo.com/wp-content/uploads/2017/07/feature-1.jpg"},
        {name: "Letchworth State Park", image: "https://www.travelingmom.com/wp-content/uploads/2015/10/DSC04764_edited-1-800x450.jpg"}
    ];

    res.render("campgrounds", {campgrounds: campgrounds});
});

// Tell Express to listen for requests (start server).
app.listen(port, () => {
    console.log("The YelpCamp server is running, listening on port " + port);
});