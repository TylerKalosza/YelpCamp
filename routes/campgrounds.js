const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// Index route
router.get("/", (req, res) => {
    // Get all campgrounds from the database and render the campgrounds page with the data.
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// Create route.
router.post("/", isLoggedIn, (req, res) => {
    // Get the data from the form.
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
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
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Show route.
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit route.
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update route.
router.put("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

// Delete route, this removes the comments, it is older syntax.
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }

        Comment.deleteMany({_id: { $in: campground.comments}}, (err) => {
            if (err) {
                console.log(err);
            }

            res.redirect("/campgrounds");
        });
    });
})

// Old delete route, this does not remove the comments.
// router.delete("/:id", (req, res) => {
//     Campground.findByIdAndDelete(req.params.id, (err) => {
//         if (err) {
//             console.log(err);
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds");
//         }
//     });
// });

// Middleware.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
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
}

module.exports = router;