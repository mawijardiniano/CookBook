const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  instructions: [{
    type: String,
    required: true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    }
  }],
  shares: {
    type: Number,
    default: 0,
  },
  saved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
