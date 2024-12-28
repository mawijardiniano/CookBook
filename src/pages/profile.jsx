import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaBookmark, FaPlus } from "react-icons/fa";
import AddRecipeButton from "../components/addRecipeButton";
import EditProfileButton from "../components/editProfileButton";

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

      const fetchRecipe = async () => {
        try {
          const response = await axios.get(RECIPEbyUSER_API(userIdToUse), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecipe(response.data);
          console.log("Recipe Data:", response.data);
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
          console.log("User Data:", response.data);
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


  return (
    <div className="py-28 px-12">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex flex-row space-x-6">
          <div className="p-16 rounded-full bg-gray-200"></div>
          <div className="flex flex-col justify-center space-y-2">
            <p className="font-bold text-xl">{userData?.name}</p>
            <EditProfileButton
              className="bg-gray-200 py-2 px-6 rounded-[5px] self-start"
            />
          </div>
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
          <TabsContent value="recipes" className="">
            <div className="flex justify-end items-end w-full pb-4">
              <AddRecipeButton />
            </div>
            <div className="space-y-4">
              {recipe.length > 0 ? (
                recipe.map((recipes) => (
                  <div className="w-full border border-gray-200 p-4 rounded-md bg-gray-50">
                    <div className="flex flex-row space-x-2">
                      <div className="p-6 bg-gray-200  rounded-full" />
                      <div className="flex justify-between w-full flex-row items-center">
                        <div>
                          <p className="text-sm font-medium">
                            {recipes.createdBy?.name}
                          </p>
                          <p className="text-xs">{recipes.timeSince}</p>
                        </div>
                        <div>
                          <FaBookmark />
                        </div>
                      </div>
                    </div>
                    <div key={recipe._id} className="px-2 py-4">
                      <p className="text-lg font-medium">{recipes.title}</p>
                      <p className="text-sm">{recipes.description}</p>
                      <div>
                        <h3 className="text-md font-medium">Ingredients</h3>
                        <p className="text-sm">
                          {recipes.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium text-md">Instructions</h3>
                        <ol>
                          {recipes.instructions.map((instruction, index) => (
                            <li key={index} className="text-sm">
                              Step {index + 1}: {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recipes found.</p>
              )}
            </div>
          </TabsContent>
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
