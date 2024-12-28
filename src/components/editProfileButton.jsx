import React, {useState} from "react";
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
import { Label } from "@/components/ui/label";
import { FaBookmark, FaPlus } from "react-icons/fa";

const EditProfileButton = () => {
  const [name, setName] = useState("");

  const handleNameChange = (value) => {
    setName(value);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-300 py-2 px-6 rounded-[5px] self-start">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input placeholder="Name" id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter >
          <Button type="submit" className=" py-2 px-6 rounded-[5px] self-start text-white" style={{ backgroundColor: 'black' }}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileButton;
