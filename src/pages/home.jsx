import React, { useState, useEffect, memo, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaBell,
  FaBookmark,
  FaComment,
  FaHeart,
  FaRegHeart,
  FaShare,
} from "react-icons/fa";
import "../App.css";

const RecipeAPI = "http://localhost:5000/api/recipe/create-recipe";
const GetRecipeAPI = "http://localhost:5000/api/recipe/get-recipe";
const LikeRecipeAPI = (id) =>
  `http://localhost:5000/api/recipe/like-recipe/${id}`;
const UnLikeRecipeAPI = (id) =>
  `http://localhost:5000/api/recipe/unlike-recipe/${id}`;
const LOGGEDUSER_API = (userId) =>
  `http://localhost:5000/api/user/user/${userId}`;

const MemoizedLikes = memo(({ likes }) => {
  return (
    <>
      <FaHeart size={16} color="red" />
      <p className="text-sm">{likes}</p>
    </>
  );
});

const MemoizedRecipeCard = memo(({ recipe, handleLikeRecipe, isLiked }) => {
  const memoizedRecipeCard = useMemo(() => {
    return (
      <div
        key={recipe._id}
        className="border py-2 px-4 mb-4 rounded-[6px] bg-white"
      >
        <div className="flex flex-row space-x-2 items-center">
          <div className="p-6 rounded-full bg-gray-200" />
          <div className="flex flex-row items-center justify-between w-full">
            <div>
              <p className="text-sm font-medium">
                {recipe.createdBy?.name || "Null"}
              </p>
              <p className="text-[12px]">{recipe.timeSince}</p>
            </div>
            <div>
              <FaBookmark />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold">{recipe.title}</h3>
        <p>{recipe.description}</p>
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
    );
  }, [recipe._id, recipe.likes.length, isLiked[recipe._id]]);

  return memoizedRecipeCard;
});

const MemoizedRecipe = memo(({ recipes, handleLikeRecipe, isLiked }) => {
  return (
    <div className="mt-4">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <MemoizedRecipeCard
            key={recipe._id}
            recipe={recipe}
            handleLikeRecipe={handleLikeRecipe}
            isLiked={isLiked}
          />
        ))
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
});

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userIdToUse, setUserIdToUse] = useState(null);
  const [isLiked, setIsLiked] = useState({});

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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
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
      setUserIdToUse(userIdToUse);

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
      fetchUserData();
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const sortedRecipes = useMemo(() => {
    return [...recipes].sort(
      (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
    );
  }, [recipes]);

  const handleLikeRecipe = async (id) => {
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

        getRecipes();
      }
    } catch (error) {
      console.error("Error handling like/unlike recipe:", error);
    }
  };
  useEffect(() => {
    const storedIsLiked = JSON.parse(localStorage.getItem("isLiked")) || {};
    setIsLiked(storedIsLiked);

    getRecipes();
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full py-20 px-10">
      <div className="px-6">
        <MemoizedRecipe
          recipes={sortedRecipes}
          handleLikeRecipe={handleLikeRecipe}
          isLiked={isLiked}
        />
      </div>
    </div>
  );
};

export default Home;
