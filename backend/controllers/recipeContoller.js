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
  const { title, description, ingredients, instructions } = req.body;
  const userId = req.params.id;
  try {
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      createdBy: userId,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipeByUser = async (req, res) => {
  try {
    const {id} = req.params 
    const recipes = await Recipe.find({createdBy: id}).populate({
      path: 'createdBy',
      select: 'name',
    });
    const recipesWithTimeSince = recipes.map((recipe) => ({
      ...recipe.toObject(),
      timeSince: timeSince(recipe.createdOn),
    }));
    res.json(recipesWithTimeSince)
  } catch (error) {
    
  }
}

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate({
      path: 'createdBy',
      select: 'name',
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

const deleteRecipe = async (req, res) => {
  try {
    const {id} = req.params
    const recipe = await Recipe.findByIdAndDelete(id)
    res.json(recipe);
  } catch (error) {
    
  }
}

module.exports = { createRecipe, getRecipes,getRecipeByUser,deleteRecipe };
