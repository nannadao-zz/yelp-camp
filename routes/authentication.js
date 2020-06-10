var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user");

//===========================================
//AUTHENTICATION ROUTES

router.get("/", (req,res) => {
    res.render("landing")
})

//show register form
router.get("/register", (req,res) => {
    res.render("register")
})

router.post("/register", (req,res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err,user) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, () => {
            req.flash("success", "Welcome, " + user.username + " !")
            res.redirect("/campgrounds")
        });
    });
});

//LOGIN ROUTES
router.get("/login", (req,res) => {
    res.render("login")
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
}), (req,res) => {
})

//LOGOUT ROUTES
router.get("/logout", (req,res) => {
    req.logout();
    req.flash("success", "Logged Out!")
    res.redirect("/campgrounds")
})

module.exports = router;