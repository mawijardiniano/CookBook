const Recipe = require("../models/recipe");
const User = require("../models/user");

const timeSince = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, tags } = req.body;
  const userId = req.params.id;

  try {
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      tags, 
      createdBy: userId,
    });

    await recipe.save();


    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecipeByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const recipes = await Recipe.find({ createdBy: id }).populate({
      path: "createdBy",
      select: "name",
    });
    const recipesWithTimeSince = recipes.map((recipe) => ({
      ...recipe.toObject(),
      timeSince: timeSince(recipe.createdOn),
    }));
    res.json(recipesWithTimeSince);
  } catch (error) {}
};

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate({
      path: "createdBy",
      select: "name",
    });
    const recipesWithTimeSince = recipes.map((recipe) => ({
      ...recipe.toObject(),
      timeSince: timeSince(recipe.createdOn),
    }));
    res.status(200).json(recipesWithTimeSince);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const editRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions, tags } = req.body;
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { title, description, ingredients, instructions, tags },
      { new: true }
    );
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    res.json(recipe);
  } catch (error) {}
};

const likeRecipe = async (req, res) => {
  const { id } = req.params;
  const {userId} = req.body;
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, likes: { $ne: userId } }, 
      {
        $addToSet: { likes: userId },
      },
      { new: true } 
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or already liked' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { likedRecipes: id } },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {}
};

const unlikeRecipe = async (req, res) => {
  const { id } = req.params;
  const {userId} = req.body;
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { 
        _id :id }, 
      {
        $pull: { likes: userId },
      },
      { new: true } 
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or already liked' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { likedRecipes: id } },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {}
};


const saveRecipe = async (req, res) => {
  const { id } = req.params;
  const {userId} = req.body;
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, saved: { $ne: userId } }, 
      {
        $addToSet: { saved: userId },
      },
      { new: true } 
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or already liked' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedRecipes: id } },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {}
};

const unSaveRecipe = async (req, res) => {
  const { id } = req.params;
  const {userId} = req.body;
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { 
        _id :id }, 
      {
        $pull: { saved: userId },
      },
      { new: true } 
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or already liked' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedRecipes: id } },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {}
};


const Comment = async (req, res) => {
  const { id } = req.params; 
  const { user, text } = req.body;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const newComment = {
      user,
      text,
    };

    recipe.comments.push(newComment);
    await recipe.save();

    res.status(201).json({ message: "Comment added successfully.", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { createRecipe, getRecipes, getRecipeByUser, deleteRecipe,likeRecipe,unlikeRecipe, saveRecipe, unSaveRecipe, editRecipe, Comment };
