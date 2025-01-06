import React, { useState, useEffect, memo, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaBell,
  FaBookmark,
  FaComment,
  FaHeart,
  FaRegBookmark,
  FaRegHeart,
  FaShare,
} from "react-icons/fa";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";


const RecipeAPI = "http://localhost:5000/api/recipe/create-recipe";
const GetRecipeAPI = "http://localhost:5000/api/recipe/get-recipe";
const LikeRecipeAPI = (id) =>
  `http://localhost:5000/api/recipe/like-recipe/${id}`;
const UnLikeRecipeAPI = (id) =>
  `http://localhost:5000/api/recipe/unlike-recipe/${id}`;
const LOGGEDUSER_API = (userId) =>
  `http://localhost:5000/api/user/user/${userId}`;
const saveRecipeAPI = (id) =>
  `http://localhost:5000/api/recipe/save-recipe/${id}`;
const UnsaveRecipeAPI = (id) =>
  `http://localhost:5000/api/recipe/unsave-recipe/${id}`;

const MemoizedLikes = memo(({ likes }) => {
  return (
    <>
      <FaHeart size={16} color="red" />
      <p className="text-sm">{likes}</p>
    </>
  );
});

const MemoizedRecipeCard = memo(
  ({
    recipe,
    handleLikeRecipe,
    handleSaveRecipe,
    handleViewProfile,
    isSaved,
    isLiked,
  }) => {
    const memoizedRecipeCard = useMemo(() => {
      const following_id = recipe.createdBy?._id;
      console.log("followingId", following_id);
      return (
        <div
          key={recipe._id}
          className="border py-2 px-4 mb-4 rounded-[6px] bg-gray-100"
        >
          <div className="flex flex-row space-x-2 items-center">
            <div className="p-6 rounded-full bg-gray-200" />
            <div className="flex flex-row items-center justify-between w-full">
              <div>
                <p
                  className="text-sm font-medium"
                  onClick={() => handleViewProfile(following_id)}
                >
                  {recipe.createdBy?.name || "Null"}
                </p>
                <p className="text-[12px]">{recipe.timeSince}</p>
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
          <h3 className="text-xl font-semibold">{recipe.title}</h3>
          <p>{recipe.description}</p>
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
            <ol className="flex flex-row space-x-2 py-2">
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
          <div className="flex flex-row items-center space-x-1">
            <MemoizedLikes likes={recipe.likes.length} />
          </div>
          <div className="flex flex-row justify-between px-20 pt-2 border-t-2 pb-2 border-gray-200">
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
          <div className="border-t-2 border-gray-200 ">
          <div className="flex flex-col py-2">
  {Array.isArray(recipe.comments) &&
    recipe.comments.map((comment, index) => (
      <div
        key={index}
        className="flex flex-col py-1 px-4 bg-gray-200 rounded-md mb-1"
      >
        <p className="text-xs font-medium text-gray-800">{comment.user}</p>
        <p className="text-xs text-gray-600">{comment.text}</p>
      </div>
    ))}
</div>

          </div>
          <Input
              placeholder="Add a comment"
              />
        </div>
      );
    }, [
      recipe._id,
      recipe.likes.length,
      isSaved[recipe._id],
      isLiked[recipe._id],
    ]);

    return memoizedRecipeCard;
  }
);

const MemoizedRecipe = memo(
  ({
    recipes,
    handleLikeRecipe,
    handleViewProfile,
    handleSaveRecipe,
    isSaved,
    isLiked,
  }) => {
    return (
      <div className="mt-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <MemoizedRecipeCard
              key={recipe._id}
              recipe={recipe}
              handleViewProfile={handleViewProfile}
              handleLikeRecipe={handleLikeRecipe}
              handleSaveRecipe={handleSaveRecipe}
              isLiked={isLiked}
              isSaved={isSaved}
            />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    );
  }
);

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userIdToUse, setUserIdToUse] = useState(null);
  const [isLiked, setIsLiked] = useState({});
  const [isSaved, setIsSaved] = useState({});
  const navigate = useNavigate();

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
        localStorage.setItem(
          `isLiked_${userIdToUse}`,
          JSON.stringify(updatedIsLiked)
        );

        setIsLiked(updatedIsLiked);

        getRecipes();
      }
    } catch (error) {
      console.error("Error handling like/unlike recipe:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userIdToUse = jwtDecode(token)?.userId;
    const storedIsLiked =
      JSON.parse(localStorage.getItem(`isLiked_${userIdToUse}`)) || {};
    setIsLiked(storedIsLiked);

    getRecipes();
  }, []);

  const handleSaveRecipe = async (id) => {
    if (!userIdToUse) {
      console.error("No user ID found.");
      return;
    }

    try {
      const response = isSaved[id]
        ? await axios.put(UnsaveRecipeAPI(id), { userId: userIdToUse })
        : await axios.put(saveRecipeAPI(id), { userId: userIdToUse });

      if (response.status === 200) {
        const updatedIsSaved = { ...isSaved, [id]: !isSaved[id] };
        localStorage.setItem(
          `isSaved_${userIdToUse}`,
          JSON.stringify(updatedIsSaved)
        );

        setIsSaved(updatedIsSaved);

        getRecipes();
      }
    } catch (error) {
      console.error("Error handling like/unlike recipe:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userIdToUse = jwtDecode(token)?.userId;
    const storedIsSaved =
      JSON.parse(localStorage.getItem(`isSaved_${userIdToUse}`)) || {};
    setIsSaved(storedIsSaved);

    getRecipes();
  }, []);

  const handleViewProfile = (userId) => {
    navigate(`/userprofile/${userId}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full py-20 px-10">
      <div className="px-6">
        <MemoizedRecipe
          handleViewProfile={handleViewProfile}
          recipes={sortedRecipes}
          handleLikeRecipe={handleLikeRecipe}
          handleSaveRecipe={handleSaveRecipe}
          isLiked={isLiked}
          isSaved={isSaved}
        />
      </div>
    </div>
  );
};

export default Home;
