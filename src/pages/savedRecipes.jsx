import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { FaBell, FaBookReader } from "react-icons/fa";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function SavedRecipes() {
  const [date, setDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [account, setAccount] = useState("Mawi");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">


        <div className="flex-1 flex flex-col">


          <div className="p-6">
            <p>SavedRecipes</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
