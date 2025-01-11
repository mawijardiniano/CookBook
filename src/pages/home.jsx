import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "../App.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
const GetCommentAPI = (recipeId) =>
  `http://localhost:5000/api/recipe/get-comments/${recipeId}`;
const CommentAPI = (recipeId) =>
  `http://localhost:5000/api/recipe/comment/${recipeId}`;

const MemoizedLikes = memo(({ likes, comment, share }) => {
  return (
    <>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row items-center">
          <FaHeart size={16} color="red" />
          <p className="text-sm">{likes}</p>
        </div>
        <div className="flex flex-row space-x-8">
          <div className="flex flex-row items-center">
            <FaComment size={16} />
            <p className="text-xs ml-1">{comment} comments</p>
          </div>
        </div>
      </div>
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
const CommentsDialog = memo(
  ({
    recipe,
    comments,
    isLiked,
    isSaved,
    handleSaveRecipe,
    handleLikeRecipe,
    addComment,
    handleComment,
    newComment,
  }) => {
    return (
      <Dialog>
        {comments && comments.length > 0 ? (
          <DialogTrigger className="text-xs text-gray-400">
            <p>View all comments</p>
          </DialogTrigger>
        ) : (
          <p className="text-xs text-gray-500">No comments available.</p>
        )}
        <DialogContent
          className="bg-white"
          style={{ width: "1000px", maxWidth: "70%" }}
        >
          <DialogDescription>
            <div className="mb-4">
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
                  <div className="pr-8">
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
              <div className="pt-4">
                <p className="font-medium text-lg">{recipe.title}</p>
                <p>{recipe.description}</p>
                <h4 className="font-medium">Ingredients:</h4>
                <ul className="text-sm list-disc pl-4">
                  {Array.isArray(recipe.ingredients) &&
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient.name}</li>
                    ))}
                </ul>
                <h4 className="font-medium ">Instructions:</h4>
                <ol className="text-sm list-decimal pl-4">
                  {Array.isArray(recipe.instructions) &&
                    recipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction.name}</li>
                    ))}
                </ol>
                <div className="mt-2">
                  <h4 className="font-medium">Tags:</h4>
                  <ol className="flex flex-wrap gap-2">
                    {Array.isArray(recipe.tags) &&
                      recipe.tags.map((tag, index) => (
                        <li
                          key={index}
                          className="text-xs font-medium bg-gray-200 px-2 rounded-md"
                        >
                          {tag}
                        </li>
                      ))}
                  </ol>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-1 py-2">
                <MemoizedLikes
                  likes={recipe.likes.length}
                  comment={recipe.comments.length}
           
                />
              </div>
              <div className="flex flex-row justify-between px-20 pt-2 border-t-2 border-b-2 pb-2 border-gray-200">
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
              </div>
            </div>

            <div className="overflow-y-auto max-h-28 hide-scrollbar">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="py-1  border-gray-200">
                    <div className="bg-gray-200 rounded-md px-4 py-1">
                      <p className="text-xs font-medium">
                        {comment.user?.name}
                      </p>
                      <p className="text-xs">{comment.text}</p>
                    </div>

                    <p className="text-xs text-gray-500">
                      {timeSince(comment.createdOn)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 pb-2">
                  No comments available.
                </p>
              )}
            </div>
            <MemoizedCommentInput
              addComment={addComment}
              handleComment={handleComment}
              newComment={newComment}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }
);

const CommentButtonDialog = memo(
  ({
    recipe,
    comments,
    isSaved,
    isLiked,
    handleLikeRecipe,
    handleSaveRecipe,
    addComment,
    handleComment,
    newComment,
  }) => {
    return (
      <Dialog>
        <DialogTrigger className="flex flex-row gap-2">
          <FaComment size={16} /> Comment
        </DialogTrigger>
        <DialogContent
          className="bg-white"
          style={{ width: "1000px", maxWidth: "70%" }}
        >
          <DialogDescription>
            <div className="mb-4">
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
                  <div className="pr-8">
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
              <div className="pt-4">
                <p className="font-medium text-lg">{recipe.title}</p>
                <p>{recipe.description}</p>
                <h4 className="font-medium">Ingredients:</h4>
                <ul className="text-sm list-disc pl-4">
                  {Array.isArray(recipe.ingredients) &&
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient.name}</li>
                    ))}
                </ul>
                <h4 className="font-medium ">Instructions:</h4>
                <ol className="text-sm list-decimal pl-4">
                  {Array.isArray(recipe.instructions) &&
                    recipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction.name}</li>
                    ))}
                </ol>
                <div className="mt-2">
                  <h4 className="font-medium">Tags:</h4>
                  <ol className="flex flex-wrap gap-2">
                    {Array.isArray(recipe.tags) &&
                      recipe.tags.map((tag, index) => (
                        <li
                          key={index}
                          className="text-xs font-medium bg-gray-200 px-2 rounded-md"
                        >
                          {tag}
                        </li>
                      ))}
                  </ol>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-1 py-2">
                <MemoizedLikes
                  likes={recipe.likes.length}
                  comment={recipe.comments.length}
                />
              </div>
              <div className="flex flex-row justify-between px-20 pt-2 border-t-2 border-b-2 pb-2 border-gray-200">
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
              </div>
            </div>

            <div className="overflow-y-auto max-h-28 hide-scrollbar">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="py-1  border-gray-200">
                    <div className="bg-gray-200 rounded-md px-4 py-1">
                      <p className="text-xs font-medium">
                        {comment.user?.name}
                      </p>
                      <p className="text-xs">{comment.text}</p>
                    </div>

                    <p className="text-xs text-gray-500">
                      {timeSince(comment.createdOn)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 pb-2">
                  No comments available.
                </p>
              )}
            </div>
            <MemoizedCommentInput
              addComment={addComment}
              handleComment={handleComment}
              newComment={newComment}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }
);

const MemoizedCommentInput = ({ addComment, handleComment, newComment }) => {
  return (
    <div className="flex flex-row">
      <Input
        type="text"
        value={newComment}
        onChange={(e) => handleComment(e.target.value)}
        placeholder="Add Comment"
        style={{ backgroundColor: "#e5e7eb" }}
        className="border border-slate-400 rounded-md px-4 py-2 text-sm placeholder:text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button onClick={() => addComment(newComment)}>Submit</Button>
    </div>
  );
};

const MemoizedRecipeCard = memo(
  ({
    recipe,
    handleLikeRecipe,
    handleSaveRecipe,
    handleViewProfile,
    isSaved,
    isLiked,
  }) => {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [latestComment, setLatestComment] = useState([]);

    const handleComment = useCallback((value) => {
      setNewComment(value);
    }, []);

    const fetchComments = useCallback(async () => {
      try {
        const response = await axios.get(GetCommentAPI(recipe._id));
        console.log("response", response.data);
        const sortedComments = response.data.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );

        const latestComment =
          sortedComments.length > 0 ? [sortedComments[0]] : [];
        setLatestComment(latestComment);

        setComments(sortedComments);

        console.log("comments", sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }, [recipe._id]);

    useEffect(() => {
      fetchComments();
    }, [fetchComments]);

    const addComment = async (text) => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Retrieved Token:", token);

        const decodedToken = token ? jwtDecode(token) : null;
        const userId = decodedToken?.userId || storedGoogleUser?._id;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        const response = await axios.post(CommentAPI(recipe._id), {
          user: userId,
          text,
        });

        const newCommentData = response.data.comment;
        setComments((prevComments) => [newCommentData, ...prevComments]);

        setNewComment("");

        console.log("Comment added successfully:", newCommentData);

        fetchComments();
      } catch (error) {
        console.error(
          "Error adding comment:",
          error.response?.data?.message || error.message
        );
      }
    };

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
            <MemoizedLikes
              likes={recipe.likes.length}
              comment={recipe.comments.length}
            />
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
              <p className="text-sm">
                <CommentButtonDialog
                  addComment={addComment}
                  handleComment={handleComment}
                  newComment={newComment}
                  recipe={recipe}
                  comments={comments}
                  isSaved={isSaved}
                  isLiked={isLiked}
                  handleLikeRecipe={handleLikeRecipe}
                  handleSaveRecipe={handleSaveRecipe}
                />
              </p>
            </div>

          </div>
          <div className="border-t-2 border-gray-200 ">
            <div className="">
              <CommentsDialog
                addComment={addComment}
                handleComment={handleComment}
                newComment={newComment}
                recipe={recipe}
                comments={comments}
                isSaved={isSaved}
                isLiked={isLiked}
                handleLikeRecipe={handleLikeRecipe}
                handleSaveRecipe={handleSaveRecipe}
              />
            </div>
            <div className="flex flex-col py-2">
              {latestComment.map((comment) => (
                <div className="">
                  <div
                    key={comment._id}
                    className="flex flex-col py-1 px-4 bg-gray-200 rounded-md mb-1"
                  >
                    <p className="text-xs">{comment.user?.name}</p>
                    <p className="text-xs">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {timeSince(comment.createdOn)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <MemoizedCommentInput
            addComment={addComment}
            handleComment={handleComment}
            newComment={newComment}
          />
        </div>
      );
    }, [
      recipe._id,
      recipe.likes.length,
      isSaved[recipe._id],
      isLiked[recipe._id],
      comments,
      latestComment,
      newComment,
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
