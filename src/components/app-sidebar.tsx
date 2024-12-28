import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Heart, Users, User } from "lucide-react";
import { FaBookReader } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Saved Recipes",
    url: "/savedRecipes",
    icon: Heart,
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

  return (
    <Sidebar className="w-64 bg-white h-screen">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <FaBookReader className="text-black" />
                <span className="text-black">CookBook</span>
              </h1>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`hover:bg-gray-200 ${
                    location.pathname === item.url
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center space-x-3 px-4 py-3"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
