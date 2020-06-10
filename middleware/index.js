var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");  
middlewareObj = {};

middlewareObj.checkCampgroundAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                req.flash("error", "Campground not found!")
                res.redirect("back")
        } else {
                //is the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied!")
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "Please Login!")
        res.redirect("back");
    }  
}

middlewareObj.checkCommentAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                req.flash("err", "Something went wrong!")
                res.redirect("back")
            } else {
                //is the user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied!")
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "Please log in!")
        res.redirect("/login"); /* COULD GO WRONG! */
    }  
}

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login!")
    res.redirect("/login")
}

module.exports = middlewareObj