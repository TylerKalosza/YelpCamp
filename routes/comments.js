const express = require("express");
const campground = require("../models/campground");
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

// Edit comment route.
router.get("/:commentId/edit", (req, res) => {
    Comment.findById(req.params.commentId, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
        }
    });
});

// Update comment route.
router.put("/:commentId", (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete route.
router.delete("/:commentId", (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err) => {
        if (err) {
            console.log(err);
        }

        res.redirect("/campgrounds/" + req.params.id);
    })
})

// Middleware.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

module.exports = router;