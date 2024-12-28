import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaBell, FaComment, FaBookReader } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState(null);

  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;

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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-4 z-50 flex flex-row justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <FaBookReader className="text-black" />
          <span className="text-black">CookBook</span>
        </h1>
      </div>
      <div className="flex items-center justify-end space-x-6">
        <div>
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="border focus:border-black focus:outline-none border-slate-200 "
          />
        </div>

        <div className="flex items-center space-x-6">
          <FaBell className="text-gray-500 hover:text-gray-700" size={24} />
          <FaComment className="text-gray-500 hover:text-gray-700" size={24} />
          <p className="font-medium w-full">{userData?.name}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
