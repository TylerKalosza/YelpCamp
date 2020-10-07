const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.send("You need to be logged in to do that.");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, (err, foundComment) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;