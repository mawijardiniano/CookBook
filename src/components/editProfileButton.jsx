import React, { useState, useCallback, memo } from "react";
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

const MemoizedDialogHeader = memo(() => (
  <DialogHeader>
    <DialogTitle>Edit profile</DialogTitle>
    <DialogDescription>
      Make changes to your profile here. Click save when you're done.
    </DialogDescription>
  </DialogHeader>
));

const MemoizedDialogFooter = memo(({ onSave }) => (
  <DialogFooter>
    <Button
      type="submit"
      className="py-2 px-6 rounded-[5px] self-start text-white"
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

  const handleNameChange = useCallback((value) => {
    setName(value);
  }, []);

  const handleSave = useCallback(() => {
    console.log("Profile saved:", name);
  }, [name]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-300 py-2 px-6 rounded-[5px] self-start">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <MemoizedDialogHeader />
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
