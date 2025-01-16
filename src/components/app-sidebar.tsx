import React, { useState } from "react";
import { Home, Users, User } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { HamburgerButton } from "./hamburgerButton";
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Followings",
    url: "/following",
    icon: Users,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className={`fixed pt-10 left-0 h-full bg-white z-40 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static w-64 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={toggleSidebar} className="lg:hidden">
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.title}>
              <NavLink
                to={item.url}
                className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-200 ${
                  location.pathname === item.url
                    ? "bg-gray-200 text-gray-900 font-semibold"
                    : "text-gray-600"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
