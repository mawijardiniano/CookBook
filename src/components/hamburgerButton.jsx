
import React from "react";
import { FaBars } from "react-icons/fa";

export function HamburgerButton({ toggleSidebar }) {
  return (
    <div className="lg:hidden fixed left-4 z-50">
      <button
        onClick={toggleSidebar}
        className="text-gray-600 bg-gray-100 p-2 rounded-md shadow-md"
      >
        <FaBars className="w-6 h-6" />
      </button>
    </div>
  );
}
