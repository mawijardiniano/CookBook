import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaBell, FaComment, FaBookReader } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NameMenubar } from "./menubar";
import { useNavigate, NavLink } from "react-router-dom";
import Notification from "./notification";
import { HamburgerButton } from "./hamburgerButton";
import { Home, Users, User } from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Followings",
    url: "/following",
    icon: Users,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const LOGGEDUSER_API = (id) => `${import.meta.env.VITE_LOGGEDUSER_API}${id}`;
  const FILTERUSER_API = (name) =>
    `${import.meta.env.VITE_FILTERUSER_API}?name=${encodeURIComponent(name)}`;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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

    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const fetchUserData = async () => {
        try {
          const response = await axios.get(LOGGEDUSER_API(userId), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
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
    setQuery("");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-4 z-50 flex flex-row justify-between">
        <HamburgerButton toggleSidebar={toggleSidebar} />
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
            <div className="absolute top-full left-[-25px] mt-2 w-72 bg-white border border-slate-200 shadow-lg z-10 max-h-60 overflow-auto">
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
            <Notification
              className="text-gray-500 hover:text-gray-700"
              size={24}
            />
            <FaComment className="text-gray-500 hover:text-gray-700" size={24} />
            <NameMenubar />
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sidebar</h2>
          <button onClick={toggleSidebar} className="text-lg">
            ×
          </button>
        </div>
        <div className="p-4">
          <ul>
            {items.map((item) => (
              <li key={item.title} className="mb-2">
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive
                        ? "bg-gray-200 font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                  onClick={toggleSidebar}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Navbar;
