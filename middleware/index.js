const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "You must login to continue")
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash("error", "Sorry, that campground does not exist!");
                res.redirect("/campgrounds");
            } else if(foundCampground.author.id.equals(req.user._id)) {
                req.campground = foundCampground;
                next();
            } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("/campgrounds/" + req.params.id);
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Sorry, that comment does not exist!");
                res.redirect("/campgrounds");
            } else if(foundCampground.author.id.equals(req.user._id)) {
                req.comment = foundComment;
                next();
            } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("/campgrounds/" + req.params.id);
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;