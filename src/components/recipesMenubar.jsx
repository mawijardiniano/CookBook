import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { SeparatorHorizontal, SeparatorHorizontalIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaEllipsisH, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import recipeTags from "../components/tags.json";

export function RecipesMenubar({ recipeId }) {
  const [recipeFormData, setRecipeFormData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    createdBy: "",
    tags: [],
  });

  const handleChange = (field) => (e) => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };
  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const navigate = useNavigate();

  const LOGGEDUSER_API = (id) => `${import.meta.env.LOGGEDUSER_API}${id}`;
  const DELETERECIPE_API = (id) =>
    `${import.meta.env.DELETERECIPE_API}${id}`;
  const RECIPEbyUSER_API = (id) =>
    `${import.meta.env.RECIPEbyUSER_API}${id}`;

  const handleEditClick = (recipeId) => {
    setSelectedRecipe(recipeId);
    const recipe = recipes.find((r) => r._id === recipeId);
    if (recipe) {
      setRecipeFormData({
        title: recipe.title || "",
        description: recipe.description || "",
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));

      if (!token) {
        console.warn("No token found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const userIdToUse = userId || storedGoogleUser?._id;

        if (!userIdToUse) {
          console.warn("No valid user ID found (neither decoded token nor Google User).");
          setLoading(false);
          return;
        }

        console.log("Using User ID:", userIdToUse);

        // Fetch user data
        if (storedGoogleUser) {
          setUserData(storedGoogleUser);
        } else {
          try {
            const userResponse = await axios.get(LOGGEDUSER_API(userIdToUse), {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUserData(userResponse.data);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        // Fetch recipes
        try {
          const recipesResponse = await axios.get(RECIPEbyUSER_API(userIdToUse), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecipes(recipesResponse.data);
          console.log("Fetched recipes:", recipesResponse.data);
        } catch (error) {
          console.error("Error fetching recipe data:", error?.response?.data || error.message);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    console.log("Deleting Recipe with ID:", recipeId);
    try {
      const response = await axios.delete(DELETERECIPE_API(recipeId));
      console.log("Deleted Recipe Response:", response.data);

      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  const handleAddIngredient = () => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, { name: "" }],
    }));
  };

  const handleRemoveIngredient = (index) => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      ingredients: prevData.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleChangeIngredient = (index, value) => {
    setRecipeFormData((prevData) => {
      const updatedIngredients = [...prevData.ingredients];
      if (value.trim() === "") {
        updatedIngredients.splice(index, 1);
      } else {
        updatedIngredients[index] = { name: value };
      }
      return { ...prevData, ingredients: updatedIngredients };
    });
  };

  const handleAddInstruction = () => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, { name: "" }],
    }));
  };

  const handleRemoveInstruction = (index) => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      instructions: prevData.instructions.filter((_, i) => i !== index),
    }));
  };

  const handleChangeInstruction = (index, value) => {
    setRecipeFormData((prevData) => {
      const updatedInstructions = [...prevData.instructions];
      if (value.trim() === "") {
        updatedInstructions.splice(index, 1);
      } else {
        updatedInstructions[index] = { name: value };
      }
      return { ...prevData, instructions: updatedInstructions };
    });
  };

  const handleAddTag = (tag) => {
    setRecipeFormData((prevData) => {
      if (!prevData.tags.includes(tag)) {
        return { ...prevData, tags: [...prevData.tags, tag] };
      }
      return prevData;
    });
  };

  const handleRemoveTag = (index) => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
   
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.userId || storedGoogleUser?._id;

    try {
      const response = await axios.post(ADDRECIPE_API(userId), {
        ...recipeFormData,
        createdBy: userId,
      });
      localStorage.setItem("recipes", JSON.stringify(response.data));
      console.log("Recipe added successfully:", response);
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      console.error(
        "Error adding recipe:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <FaEllipsisH className="text-gray-500" />
        </MenubarTrigger>
        <MenubarContent
          className="text-black border "
          style={{ backgroundColor: "white" }}
        >
          <Dialog>
            <DialogTrigger className="text-xs flex justify-center align-center w-full">
              Edit
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white max-h-[80vh] hide-scrollbar overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Recipe Name</Label>
                    <Input
                      id="title"
                      placeholder="Recipe Name"
                      value={recipeFormData.title}
                      onChange={handleChange("title")}
                      className="border border-slate-200 focus:border-black focus:outline-none w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description"
                      value={recipeFormData.description}
                      onChange={handleChange("description")}
                      className="border border-slate-200 focus:border-black focus:outline-none w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ingredients">Ingredients</Label>
                    <div className="space-y-2">
                      {recipeFormData.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder={`Ingredient ${index + 1}`}
                            value={ingredient.name}
                            onChange={(e) =>
                              handleChangeIngredient(index, e.target.value)
                            }
                            className="border border-slate-200 focus:border-black focus:outline-none w-full"
                          />
                          <FaTrash
                            size={16}
                            className="cursor-pointer text-red-500"
                            onClick={() => handleRemoveIngredient(index)}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="flex items-center space-x-1"
                        onClick={handleAddIngredient}
                      >
                        <FaPlus />
                        <span className="text-xs">Add Ingredient</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <div className="space-y-2">
                      {recipeFormData.instructions.map(
                        (instructions, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              placeholder={`Step ${index + 1}`}
                              value={instructions.name}
                              onChange={(e) =>
                                handleChangeInstruction(index, e.target.value)
                              }
                              className="border border-slate-200 focus:border-black focus:outline-none w-full"
                            />
                            <FaTrash
                              size={16}
                              className="cursor-pointer text-red-500"
                              onClick={() => handleRemoveInstruction(index)}
                            />
                          </div>
                        )
                      )}
                      <Button
                        type="button"
                        className="flex items-center space-x-1"
                        onClick={handleAddInstruction}
                      >
                        <FaPlus />
                        <span className="text-xs">Add Instruction</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap space-x-2">
                      {recipeTags.tags.map((tag, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="bg-gray-200 text-black px-2 py-1 rounded-2xl hover:bg-gray-300 text-xs mt-1"
                          disabled={recipeFormData.tags.includes(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-sm">
                        Selected Tags:
                      </span>
                      {recipeFormData.tags.length === 0 ? (
                        <span className="text-sm">No tags selected</span>
                      ) : (
                        <div className="flex flex-wrap space-x-2">
                          {recipeFormData.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 rounded-xl px-2 py-1  text-xs mt-1"
                            >
                              <span>{tag}</span>
                              <FaTrash
                                size={12}
                                className="cursor-pointer text-red-500"
                                onClick={() => handleRemoveTag(index)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-black text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Save Recipe
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <MenubarItem
            onClick={() => handleDeleteRecipe(recipeId)}
            style={{
              backgroundColor: "white",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
