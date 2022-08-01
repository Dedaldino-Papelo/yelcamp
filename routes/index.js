const express = require("express")
const router = express.Router();
const passport = require("passport")
const User = require("../models/user")

router.get("/", (req,res) => {
    res.render("campgrounds/landing")
})

//INDEX ROUTE



//AUTH ROUTES
router.get("/register", (req,res) => {
    res.render("campgrounds/register")
})

//Handlig the Register
router.post("/register", (req,res) => {
    const {username, password} = req.body
	User.register(new User({
		username: username
	}), password, (err,user) => {
		if (err) {
			// statement
			req.flash("error", err.message)
		} 
		passport.authenticate("Local")(req, res, () => {
			res.redirect("/login")
		})
	})
})

//Login Route
router.get("/login", (req,res) => {
    res.render("campgrounds/login")
})
//Handling the Login
router.post('/login', passport.authenticate('local', { 
    successRedirect: '/campgrounds',
    failureRedirect: '/login' 
    }), function(req, res) {    
});

//Logout
router.get("/logout", (req,res) => {
	req.logout()
	req.flash("success", "Logged you out")
	res.redirect("/login")
})

module.exports = router