import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FaBell, FaComment, FaBookReader } from "react-icons/fa";

const Notification = () => {
  return (
<Menubar style={{ position: "relative" }}>
  <MenubarMenu>
    <MenubarTrigger><FaBell size={20} color="gray"/></MenubarTrigger>
    <MenubarContent style={{ position: "absolute", left: "50%", transform: "translateX(-100%)", width: "300px" }}>
    <div className="p-2">
    <p>Notification</p>
    </div>

    </MenubarContent>
  </MenubarMenu>
</Menubar>

  );
};

export default Notification;
