const Recipe = require("../models/recipe");
const User = require("../models/user");


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
    res.json(recipes)
  } catch (error) {
    
  }
}

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createRecipe, getRecipes,getRecipeByUser };
