const express = require("express");
const { createRecipe, getRecipes, getRecipeByUser,deleteRecipe,likeRecipe, unlikeRecipe, saveRecipe, unSaveRecipe, editRecipe } = require("../controllers/recipeContoller");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/create-recipe/:id", createRecipe);
router.get("/get-recipe/:id", getRecipeByUser);
router.get("/get-recipe", getRecipes);
router.delete("/delete-recipe/:id",deleteRecipe );
router.put("/update-recipe/:id", editRecipe);
router.put("/like-recipe/:id",likeRecipe);
router.put("/unlike-recipe/:id", unlikeRecipe);
router.put("/save-recipe/:id",saveRecipe);
router.put("/unsave-recipe/:id", unSaveRecipe);
module.exports = router;
