import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NameMenubar() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const LOGGEDUSER_API = (id) => `${import.meta.env.VITE_LOGGEDUSER_API}${id}`;

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
      const userId = decodedToken.userId;

      if (storedGoogleUser) {
        setUserData(storedGoogleUser);
      }

      const googleUserId = storedGoogleUser?._id;
      console.log("Google User ID:", googleUserId);

      const fetchUserData = async () => {
        try {
          const response = await axios.get(LOGGEDUSER_API(userId), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          console.log("User Data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const navigateToProfile = () => {
    navigate("/profile")
  }

  const handleLogout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("googleUser");
    localStorage.removeItem("userData");

    window.location.reload();
    navigate("/");
  };  

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>{userData?.name}</MenubarTrigger>
        <MenubarContent >
          <MenubarItem onClick={navigateToProfile}>My Profile</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
