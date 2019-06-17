var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var flash          = require("connect-flash");
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
var methodOverride = require("method-override");
var Hummus     = require("./models/rest"); 
var Comment        = require("./models/comment"); 
var User           = require("./models/user");
var seedDB         = require("./seeds");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    reviewRoutes = require("./routes/restaurant"), //tbc
    indexRoutes      = require("./routes/index");
    




// mongoose.connect(process.env.DATABASELOCAL, {useNewUrlParser: true}); 
// mongoose.connect("mongodb://username:password@ds013545.mlab.com:13545/hummusreviews", {useNewUrlParser: true}); 
//mongoose.connect("mongodb://localhost/hummusdeploy");
 var url = process.env.DATABASELOCAL || "mongodb://localhost/hummusdeploy" ; 
 mongoose.connect(url, {useNewUrlParser: true});
 //to add something like process.env.sensetivePassword => in the cmd line => export sensetivePassword=password


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
//seedDB();  //seeds the database

// PASSPORT
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!", //more info in the auth demo app
    resave: false,
    saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //encodes the session
passport.deserializeUser(User.deserializeUser()); //Un/de encode the session

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//Express router- linking to the other pages that show other routes
app.use(indexRoutes);
app.use(reviewRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The Hummus Server Has Started!"); 
});