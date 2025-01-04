import React, { useState, useEffect, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
} from "react-icons/fa";
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

const MemoizedLikes = memo(({ likes }) => {
  return (
    <>
      <FaHeart size={16} color="red" />
      <p className="text-sm">{likes}</p>
    </>
  );
});

const MemoizedAddRecipeButton = memo(() => <AddRecipeButton />);

const timeSince = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const MemoizedLikedRecipes = memo(
  ({ userData, isLiked, handleLikeRecipe, isSaved, handleSaveRecipe }) => (
    <TabsContent value="likes">
      <div className="">
        {userData ? (
          userData.likedRecipes && userData.likedRecipes.length > 0 ? (
            userData.likedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="mb-4 bg-gray-100 px-4 py-2 border border-gray-200 rounded-md"
              >
                <div className="flex flex-row space-x-2">
                  <div className="p-6 bg-gray-200 rounded-full" />
                  <div className="flex justify-between w-full flex-row">
                    <div className="flex justify-center flex-col">
                      <p className="text-sm font-medium">
                        {typeof recipe.createdBy === "string"
                          ? recipe.createdBy
                          : recipe.createdBy?.name || "Unknown"}
                      </p>
                      <p className="text-xs">{timeSince(recipe?.createdOn)}</p>
                    </div>
                    <div>
                      {isSaved[recipe._id] ? (
                        <FaBookmark
                          onClick={() => handleSaveRecipe(recipe._id)}
                          color="yellow"
                          size={20}
                        />
                      ) : (
                        <>
                          <FaRegBookmark
                            onClick={() => handleSaveRecipe(recipe._id)}
                            size={20}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm">{recipe.description}</p>
                <div className="flex flex-row items-center space-x-1">
                  <MemoizedLikes likes={recipe.likes.length} />
                </div>
                <div className="flex flex-row justify-between px-20 pt-2 border-t-2 border-gray-200">
                  <div className="flex flex-row space-x-2 items-center">
                    {isLiked[recipe._id] ? (
                      <FaHeart
                        onClick={() => handleLikeRecipe(recipe._id)}
                        color="red"
                        size={20}
                      />
                    ) : (
                      <>
                        <FaRegHeart
                          onClick={() => handleLikeRecipe(recipe._id)}
                          size={20}
                        />
                        <p className="text-sm">Like</p>
                      </>
                    )}
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
            <p>No liked recipes found.</p>
          )
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </TabsContent>
  )
);
const MemoizedSavedRecipes = memo(
  ({ userData, isLiked, handleLikeRecipe, isSaved, handleSaveRecipe }) => (
    <TabsContent value="saved">
      <div className="">
        {userData ? (
          userData.savedRecipes && userData.savedRecipes.length > 0 ? (
            userData.savedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="mb-4 bg-gray-100 px-4 py-2 border border-gray-200 rounded-md"
              >
                <div className="flex flex-row space-x-2">
                  <div className="p-6 bg-gray-200 rounded-full" />
                  <div className="flex justify-between w-full flex-row">
                    <div className="flex justify-center flex-col">
                      <p className="text-sm font-medium">
                        {typeof recipe.createdBy === "string"
                          ? recipe.createdBy
                          : recipe.createdBy?.name || "Unknown"}
                      </p>
                      <p className="text-xs">{timeSince(recipe?.createdOn)}</p>
                    </div>
                    <div>
                      {isSaved[recipe._id] ? (
                        <FaBookmark
                          onClick={() => handleSaveRecipe(recipe._id)}
                          color="yellow"
                          size={20}
                        />
                      ) : (
                        <>
                          <FaRegBookmark
                            onClick={() => handleSaveRecipe(recipe._id)}
                            size={20}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm">{recipe.description}</p>
                <div className="flex flex-row items-center space-x-1">
                  <MemoizedLikes likes={recipe.likes.length} />
                </div>
                <div className="flex flex-row justify-between px-20 pt-2 border-t-2 border-gray-200">
                  <div className="flex flex-row space-x-2 items-center">
                    {isLiked[recipe._id] ? (
                      <FaHeart
                        onClick={() => handleLikeRecipe(recipe._id)}
                        color="red"
                        size={20}
                      />
                    ) : (
                      <>
                        <FaRegHeart
                          onClick={() => handleLikeRecipe(recipe._id)}
                          size={20}
                        />
                        <p className="text-sm">Like</p>
                      </>
                    )}
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
            <p>No Saved recipes found.</p>
          )
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </TabsContent>
  )
);

const MemoizedRecipeLists = memo(
  ({ recipes, handleLikeRecipe, isLiked, handleSaveRecipe, isSaved }) => (
    <TabsContent value="recipes" className="">
      <div className="flex justify-end items-end w-full pb-4">
        <MemoizedAddRecipeButton />
      </div>
      <div className="space-y-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              className="w-full border border-gray-200 px-4 py-2 rounded-md bg-gray-50"
              key={recipe._id}
            >
              <div className="flex flex-row space-x-2">
                <div className="p-6 bg-gray-200 rounded-full" />
                <div className="flex justify-between w-full flex-row">
                  <div>
                    <p className="text-sm font-medium">
                      {recipe.createdBy?.name || "Unknown"}
                    </p>
                    <p className="text-xs">{timeSince(recipe?.createdOn)}</p>
                  </div>
                  <div className="flex flex-row space-x-2 items-center">
                    {isSaved[recipe._id] ? (
                      <FaBookmark
                        onClick={() => handleSaveRecipe(recipe._id)}
                        color="yellow"
                        size={20}
                      />
                    ) : (
                      <>
                        <FaRegBookmark
                          onClick={() => handleSaveRecipe(recipe._id)}
                          size={20}
                        />
                      </>
                    )}

                    <RecipesMenubar recipeId={recipe._id} />
                  </div>
                </div>
              </div>
              <div className="px-2 py-4">
                <p className="text-lg font-medium">{recipe.title}</p>
                <p className="text-sm">{recipe.description}</p>
                <div>
                  <h3 className="text-md font-medium">Ingredients</h3>
                  <ul className="text-sm">
                    {Array.isArray(recipe.ingredients) &&
                      recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.name}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-md">Instructions</h3>
                  <ol>
                    {Array.isArray(recipe.instructions) &&
                      recipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm">
                          Step {index + 1}: {instruction.name}
                        </li>
                      ))}
                  </ol>
                </div>
                <div>
                  <ol className="flex flex-row space-x-2 pt-2">
                    {Array.isArray(recipe.tags) &&
                      recipe.tags.map((tags, index) => (
                        <li
                          key={index}
                          className="text-[10px] font-medium bg-gray-200 px-2 rounded-md"
                        >
                          {tags}
                        </li>
                      ))}
                  </ol>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-1">
                <MemoizedLikes likes={recipe.likes.length} />
              </div>
              <div className="flex flex-row justify-between px-20 pt-2 border-t-2 border-gray-200">
                <div className="flex flex-row space-x-2 items-center">
                  {isLiked[recipe._id] ? (
                    <FaHeart
                      onClick={() => handleLikeRecipe(recipe._id)}
                      color="red"
                      size={20}
                    />
                  ) : (
                    <>
                      <FaRegHeart
                        onClick={() => handleLikeRecipe(recipe._id)}
                        size={20}
                      />
                      <p className="text-sm">Like</p>
                    </>
                  )}
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
    </TabsContent>
  )
);

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [isLiked, setIsLiked] = useState({});
  const [isSaved, setIsSaved] = useState({});

  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;
  const RECIPEbyUSER_API = (id) =>
    `http://localhost:5000/api/recipe/get-recipe/${id}`;
  const LikeRecipeAPI = (id) =>
    `http://localhost:5000/api/recipe/like-recipe/${id}`;
  const UnLikeRecipeAPI = (id) =>
    `http://localhost:5000/api/recipe/unlike-recipe/${id}`;
  const saveRecipeAPI = (id) =>
    `http://localhost:5000/api/recipe/save-recipe/${id}`;
  const UnsaveRecipeAPI = (id) =>
    `http://localhost:5000/api/recipe/unsave-recipe/${id}`;

  const fetchRecipe = async (userIdToUse, token) => {
    try {
      const response = await axios.get(RECIPEbyUSER_API(userIdToUse), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipe(response.data);
    } catch (error) {
      console.error(
        "Error fetching recipe data:",
        error?.response?.data || error.message
      );
    }
  };

  const fetchUserData = async (userIdToUse, token) => {
    try {
      const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("userData", JSON.stringify(response.data));
      setUserData(response.data);
      console.log("Saved recipes:", response.data.savedRecipes);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error?.response?.data || error.message
      );
    }
  };

  const handleSaveRecipe = async (id) => {
    const token = localStorage.getItem("authToken");
    const userIdToUse = jwtDecode(token)?.userId;
    try {
      const response = isSaved[id]
        ? await axios.put(UnsaveRecipeAPI(id), { userId: userIdToUse })
        : await axios.put(saveRecipeAPI(id), { userId: userIdToUse });

      if (response.status === 200) {
        const updatedIsSaved = { ...isSaved, [id]: !isSaved[id] };
        localStorage.setItem("isSaved", JSON.stringify(updatedIsSaved));

        setIsSaved(updatedIsSaved);
        fetchRecipe(userIdToUse, token);
        fetchUserData(userIdToUse, token);
      }
    } catch (error) {
      console.error("Error handling like/unlike recipe:", error);
    }
  };
  useEffect(() => {
    const storedIsSaved = JSON.parse(localStorage.getItem("isSaved")) || {};
    setIsSaved(storedIsSaved);
  }, []);

  const handleLikeRecipe = async (id) => {
    const token = localStorage.getItem("authToken");
    const userIdToUse = jwtDecode(token)?.userId;

    if (!userIdToUse) {
      console.error("No user ID found.");
      return;
    }

    try {
      const response = isLiked[id]
        ? await axios.put(UnLikeRecipeAPI(id), { userId: userIdToUse })
        : await axios.put(LikeRecipeAPI(id), { userId: userIdToUse });

      if (response.status === 200) {
        const updatedIsLiked = { ...isLiked, [id]: !isLiked[id] };
        localStorage.setItem("isLiked", JSON.stringify(updatedIsLiked));
        setIsLiked(updatedIsLiked);
        fetchRecipe(userIdToUse, token);
        fetchUserData(userIdToUse, token);
      }
    } catch (error) {
      console.error("Error handling like/unlike recipe:", error);
    }
  };

  useEffect(() => {
    const storedIsLiked = JSON.parse(localStorage.getItem("isLiked")) || {};
    setIsLiked(storedIsLiked);
  }, []);

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
      const cachedUserData = JSON.parse(localStorage.getItem("userData"));
      if (cachedUserData) {
        setUserData(cachedUserData);
        console.log("Loaded user data from cache:", cachedUserData);
        fetchUserData(userIdToUse, token);
      } else {
        fetchUserData(userIdToUse, token);
      }

      fetchRecipe(userIdToUse, token);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }, []);

  const totalLikes = recipe.reduce(
    (sum, recipe) => sum + (recipe.likes?.length || 0),
    0
  );

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
        <div className="flex flex-row space-x-12 px-6">
          <h3 className="text-gray-500 font-medium">{userData?.following?.length || 0} Following</h3>
          <h3 className="text-gray-500 font-medium">{userData?.followers?.length || 0} Followers</h3>
          <h3 className="text-gray-500 font-medium">{totalLikes || 0} Likes</h3>
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
          <MemoizedRecipeLists
            recipes={sortedRecipes}
            handleLikeRecipe={handleLikeRecipe}
            isLiked={isLiked}
            isSaved={isSaved}
            handleSaveRecipe={handleSaveRecipe}
          />

          <MemoizedSavedRecipes
            userData={userData}
            isLiked={isLiked}
            handleLikeRecipe={handleLikeRecipe}
            isSaved={isSaved}
            handleSaveRecipe={handleSaveRecipe}
          />
          <MemoizedLikedRecipes
            userData={userData}
            isLiked={isLiked}
            handleLikeRecipe={handleLikeRecipe}
            isSaved={isSaved}
            handleSaveRecipe={handleSaveRecipe}
          />
        </Tabs>
      </div>
    </div>
  );
}
