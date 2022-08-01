const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose')
const Campground = require("./models/campground")
const Comment = require("./models/comment")
const User = require("./models/user")
const flash = require("connect-flash")
const seedDB = require("./seeds")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const campgroundsRoutes = require("./routes/campgrounds")
const commentRoutes = require("./routes/comments")
const indexRoutes = require("./routes/index")
const methodOverride = require("method-override")
const app = express();

// seedDB();
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
app.set("view engine", "ejs")

   //Connection to Mongoose
  //const uri = "mongodb://dedaldino:1998@cluster0-shard-00-00.kgdfm.mongodb.net:27017,cluster0-shard-00-01.kgdfm.mongodb.net:27017,cluster0-shard-00-02.kgdfm.mongodb.net:27017/yelpcampv5?ssl=true&replicaSet=atlas-dx8xin-shard-0&authSource=admin&retryWrites=true&w=majority"
  var connectionString = process.env.DATABASEURL || 'mongodb://localhost:27017/YelpDb_v5'
  mongoose.connect(connectionString)

//======== PASSPORT CONFIGURATION =====================
app.use(require('express-session')({
	secret: "Anything",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
})
//====================================================

app.use(indexRoutes)
app.use(campgroundsRoutes)
app.use(commentRoutes)



var port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server start listening`)
})
