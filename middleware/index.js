//all the middleware goes here
var middlewareObj = {};
var Hummus    = require("../models/rest");
var Comment    = require("../models/comment");
//Campground = Hummus
//checkCampgroundOwnership = checkReviewOwnership
//foundCampground = foundHummus
//newCampground = newReview


middlewareObj.checkReviewOwnership = function(req, res, next){
      if(req.isAuthenticated()){
        Hummus.findById(req.params.id, function(err, foundHummus){
        if(err){
            req.flash("error", "ביקורת לא נמצאה");
            res.redirect("back");
        } else {
            //does user own the campground?
            if(foundHummus.author.id.equals(req.user._id) || req.user.isAdmin){
              next();
            } else {
                req.flash("error", "אין לך הרשאות לפעולה זו");
                res.redirect("back");
            }
        }
        });
         } else {
             req.flash("error", "לביצוע הפעולה עליך להיות מחובר");
        res.redirect("back"); //takes the user 1page back
    }
};



middlewareObj.checkCommentOwnership = function(req, res, next){
      if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            //does user own the Comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
              next();
            } else {
                req.flash("error", "אין לך הרשאות לפעולה זו");
                res.redirect("back");
            }
        }
        });
         } else {
             req.flash("error", "לביצוע הפעולה עליך להיות מחובר");
        res.redirect("back"); //takes the user 1page back
    }

};

//the following route will check if the user is logged in, if not he won't let him comment //middleware
middlewareObj.isLoggedIn = function(req, res, next){  //NEXT aka KEEPGOING
   if(req.isAuthenticated()){   // aka if the user is logged in
       return next();
    }
    req.flash("error", "לביצוע הפעולה עליך להיות מחובר");
    res.redirect("/login");   //in case he failed to login.
};



module.exports = middlewareObj ;