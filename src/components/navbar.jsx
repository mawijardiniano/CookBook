import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaBell, FaComment } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const Navbar = () => {
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState(null);

  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved Token:', token);

    if (!token) {
      console.log('No token found');
      return;
    }

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
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="fixed top-0 left-[256px] right-0 bg-white shadow px-6 py-4 z-50">
      <div className="flex items-center justify-end space-x-6">
    
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-60 border border-gray-300 rounded px-3 py-1" 
        />

        <div className="flex items-center space-x-6">
          <FaBell className="text-gray-500 hover:text-gray-700" size={24} />
          <FaComment className="text-gray-500 hover:text-gray-700" size={24} />
          <p className="font-medium">{userData?.name}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
