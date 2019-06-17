var express = require("express");
var router  = express.Router({mergeParams: true});
var Hummus    = require("../models/rest");
var Comment    = require("../models/comment");
var middleware    = require("../middleware/index.js");
//Campground = Hummus
//checkCampgroundOwnership = checkReviewOwnership
//foundCampground = foundHummus
//allCampgrounds = allHummus
//newCampground = newReview

// COMMENTS ROUTES

//Comments New
router.get("/restaurant/:id/comments/new", middleware.isLoggedIn, function(req, res){//isloggedIn will check if he loggedin
    // find campground by id
    Hummus.findById(req.params.id, function(err, hummus){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {hummus: hummus});
        }
    });
    
});

//Comments Create
router.post("/restaurant/:id/comments", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Hummus.findById(req.params.id, function(err, hummus){
       if(err){
           req.flash("error", "משהו השתבש");
       console.log(err);
        res.redirect("/restaurant");
       } else { 
         Comment.create(req.body.comment, function(err, comment){
             if(err){
                 console.log(err);
             } else {
                 //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save comment
                 comment.save();
                 hummus.comments.push(comment);
                 hummus.save();
                 req.flash("success", "התגובה נוספה");
                 res.redirect("/restaurant/" + hummus._id);
             }
         });
       }
   }
   );
   //create new comment
   //connect new comment to campground
   //redirect to campground show page
});


// Comments EDIT route
router.get("/restaurant/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
           res.redirect("back");
        } else {
            res.render("comments/edit", {hummus_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment UPDATE
router.put("/restaurant/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("Back");
       } else {
           req.flash("success", " התגובה נערכה");
           res.redirect("/restaurant/" + req.params.id );
       }
   });
});

//Comment DESTROY route
router.delete("/restaurant/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("Back");
        } else {
            req.flash("success", "התגובה נמחקה");
            res.redirect("/restaurant/" + req.params.id);
        }
    });
});



module.exports = router;