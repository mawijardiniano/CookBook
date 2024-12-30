import React, { useState, useEffect, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaBookmark, FaEllipsisH } from "react-icons/fa";
import AddRecipeButton from "../components/addRecipeButton";
import EditProfileButton from "../components/editProfileButton";
import { RecipesMenubar } from "../components/recipesMenubar";

const MemoizedUsername = memo(({ name }) => {
  return (
    <div className="flex flex-col justify-center space-y-2">
      <p className="font-bold text-xl">{name}</p>
      <EditProfileButton className="bg-gray-200 py-2 px-6 rounded-[5px] self-start" />
    </div>
  );
});

const MemoizedRecipeLists = memo(({ recipes }) => (
  <TabsContent value="recipes" className="">
    <div className="flex justify-end items-end w-full pb-4">
      <AddRecipeButton />
    </div>
    <div className="space-y-4">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div
            className="w-full border border-gray-200 p-4 rounded-md bg-gray-50"
            key={recipe._id}
          >
            <div className="flex flex-row space-x-2">
              <div className="p-6 bg-gray-200  rounded-full" />
              <div className="flex justify-between w-full flex-row">
                <div>
                  <p className="text-sm font-medium">
                    {recipe.createdBy?.name}
                  </p>
                  <p className="text-xs">{recipe.timeSince}</p>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <FaBookmark />
                  <RecipesMenubar recipeId={recipe._id} />
                </div>
              </div>
            </div>
            <div className="px-2 py-4">
              <p className="text-lg font-medium">{recipe.title}</p>
              <p className="text-sm">{recipe.description}</p>
              <div>
                <h3 className="text-md font-medium">Ingredients</h3>
                <p className="text-sm">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-md">Instructions</h3>
                <ol>
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm">
                      Step {index + 1}: {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div>{recipe.likes.length}</div>
          </div>
        ))
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  </TabsContent>
));

export default function Profile() {
  const [date, setDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [following, setFollowing] = useState(30);
  const [followers, setFollowers] = useState(100);
  const [likes, setLikes] = useState(19837);

  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;
  const RECIPEbyUSER_API = (id) =>
    `http://localhost:5000/api/recipe/get-recipe/${id}`;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));

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

      const fetchRecipe = async () => {
        try {
          const response = await axios.get(RECIPEbyUSER_API(userIdToUse), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecipe(response.data);
        } catch (error) {
          console.error(
            "Error fetching recipe data:",
            error?.response?.data || error.message
          );
        }
      };

      const fetchUserData = async () => {
        try {
          const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error?.response?.data || error.message
          );
        }
      };
      fetchRecipe();
      fetchUserData();
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }, []);

  const sortedRecipes = [...recipe].sort(
    (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
  );

  return (
    <div className="py-28 px-12">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex flex-row space-x-6">
          <div className="p-16 rounded-full bg-gray-200"></div>
          <MemoizedUsername name={userData?.name} />
        </div>
        <div className="flex flex-row space-x-20 px-6">
          <h3>{userData?.following || 0} Following</h3>
          <h3>{userData?.followers || 0} Followers</h3>
          <h3>{userData?.likes || 0} Likes</h3>
        </div>
      </div>
      <div className="px-6 py-10">
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="flex w-full">
            <TabsTrigger
              value="recipes"
              className="flex-1 text-center bg-gray-100 p-2"
            >
              Recipes
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex-1 text-center bg-gray-100 p-2"
            >
              Saved Recipes
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 text-center bg-gray-100 p-2"
            >
              Likes
            </TabsTrigger>
          </TabsList>
          <MemoizedRecipeLists recipes={sortedRecipes} />
          <TabsContent value="saved" className="p-4">
            Show saved recipes
          </TabsContent>
          <TabsContent value="likes" className="p-4">
            Show liked recipes.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
