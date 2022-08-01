const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require("./models/comment")

const campground = [
    {
        name: "Lubango",
        Image: "https://www.tripsavvy.com/thmb/bgs4q9sNi1tpCA4iYTvF3QLNXGs=/1500x1000/filters:fill(auto,1)/GettyImages-508066351-5a12280d9e942700376da496.jpg",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). "
    },
    {
        name: "Benguela",
        Image: "https://www.lavacampground.com/images/Designer/ee9cdbfc-a2dc-413e-ab14-e103584f88c2.jpg",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). "
    },
    {
        name: "Kwanza Norte",
        Image: "https://www.planetware.com/wpimages/2020/08/canada-ontario-best-campgrounds-algonquin-provincial-park-fog.jpg",
        description: " "
    }
]
function seedDB() {
     Campground.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Campground Removed")
            // add a few campgrounds
            campground.forEach(function (campground) {
                Campground.create(campground, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a campground")
                        // create a comment
                        Comment.create({
                            text: "This is the best campground i ever seen",
                            author: "Homer"

                        }, function (err, comment) {
                            if (err) {
                                console.log(err)
                            } else {
                                campground.comments.push(comment)
                                campground.save()
                            }
                        })
                    }
                })
            })
        } 
    }) 
}
module.exports = seedDB;



