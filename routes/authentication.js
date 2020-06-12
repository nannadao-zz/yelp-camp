var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    Localstrategy = require("passport-local"),
    bcrypt          = require('bcrypt'),
    User       = require("../models/user"),
    authorize  = require("../config/authorize");

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
    const {name,email,password,password2} = req.body
    let errors = [];
    if (name.length < 3) {
        errors.push({message: "Name is too short"})
    }
    if (password.length < 6) {
        errors.push({message: "Password must contain at least 6 characters"})
    }
    if (password !== password2) {
        errors.push({message: "Passwords are not match"})
    }
    if (errors.length > 0) {
        res.render("register",
        {
            errors,
            name,
            email,
        }
        )
    }
    else {
        User.findOne({email:email})
       .then (user => {
           if(user) {
           errors.push({message: "Email is already registered"});
           res.render("register", {errors,name,email})
        }  else {
            bcrypt.hash(req.body.password, 10, (err,hash) => {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })
                .then (err => {
                    if(err) {
                        console.log(err)
                    }
                    req.flash("success", "Welcome, " + name + " !")
                    res.redirect("/campgrounds")
                })
            })
        }
        }) 
    }
})

//LOGIN ROUTES
router.get("/login", authorize.loginPage)

router.post("/login", authorize.login)

//LOGOUT ROUTES
router.get("/logout", authorize.logout)

module.exports = router;