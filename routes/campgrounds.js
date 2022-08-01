const express = require("express")
const router = express.Router();
const Campground = require("../models/campground")

//MIDDLEWARE VERIFY IF USER IS AUTHENTICATED
const isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		return next()
	} else {
        req.flash("error", "You need to be logged in to do that")
		res.redirect("/login")
	}
}

const CheckCampgroundOwner = (req,res,next) => {
    const { id } = req.params
      //Verify if user is authenticated
    if(req.isAuthenticated()){
        Campground.findById(id, (err, foundCampground) => {
            if(err){
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                //does the user own the campgrouns
                if(foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "Permission Denied")
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

router.get("/campgrounds", (req,res) => {
    //Get all Data from the Database
   Campground.find({}, function(err, campgrounds){
       if(err){
           console.log("Sorry, Try later", err)
       } else {
           res.render("campgrounds/index", {campgrounds: campgrounds})
       }
   })
})

//NEW ROUTE
router.get("/campgrounds/new", isLoggedIn, (req,res) => {
    res.render("campgrounds/new")
})

//CREATE ROUTE
router.post("/campgrounds", isLoggedIn, (req,res) => {
    const { name, Image, description, price } = req.body
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    //Create new Data and save to the Database
    Campground.create({
        name: name,
        Image: Image,
        description: description,
        author: author,
        price: price
    }, (err, campground) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    })
    
})

//SHOW ROUTE - shows more info about one data
router.get("/campgrounds/:id", (req,res) => {
    const { id } = req.params
   Campground.findById(id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err)
       } else {
        res.render("campgrounds/show", {campground:foundCampground})
       }
   })
})

//Edit Campground form
router.get("/campgrounds/:id/edit", CheckCampgroundOwner, (req,res) => {
    const { id } = req.params
    Campground.findById(id, (err, foundCampground) => {
        if(err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.render("campgrounds/edit", {campground: foundCampground })
        }
    })
})
//Handling the Edit
router.put("/campgrounds/:id",CheckCampgroundOwner, (req,res) => {
    //Find the Id from req.params
    const { id } = req.params
    let campground = {
        name:req.body.name,
        Image:req.body.Image,
        description:req.body.description,
        price: req.body.price
    }   
    //Update the campgrouns
    Campground.findByIdAndUpdate(id, campground, (err,UpdatedeCampground) => {
        if(err) {
            console.log(err)
            res.redirect("campgrounds")
        } else {
            res.redirect(`/campgrounds/${id}`)
        }
    })
})

//DESTROY Route
router.delete("/campgrounds/:id",CheckCampgroundOwner, (req,res) => {
    //find the Id
    const { id } = req.params
    Campground.findByIdAndRemove(id, (err) => {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})
module.exports = router