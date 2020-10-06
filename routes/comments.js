const express = require("express");
const router = express.Router({mergeParams: true}); // Merges the parameters that were removed and placed in the app.js.
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// Create comment route.
router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // Add username and ID to comment.
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    // Push in the comment, save the campground, and redirect.
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// New comment route.
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// Middleware.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

module.exports = router;