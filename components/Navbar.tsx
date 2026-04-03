"use client";

import { Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="
      sticky top-0 z-40 
      bg-[#0d0f15]/60 backdrop-blur-xl 
      border-b border-white/10 
      px-4 py-3 flex items-center justify-between
    ">
      {/* Spacer instead of hamburger */}
      <div className="w-6"></div>

      <div className="hidden sm:flex flex-1 max-w-md mx-4 bg-[#0b1018] border border-gray-700 px-3 py-2 rounded-lg">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      <User size={24} className="text-gray-300" />
    </nav>
  );
}
