import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  FaBookReader,
  FaCog,
  FaBookmark,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaRegBookmark,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfileComponent = ({
  userData,
  totalLikes,
  recipe,
  handleLikeRecipe,
  isLiked,
  isSaved,
  handleSaveRecipe,
}) => {
  return (
    <div className="py-28 px-12">
      <div className="flex flex-row w-full space-x-6">
        <div className="p-16 bg-gray-200 rounded-full" />
        <div className="flex justify-center flex-col space-y-2">
          <UsernameProfile userData={userData} />
          <Buttons />
        </div>
      </div>
      <div className="py-6">
      <FollowingList userData={userData} totalLikes={totalLikes} />
      </div>
      <MemoizedRecipeLists
        recipes={recipe}
        handleLikeRecipe={handleLikeRecipe}
        isLiked={isLiked}
        isSaved={isSaved}
        handleSaveRecipe={handleSaveRecipe}
      />
    </div>
  );
};

const UsernameProfile = memo(({ userData }) => <p>{userData?.name}</p>);

const MemoizedLikes = memo(({ likes }) => {
  return (
    <>
      <FaHeart size={16} color="red" />
      <p className="text-sm">{likes}</p>
    </>
  );
});

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

const Buttons = memo(({}) => (
  <div className="flex space-x-4">
    <Button
      style={{ backgroundColor: "black" }}
      className=" text-white text-sm px-2 rounded-md"
    >
      Follow
    </Button>
    <Button
      style={{ backgroundColor: "black" }}
      className=" text-white text-sm px-3  rounded-md"
    >
      Message
    </Button>
    <Menubar className="border ">
      <MenubarMenu>
        <MenubarTrigger>
          <FaCog />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Unfollow</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </div>
));

const MemoizedRecipeLists = memo(
  ({ recipes, handleLikeRecipe, isLiked, handleSaveRecipe, isSaved }) => (
    <div value="recipes" className="">
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
    </div>
  )
);

const FollowingList = memo(({ userData, totalLikes }) => (
  <div className="flex space-x-4">
    <p>{userData?.following.length || 0} Following </p>
    <p>{userData?.followers.length || 0} Followers </p>
    <p>{totalLikes || 0} Likes </p>
  </div>
));

const UsersProfile = () => {
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();
  const [recipe, setRecipe] = useState([]);
  const [isLiked, setIsLiked] = useState({});
  const [isSaved, setIsSaved] = useState({});
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

  const fetchRecipe = async (id) => {
    try {
      const response = await axios.get(RECIPEbyUSER_API(userId));
      setRecipe(response.data);
    } catch (error) {
      console.error(
        "Error fetching recipe data:",
        error?.response?.data || error.message
      );
    }
  };

  const USERPROFILE_API = (id) =>
    `http://localhost:5000/api/user/profile/${id}`;

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(USERPROFILE_API(userId));
      setUserData(response.data);
      console.log("User data:", response.data);
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
    if (userId) {
      console.log("Using User ID:", userId);
      fetchUserData(userId);
      fetchRecipe(userId);
    }
  }, [userId]);

  const totalLikes = recipe.reduce(
    (sum, recipe) => sum + (recipe.likes?.length || 0),
    0
  );

  const sortedRecipes = [...recipe].sort(
    (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
  );

  return (
    <ProfileComponent
      userData={userData}
      totalLikes={totalLikes}
      recipe={sortedRecipes}
      isLiked={isLiked}
      isSaved={isSaved}
      handleLikeRecipe={handleLikeRecipe}
      handleSaveRecipe={handleSaveRecipe}
    />
  );
};

export default UsersProfile;
