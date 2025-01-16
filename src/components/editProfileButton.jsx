import React, { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MemoizedDialogHeader = memo(() => (
  <DialogHeader className="flex flex-col items-start space-y-2">
    <DialogTitle className="text-lg md:text-xl font-semibold text-left">Edit profile</DialogTitle>
    <DialogDescription className="text-sm md:text-base text-gray-600 text-left">
      Make changes to your profile here. Click save when you're done.
    </DialogDescription>
  </DialogHeader>
));


const MemoizedDialogFooter = memo(({ onSave }) => (
  <DialogFooter>
    <Button
      type="submit"
      className="py-2 px-6 rounded-[5px] text-white"
      style={{ backgroundColor: "black" }}
      onClick={onSave}
    >
      Save changes
    </Button>
  </DialogFooter>
));

const MemoizedInput = memo(({ value, onChange, placeholder, className }) => {
  console.log("Input Re-rendered");
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
});

const EditProfileButton = () => {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const EDITUSER_API = (id) => `${import.meta.env.VITE_EDITUSER_API}${id}`;
  const LOGGEDUSER_API = (id) => `${import.meta.env.VITE_LOGGEDUSER_API}${id}`;

  const handleNameChange = useCallback((value) => {
    setName(value);
  }, []);

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
      const userId = decodedToken?.userId;
      const userIdToUse = userId || storedGoogleUser?._id;

      if (!userIdToUse) {
        console.warn(
          "No valid user ID found (neither decoded token nor Google User)."
        );
        return;
      }

      console.log("Using User ID:", userIdToUse);

      const fetchUserData = async () => {
        try {
          const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          console.log("User Data:", response.data);
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error?.response?.data || error.message
          );
        }
      };
      fetchUserData();
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    console.log("Retrieved Token:", token);

    const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
    console.log("Retrieved Google User:", storedGoogleUser);

    if (!token) {
      console.log("No token found");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.userId;
    const userIdToUse = userId || storedGoogleUser?._id;
    console.log("User ID to use:", userIdToUse);
    try {
      const response = await axios.put(EDITUSER_API(userIdToUse), {
        name: name,
      });
      console.log("New username", response);
      setUserData({ ...userData, name: response.data.name });
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      console.error(
        "Error updating user data:",
        error?.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-300 py-2 rounded-[5px] self-start md:px-6">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px] bg-white">
        <MemoizedDialogHeader/>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <MemoizedInput
              placeholder="Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <MemoizedDialogFooter onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileButton;
