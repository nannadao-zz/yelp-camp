var express         = require("express"),
    router          = express.Router(),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");

//=====================================
//CAMPGROUNDS ROUTES (INDEX)
router.get("/campgrounds", (req,res) => {
    //Get campgrounds from DB
    Campground.find({}, (err,allCampgrounds) => {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user})
        }
    });
});

//Create a new campground
router.post("/campgrounds", middleware.isLoggedIn, (req,res) => {
    //get data from a form & add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image:image, description:desc, author:author};
    // Create new campground & save in DB
    Campground.create(newCampground, (err,newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds
            console.log(newlyCreated.toObject())
            res.redirect("/campgrounds");
        }
    });
});

//Show a form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req,res) => {
    res.render("campgrounds/new")
});

//Show detailed view of a campground
router.get("/campgrounds/:id", (req,res) => {
    //find campground with provided ID + reach its comments db
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground.toObject())
            res.render("campgrounds/show", {campground: foundCampground});
        }
        });
});

//Edit
router.get("/campgrounds/:id/edit", middleware.checkCampgroundAuth, (req,res) => {
    Campground.findById(req.params.id, (err,foundCampground) => {
        res.render("campgrounds/edit", {campground:foundCampground})
    })
});

//Update
router.put("/campgrounds/:id", (req,res) => {
    //find & update the requested campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,foundCampground) => {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            //redirect to show page of the id
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//Delete
router.delete("/campgrounds/:id", middleware.checkCampgroundAuth, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err,foundCampground) => {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            req.flash("success", "Deleted!")
            res.redirect("/campgrounds")
        }
    });
});

module.exports = router;