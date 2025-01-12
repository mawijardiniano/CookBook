import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaBell, FaComment, FaBookReader } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NameMenubar } from "./menubar";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
   const navigate = useNavigate();

  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;
  const FILTERUSER_API = (name) =>
    `http://localhost:5000/api/user/filter-user?name=${encodeURIComponent(name)}`;

  const handleSearchChange = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await axios.get(FILTERUSER_API(searchQuery));
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

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

  const handleViewProfile = (userId) => {
    navigate(`/userprofile/${userId}`);
    setSearchResults([]); 
  };


  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-4 z-50 flex flex-row justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <FaBookReader className="text-black" />
          <span className="text-black">CookBook</span>
        </h1>
      </div>

      <div className="flex items-center justify-end space-x-6 relative">
        <div>
          <Input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border focus:border-black focus:outline-none border-slate-200"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 shadow-lg z-10 max-h-60 overflow-auto">
            <ul>
              {searchResults.map((result) => (
                <li
                  key={result._id}
                  onClick={() => handleViewProfile(result._id)}
                  className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                >
                  {result.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center space-x-6">
          <FaBell className="text-gray-500 hover:text-gray-700" size={24} />
          <FaComment className="text-gray-500 hover:text-gray-700" size={24} />
          <NameMenubar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
