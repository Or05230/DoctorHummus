var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//root route
router.get("/", function(req,res){
    res.render("landing");
});



// Authentication ROUTES


//show register form
router.get("/register", function(req, res){
    res.render("register");
});


//handling user signup
router.post("/register", function(req, res){
     var newUser = new User({username: req.body.username});
     if(req.body.adminCode === 'secretcode123') {
         newUser.isAdmin = true;
     }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
          return res.render("register", {"error": err.message});
        }  else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Doctor Hummus " + user.username);
                res.redirect("/restaurant");
            });
            }
    });
});


// LOGIN ROUTES

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

// login logic
//middleware = app.post ("/login", middleware, callback)
router.post("/login",passport.authenticate("local", {
    successRedirect: "/restaurant",
    failureRedirect: "/login"
}), function(req, res){
});


//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "התנתקת בהצלחה");
    res.redirect("/restaurant");
});

router.get("/googlef4c4a66fca08dcbb.html", function(req, res){
    res.render("/googlef4c4a66fca08dcbb.html");
});

module.exports = router;