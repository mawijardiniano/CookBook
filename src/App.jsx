import React, { useEffect } from "react";
import { scan } from "react-scan";
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
import UsersProfile from "./pages/usersProfile";
import PrivateRoute from "./pages/PrivateRoute";

function MainApp() {
  const location = useLocation();
  const hideSidebar =
    location.pathname === "/" || location.pathname === "/signup";

  // useEffect(() => {
  //   scan({
  //     enabled: true,
  //     log: true,
  //     highlight: true,
  //   });
  // }, []);
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
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/savedRecipes"
                element={
                  <PrivateRoute>
                    <SavedRecipes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/following"
                element={
                  <PrivateRoute>
                    <Following />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/userprofile"
                element={
                  <PrivateRoute>
                    <UsersProfile />
                  </PrivateRoute>
                }
              />
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
