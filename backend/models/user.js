const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; 
    },
  },
  following: {
    type: String,
  },
  followers: {
    type: String,
  },
  likes: {
    type: String,
  },
});
module.exports = mongoose.model("User", userSchema);
