var express         = require("express"),
    router          = express.Router(),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");

//=====================================================
// COMMENT ROUTES
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req,res) => {
    //find by id
    Campground.findById(req.params.id, (err,foundCampground) => {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground:foundCampground})
        }
    })
})

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req,res) => {
    //look up campground using Id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err)
            req.flash("error", "Sorry! Something went wrong!");
            res.redirect("/campgrounds")
        } else {
            //create new comment
            Comment.create(req.body.comment, (err,comment) => {
                if(err) {
                    console.log(err)
                } else {
                    //add user name + id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    //redirect to show page
                    req.flash("success", "Successfully added!")
                    res.redirect("/campgrounds/"+ foundCampground._id)
                }
            });
        }
    });
});

//Edit comment route
router.get("/campgrounds/:id/comments/:comment_id/edit",
    middleware.checkCommentAuth, (req,res) => {
    Comment.findById(req.params.comment_id, (err,foundComment) => {
        if(err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
        }
    })
})

router.put("/campgrounds/:id/comments/:comment_id", (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment) => {
        if(err){
            req.flash("err", "Something went wrong!")
            res.redirect("back")
        } else {
            req.flash("success", "Successfully edited your comment!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//delete comment
router.delete("/campgrounds/:id/comments/:comment_id",
     middleware.checkCommentAuth, (req,res) => {
    //find the id of comment & remove
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if(err){
            req.flash("err", "Something went wrong!")
            res.redirect("back")
        } else {
            req.flash("success","Deleted your comment!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router;