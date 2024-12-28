const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        required: true,
      },
      following: {
        type: String,
      },
      followers: {
        type:String
      },
      likes: {
        type: String
      }

})
module.exports = mongoose.model("User", userSchema);