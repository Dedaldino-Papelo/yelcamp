const express = require("express")
const router = express.Router();
const Campground = require("../models/campground")
const Comment = require("../models/comment")

//MIDDLEWARE VERIFY IF USER IS AUTHENTICATED
const isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		return next()
	} else {
        req.flash("error", "You need to be logged in to do that")
		res.redirect("/login")
	}
}
//Check the ownerShip
const CheckCommentOwner = (req,res,next) => {
    const { id, comment_id } = req.params
      //Verify if user is authenticated
    if(req.isAuthenticated()){
        Comment.findById(comment_id, (err, foundComment) => {
            if(err){
                res.redirect("back")
            } else {
                //does the user own the comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

//Comments Routes
router.get("/campgrounds/:id/comment/new", isLoggedIn, (req,res) => {
    //Find Campground By Id
    const { id } = req.params
    Campground.findById(id, (err,foundCampground) => {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: foundCampground})
            
        }
    })
})

router.post("/campgrounds/:id/comments",isLoggedIn,(req,res) => {
     //Find Campground By Id
     const { id } = req.params
     const { text, author } = req.body 
     Campground.findById(id, (err,campground) => {
         if(err) {
             res.redirect("/campgrounds")
         } else {
            Comment.create({
                text: text,
                author: author
            }, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.username = req.user.username
                    comment.author.id = req.user._id
                    //save comment
                    comment.save();
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success", "Successfully added comment")
                    res.redirect(`/campgrounds/${id}`)
                }
            })
         }
     })
})

//Comment Edit Route
router.get("/campgrounds/:id/comment/:comment_id/edit", CheckCommentOwner, (req,res) => {
    const { id, comment_id } = req.params
    Comment.findById(comment_id, (err, foundComment) => {
        if(err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.render("comments/edit", {campground_id: id, comment: foundComment})
        }
    })
})
//Comment Update
router.put("/campgrounds/:id/comment/:comment_id",CheckCommentOwner, (req,res) => {
    const { id, comment_id } = req.params
    let comment = {
        text:req.body.comment,
    }
    Comment.findByIdAndUpdate(comment_id, comment, (err, UpdateComment) => {
        if(err) {
            console.log(err)
            res.redirect("back")
        } else {
            req.flash("success", "Comment Updated")
            res.redirect(`/campgrounds/${id}`)
        }
    })
   
})

//Handling Comment Destroy Route
router.delete("/campgrounds/:id/comment/:comment_id", CheckCommentOwner, (req, res) => {
    const { id, comment_id } = req.params
    Comment.findByIdAndRemove(comment_id, (err) => {
        if(err){
            console.log(err)
            res.redirect("back")
        } else {
            req.flash("success", "Comment Deleted")
            res.redirect(`/campgrounds/${id}`)
        }
    })
})


module.exports = router