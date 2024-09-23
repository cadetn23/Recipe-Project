const { mongoose } = require('../db');




// Schema for users 

const UserSchema = new mongoose.Schema({
    // Require unique username
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // Require a unique email , stores ity in lowercase
    email: {
      type: String,
      required: true,
      unique: true,
    
    },
    // Require a password with a min. length of 8 char.
    password: {
      type: String,
      required: true,
      minlength: 8
    }
  });
  
  // Export User model
  module.exports = mongoose.model("User", UserSchema);