const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

// Show register form.
router.get("/register", (req, res) => {
    res.render("register");
});

// Handle sign-up logic.
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Your account has been successfully created!");
            res.redirect("/campgrounds");
        });
    });
});

// Show login form.
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle login logic. (I can remove the callback because I don't use it)
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

// Logout route.
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("error", "You have been logged out")
    res.redirect("/campgrounds");
});

module.exports = router;