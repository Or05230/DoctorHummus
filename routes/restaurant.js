var express = require("express");
var router  = express.Router();
var Hummus    = require("../models/rest");
var middleware    = require("../middleware/index.js");
//Campground = Hummus
//checkCampgroundOwnership = checkReviewOwnership
//foundCampground = foundHummus
//allCampgrounds = allHummus
//newCampground = newReview



// INDEX - SHOW ALL CAMPGROUNDS
router.get("/restaurant", function(req, res){
   //Get all campgrounds from DB
   Hummus.find({}, function(err, allHummus){
       if(err){
           console.log(err);
           
       } else {
             res.render("createrest/index", {hummus: allHummus,});
       }
       
   });
});

router.get("/designer", function(req, res){
    res.render("designer");
});

// CREATE - ADD NEW CAMPGROUND TO THE DB
router.post("/restaurant", middleware.isLoggedIn, function(req, res){ //can be identical to get route since post & get are different
    
    
    //get data from form and add to campgrounds array
   var name = req.body.name ; 
   var price = req.body.price;
    var image = req.body.image ;
    var rating = req.body.rating ;
    var desc = req.body.description ; //names after "Body" taken from "name" attribute in new.ejs 
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newReview = {name: name, price: price, image: image, rating: rating, description: desc, author: author};
    //create a new campground and save to DB 
    Hummus.create(newReview, function(err, newlyCreated){
        if(err){
        console.log(err);
        } else {
            res.redirect("/restaurant");
        }
    });   
});


// NEW - Show form to create new campground
router.get("/createrest/new", middleware.isLoggedIn, function(req,res){
   res.render("createrest/new");
    
});


//SHOW - Shows more info about one campgorund
router.get("/restaurant/:id", function(req,res){
    //find the campground with provided ID
    Hummus.findById(req.params.id).populate("comments").exec(function(err, foundHummus){
        if(err){
            console.log(err);
            
        } else {
            console.log(foundHummus);
               //render show template with that campground
                res.render("createrest/show", {hummus: foundHummus});
        }
    });
  
});

// EDIT CAMPGROUND ROUTE
router.get("/restaurant/:id/edit", middleware.checkReviewOwnership, function(req, res){
        Hummus.findById(req.params.id, function(err, foundHummus){
            if(err){
                res.redirect("/restaurant");
            } else
            
              res.render("createrest/edit", {hummus: foundHummus});
        });
});

// UPDATE CAMPGROUND ROUTE
router.put("/restaurant/:id", middleware.checkReviewOwnership, function(req, res){
    //find and update the correct campground
    Hummus.findByIdAndUpdate(req.params.id, req.body.hummus, function(err, updatedReview){
        if(err){
            res.redirect("/restaurant");
        } else {
             //redirect somewhere(Show page)
             req.flash("success", "הביקורת נערכה");
            res.redirect("/restaurant/" + req.params.id);
        }
    });
   
});

// DESTROY CAMPGROUND ROUTE
router.delete("/restaurant/:id", middleware.checkReviewOwnership, function(req, res){
    Hummus.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurant");
        } else {
            req.flash("success", "הביקורת נמחקה");
            res.redirect("/restaurant");
        }
    });
});




module.exports = router;