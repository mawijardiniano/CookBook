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
import { FaPlus } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ADDRECIPE_API = (id) =>
  `http://localhost:5000/api/recipe/create-recipe/${id}`;
const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;


const AddRecipeButton = () => {
  const [recipeFormData, setRecipeFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    createdBy: "",
    tags: "",
  });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const handleChange = (field) => (e) => {
    setRecipeFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Retrieved Token:", token);

    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
    console.log("Retrieved Google User:", storedGoogleUser);

    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId;
      const userIdToUse = userId || storedGoogleUser?._id;

      if (!userIdToUse) {
        console.warn(
          "No valid user ID found (neither decoded token nor Google User)."
        );
        return;
      }

      console.log("Using User ID:", userIdToUse);

      const fetchUserData = async () => {
        try {
          const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          console.log("User Data:", response.data);
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error?.response?.data || error.message
          );
        }
      };
      fetchUserData();
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }, []);

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("authToken");
    console.log("Retrieved Token:", token);

    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
    console.log("Retrieved Google User:", storedGoogleUser);

    if (!token) {
      console.log("No token found");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.userId;
    const userIdToUse = userId || storedGoogleUser?._id;
    console.log("User ID to use:", userIdToUse);
    try {
      const response = await axios.post(ADDRECIPE_API(userIdToUse), {
        title: recipeFormData.title,
        description: recipeFormData.description,
        ingredients: recipeFormData.ingredients,
        instructions: recipeFormData.instructions,
        createdBy: userIdToUse,
        tags: recipeFormData.tags,
      });

      console.log("Recipe added successfully:", response);
      navigate("/profile");
    } catch (error) {
      console.error(
        "Error adding recipe:",
        error?.response?.data || error.message
      );
    }
  };

  const MemoizedHeader = memo(() => (
    <DialogHeader>
      <DialogTitle>Add Recipe</DialogTitle>
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
      <DialogContent className="sm:max-w-[425px] bg-white">
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
              <Input
                id="ingredients"
                placeholder="Ingredients"
                value={recipeFormData.ingredients}
                onChange={handleChange("ingredients")}
                className="border border-slate-200 focus:border-black focus:outline-none w-full"
              />
            </div>

            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Input
                id="instructions"
                placeholder="Instructions"
                value={recipeFormData.instructions}
                onChange={handleChange("instructions")}
                className="border border-slate-200 focus:border-black focus:outline-none w-full"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Tags"
                value={recipeFormData.tags}
                onChange={handleChange("tags")}
                className="border border-slate-200 focus:border-black focus:outline-none w-full"
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save Recipe</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeButton;
