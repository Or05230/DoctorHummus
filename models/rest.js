var mongoose = require("mongoose");
// SCHEMA SETUP
var hummusSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   rating: String,
   description: String,
   author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
      
   },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
       ]
        
});
//compiling hummusSchema into var Hummus :
module.exports = mongoose.model("Hummus", hummusSchema); 