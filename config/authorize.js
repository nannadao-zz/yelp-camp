var bcrypt          = require("bcrypt"),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    User            = require('../models/user');

var logInAndOut     = module.exports = {}

passport.use("local-login", new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req,email,password,done) => {
        //Check if email & password exist
        var user = await User.findOne({email:email})
        var correctPassword = user && bcrypt.compareSync(password, user.password)

        //if password is correct
        if (correctPassword) {
            console.log(req.params)
            return done(null, {id: user.id})
        }

        //if password is incorrest
        return done(null, false, {
            message: "Incorrect email or password"
        });
    }))

logInAndOut.loginPage = (req,res,next) => {
    res.render("login")
}

logInAndOut.login = passport.authenticate('local-login', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: {
        type: "error",
        message: "Incorrect email/password"
    },
    successFlash: {
        type: "success",
        message: "Welcome!"
    }
})

logInAndOut.logout = (req,res,next) => {
    req.logOut();
    req.flash("success", "Logged out successfully!");
    res.redirect("/campgrounds")
}