const express = require("express");
const { createRecipe, getRecipes, getRecipeByUser,deleteRecipe,likeRecipe } = require("../controllers/recipeContoller");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/create-recipe/:id", createRecipe);
router.get("/get-recipe/:id", getRecipeByUser);
router.get("/get-recipe", getRecipes);
router.delete("/delete-recipe/:id",deleteRecipe );
router.put("/like-recipe/:id",likeRecipe);
module.exports = router;
