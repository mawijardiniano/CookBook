import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";

const FollowingTab = () => {
  const [userData, setUserData] = useState(null);

  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;

  const fetchUserData = async (userIdToUse, token) => {
    try {
      const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      console.log("Saved recipes:", response.data.following);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error?.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));

    if (!token) {
      console.log("No token found");
      return;
    }

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
      fetchUserData(userIdToUse, token);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }, []);

  return (
    <Tabs
      defaultValue="followings"
      className="w-full p-8 flex  flex-col rounded-md"
    >
      <TabsList className="flex w-full border">
        <TabsTrigger className=" w-full bg-gray-100" value="followings">
          Followings
        </TabsTrigger>
        <TabsTrigger className=" w-full bg-gray-100" value="followers">
          Followers
        </TabsTrigger>
      </TabsList>
      <TabsContent className="flex w-full py-1" value="followings">
        {userData?.following?.map((followings) => (
          <div
            key={followings._id}
            className="flex items-center justify-between p-2 border-b w-full border rounded-md"
          >
            <div className="flex items-center">
              <div className="ml-4">
                <h3 className="font-semibold">{followings?.name}</h3>
              </div>
            </div>
            <div className="space-x-2">
              <Button className="text-xs" style={{backgroundColor: "black", color: "white"}}>Unfollow</Button>
              <Button className="text-xs border">View Profile</Button>
            </div>
          </div>
        ))}
      </TabsContent>
      <TabsContent className="flex w-full" value="followers">
        {userData?.followers?.map((follower) => (
          <div
            key={follower._id}
            className="flex items-center justify-between p-2 w-full border rounded-md"
          >
            <div className="flex items-center">
              <div className="ml-4">
                <h3 className="font-semibold">{follower?.name}</h3>
              </div>
            </div>
            <div className="space-x-2">
              <Button className="text-xs" style={{backgroundColor: "black", color: "white"}}>Followback</Button>
              <Button className="text-xs border" >View Profile</Button>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default FollowingTab;
