const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },
    }
  ],
  instructions: [
    {
      step: { type: String, required: true },
    }
  ],
  tags: [{ type: String }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  shares: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
