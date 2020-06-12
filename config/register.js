var bcrypt          = require('bcrypt'),
    passport        = require('passport'),
    Localstrategy   = require('passport-local').Strategy,
    User            = require('../models/user');

register = {}

passport.use("local-signup", new Localstrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        //If all fields match
        console.log("I'm here")
        let user = await User.findOne({email: email})
        //Return message if email already exists
        if(user) {
            console.log(user)
            return done(null,false)
        }
        //Create new user if email is not found
        let newUser = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(password, 10)
            })
        console.log("I FINISHED!")
        return done(null, {id: newUser.id})
}));

register.signupPage = (req,res,next) => {
    res.render("register")
};

register.signup = passport.authenticate('local-signup', {
    successRedirect: "/campgrounds",
    failureRedirect: "/register",
    failureFlash: true,
    successFlash:  {
        type: "success",
        message: "Welcome!"
    }
});

module.exports = register