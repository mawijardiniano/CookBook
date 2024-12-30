import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
  } from "@/components/ui/menubar";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode";
  import React, { useState, useEffect } from "react";
  import { FaEllipsisH } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  
  export function RecipesMenubar({ recipeId }) { 
    const [userData, setUserData] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    
    const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;
    const DELETERECIPE_API = (id) => `http://localhost:5000/api/recipe/delete-recipe/${id}`;
    const RECIPEbyUSER_API = (id) => `http://localhost:5000/api/recipe/get-recipe/${id}`;
  
    useEffect(() => {
      const token = localStorage.getItem("authToken");
      const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
  
      if (!token) return;
  
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const userIdToUse = userId || storedGoogleUser?._id;
  
        if (!userIdToUse) {
          console.warn(
            "No valid user ID found (neither decoded token nor Google User)."
          );
          return;
        }
  
        console.log("Using User ID:", userIdToUse);
        if (storedGoogleUser) {
          setUserData(storedGoogleUser);
        } else {
          const fetchUserData = async () => {
            try {
              const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setUserData(response.data);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          };
  
          const fetchRecipes = async () => {
            try {
              const response = await axios.get(RECIPEbyUSER_API(userIdToUse), {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setRecipes(response.data);
            } catch (error) {
              console.error(
                "Error fetching recipe data:",
                error?.response?.data || error.message
              );
            }
          };
  
          fetchUserData();
          fetchRecipes();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }, []);
  
    const handleDeleteRecipe = async (recipeId) => {
      console.log("Deleting Recipe with ID:", recipeId);
      try {
        const response = await axios.delete(DELETERECIPE_API(recipeId));
        console.log("Deleted Recipe Response:", response.data);
  
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );
        window.location.reload(); 
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    };
  
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <FaEllipsisH className="text-gray-500" />
          </MenubarTrigger>
          <MenubarContent className=" text-white border-b-0 hover:bg-red-600" style={{backgroundColor: "red"}}>
            <MenubarItem onClick={() => handleDeleteRecipe(recipeId)} style={{backgroundColor: "red"}}>Delete</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  }
  