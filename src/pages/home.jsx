import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { FaBell, FaBookmark, FaComment, FaHeart, FaShare } from "react-icons/fa";
import "../App.css";
export default function Home() {
  const [query, setQuery] = useState("");
  const [account] = useState("Mawi");
  const [recipes, setRecipes] = useState([]);
  const time = "2 Hours";

  const RecipeAPI = "http://localhost:5000/api/recipe/create-recipe";
  const GetRecipeAPI = "http://localhost:5000/api/recipe/get-recipe";

  const getRecipes = async () => {
    try {
      const response = await axios.get(GetRecipeAPI);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);


  return (
    <div className="flex-1 flex flex-col w-full py-20 px-10">
      <div className="px-6">
        <div className="mt-4">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="border py-2 px-4 mb-4 rounded-[6px] bg-white"
              >
                <div className="flex flex-row space-x-2 items-center">
                  <div className="p-6 rounded-full bg-gray-200" />
                  <div className="flex flex-row items-center justify-between w-full">
                  <div>
                  <p className="text-sm font-medium">{recipe.createdBy?.name || "Null"}</p>
                  <p className="text-[12px]">{recipe.timeSince}</p>
                  </div>
                  <div>
                  <FaBookmark/>
                  </div>

                  </div>
                </div>
                <h3 className="text-xl font-semibold">{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="flex flex-row justify-between px-20 pt-2 border-t-2 border-gray-200">
                  <div className="flex flex-row space-x-2 items-center">
                    <FaHeart size={20} />
                    <p className="text-sm">Like</p>
                  </div>
                  <div className="flex flex-row space-x-2 items-center">
                    <FaComment size={20} />
                    <p className="text-sm">Comment</p>
                  </div>

                  <div className="flex flex-row space-x-2 items-center">
                    <FaShare size={20} />
                    <p className="text-sm">Share</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
