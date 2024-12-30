import React, { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import recipeTags from "../components/tags.json";

const ADDRECIPE_API = (id) =>
  `http://localhost:5000/api/recipe/create-recipe/${id}`;
const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;

const AddRecipeButton = () => {
  const [recipeFormData, setRecipeFormData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    createdBy: "",
    tags: [],
  });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));

    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId || storedGoogleUser?._id;

      if (!userId) return;

      const fetchUserData = async () => {
        try {
          const response = await axios.get(LOGGEDUSER_API(userId), {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error?.response?.data);
        }
      };
      fetchUserData();
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }, []);

  const handleChange = (field) => (e) => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
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
      console.log("Recipe added successfully:", response);

    } catch (error) {
      console.error("Error adding recipe:", error?.response?.data || error.message);
    }
  };

  const MemoizedHeader = memo(() => (
    <DialogHeader>
      <DialogTitle>Share your Recipe</DialogTitle>
      <DialogDescription>
        Fill in the details of your new recipe and click save when you're done.
      </DialogDescription>
    </DialogHeader>
  ));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white" style={{ backgroundColor: "black" }}>
          <FaPlus />
          Add Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white max-h-[80vh] hide-scrollbar overflow-y-auto">
        <MemoizedHeader />
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
                  <div key={index} className="flex items-center space-x-2">
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
                {recipeFormData.instructions.map((instructions, index) => (
                  <div key={index} className="flex items-center space-x-2">
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
                ))}
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
                <span className="font-semibold text-sm">Selected Tags:</span>
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
              <Button type="submit" className="bg-black text-white" style={{backgroundColor: "black"}}>
                Save Recipe
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeButton;
