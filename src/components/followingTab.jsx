import React, { useEffect, useState, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";

const FollowingList = memo(({ userData, unfollowUser, followUser }) => (
  <TabsContent className="flex w-full py-1" value="followings">
    {userData?.following?.map((followings) => (
      <div
        key={followings._id}
        className=" bg-gray-100 flex items-center justify-between p-2 border-b w-full border rounded-md"
      >
        <div className="flex items-center">
          <div className="ml-4">
            <h3 className="font-semibold">{followings?.name}</h3>
          </div>
        </div>
        <div className="space-x-2">
          <FollowingListButtons
            followings={followings}
            unfollowUser={unfollowUser}
          />
          <Button className="text-xs border">View Profile</Button>
        </div>
      </div>
    ))}
  </TabsContent>
));

const FollowersList = memo (({userData, followUser}) => (
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
              <Button
                className="text-xs"
                style={{ backgroundColor: "black", color: "white" }}
                onClick={() => followUser(follower._id)}
              >
                Followback
              </Button>
              <Button className="text-xs border">View Profile</Button>
            </div>
          </div>
        ))}
      </TabsContent>
));

const FollowingListButtons = memo(({ followings, unfollowUser }) => (
  <Dialog>
    <DialogTrigger className="text-xs px-3 py-2 text-white bg-black rounded-md font-medium">
      Unfollow
    </DialogTrigger>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>Are you absolutely sure to unfollow?</DialogTitle>
        <div className="flex flex-row py-4 space-x-2">
          <DialogClose
            className="w-full"
            onClick={() => unfollowUser(followings._id)}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Yes
          </DialogClose>
          <DialogClose className="w-full bg-white border border-gray-500 px-1 py-1 rounded-md text-sm font-bold">
            No
          </DialogClose>
        </div>
      </DialogHeader>
    </DialogContent>
  </Dialog>
));

const FollowingTab = () => {
  const [userData, setUserData] = useState(null);
  const [followings, setFollowings] = useState([]);


  const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;
  const UNFOLLOW_API = (id) => `http://localhost:5000/api/user/unfollow/${id}`;
  const FOLLOW = (id) => `http://localhost:5000/api/user/follow/${id}`;

  const unfollowUser = async (id) => {
  const token = localStorage.getItem("authToken");
  const userIdToUse = jwtDecode(token)?.userId;

  try {
    const response = await axios.post(
      UNFOLLOW_API(id),
      { userId: userIdToUse },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("User unfollowed", response.data);

    // Update followings in state and localStorage
    const updatedFollowings = followings.filter(
      (following) => following._id !== id
    );
    setFollowings(updatedFollowings);
    setUserData((prev) => ({
      ...prev,
      following: updatedFollowings,
    }));
    localStorage.setItem("followings", JSON.stringify(updatedFollowings));
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};


  const followUser = async (id) => {
  const token = localStorage.getItem("authToken");
  const userIdToUse = jwtDecode(token)?.userId;

  try {
    const response = await axios.post(
      FOLLOW(id),
      { userId: userIdToUse },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("User followed", response.data);

    const updatedFollowings = [...followings, response.data];
    setFollowings(updatedFollowings);
    localStorage.setItem("followings", JSON.stringify(updatedFollowings));
    window.location.reload(); 
  } catch (error) {
    console.error("Error following user:", error);
  }
};

useEffect(() => {
  const storedFollowings = JSON.parse(localStorage.getItem("followings")) || [];
  setFollowings(storedFollowings);
}, []);



  const fetchUserData = async (userIdToUse, token) => {
    try {
      const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      setFollowings(response.data.following);
      console.log("following:", followings);
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
      <FollowingList userData={userData} unfollowUser={unfollowUser} followUser={followUser}/>
      <FollowersList userData={userData} followUser={followUser}/>
    </Tabs>
  );
};

export default FollowingTab;
