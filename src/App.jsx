import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Landing from "./pages/landing";
import Signup from "./pages/signup";
import Home from "./pages/home";
import SavedRecipes from "./pages/savedRecipes";
import Following from "./pages/followings";
import Profile from "./pages/profile";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./components/navbar";

function MainApp() {
  const location = useLocation(); 
  const hideSidebar = location.pathname === "/" || location.pathname === "/signup";


  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {!hideSidebar && <AppSidebar />}
        <div className="flex-1 flex flex-col">
          {!hideSidebar && <Navbar />}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/savedRecipes" element={<SavedRecipes />} />
              <Route path="/following" element={<Following />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
