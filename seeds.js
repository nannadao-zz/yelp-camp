var moongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

const campgroundsList = [
    {
        name: "Cloud 9",
        image: "https://colorado-springs.s3.amazonaws.com/CMS/2560/camping__wysiwyg.jpeg",
        description: "The camping welcomes you with there 90 pitches including 13 accommodation on a terrain of more than 3 hectares of land and terraces. Caravans and motorhomes are welcome and will have a place on the lower part of the campsite, the upper part is not being accessible to campers and large vehicles. All the spots have a 10 A electrical hook-up (for some of you, make sure having an extension cord)."
    },
    {
        name: "Forrest Gump",
        image: "https://q-cf.bstatic.com/images/hotel/max1024x768/176/176776570.jpg",
        description: "The camping welcomes you with there 90 pitches including 13 accommodation on a terrain of more than 3 hectares of land and terraces. Caravans and motorhomes are welcome and will have a place on the lower part of the campsite, the upper part is not being accessible to campers and large vehicles. All the spots have a 10 A electrical hook-up (for some of you, make sure having an extension cord)."
    },
    {
        name: "Aurora",
        image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/70/2d/46.jpg",
        description: "The camping welcomes you with there 90 pitches including 13 accommodation on a terrain of more than 3 hectares of land and terraces. Caravans and motorhomes are welcome and will have a place on the lower part of the campsite, the upper part is not being accessible to campers and large vehicles. All the spots have a 10 A electrical hook-up (for some of you, make sure having an extension cord)."
    }
]

function seedDB(){
    //Remove all Campgrounds
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err)
         }
        console.log("Removed campgrounds!")
        });
    //TO DO: DELETE COMMENT TOO...BUT NEED TO USE ASYNC
    //add campground
    campgroundsList.forEach(campground => {
        Campground.create(campground, (err,createdCampground) => {
            if(err){
                console.log(err)
            } else {
                console.log("Added campground")
                //create comment
                Comment.create(
                    {
                    text: "There is no mobile data",
                    author: "Voldemort"
                }, (err,comment) => {
                    if(err){
                        console.log(err)
                    } else {
                        createdCampground.comments.push(comment);
                        createdCampground.save();
                        console.log("Created new comment")
                    }
                })
            }
        });
    });
}

module.exports = seedDB;
