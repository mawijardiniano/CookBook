const express = require("express");
const { createRecipe, getRecipes, getRecipeByUser } = require("../controllers/recipeContoller");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/create-recipe/:id", createRecipe);
router.get("/get-recipe/:id", getRecipeByUser)
router.get("/get-recipe", getRecipes);
module.exports = router;
