import React, { useState, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { FaBookReader, FaCog } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const UsernameProfile = memo(({userData}) => (
  <p>{userData?.name}</p>
));

const Buttons = memo(({}) => (
  <div className="flex space-x-4">
    <Button style={{backgroundColor: "black"}} className=" text-white text-sm px-2 rounded-md">Follow</Button>
    <Button  style={{backgroundColor: "black"}} className=" text-white text-sm px-3  rounded-md">Message</Button>
    <Menubar className="border ">
  <MenubarMenu>
    <MenubarTrigger><FaCog/></MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Unfollow</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>


  </div>
))

const UsersProfile = () => {
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();

  const USERPROFILE_API = (id) => `http://localhost:5000/api/user/profile/${id}`;

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(USERPROFILE_API(userId));
      setUserData(response.data);
      console.log('User data:', response.data);
    } catch (error) {
      console.error(
        'Error fetching user data:',
        error?.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (userId) {
      console.log('Using User ID:', userId);
      fetchUserData(userId);
    }
  }, [userId]);

  return (
    <div className="py-28 px-12">
    <div className='flex flex-row w-full space-x-6'>
      <div className='p-16 bg-gray-200 rounded-full'/>
      <div className='flex justify-center flex-col space-y-2'>
      <UsernameProfile userData={userData}/>
      <Buttons/>
      </div>
    </div>
  
    </div>
  );
};

export default UsersProfile;
