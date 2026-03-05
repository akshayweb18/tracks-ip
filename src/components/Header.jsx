"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell, LogOut, ChevronDown, Menu } from "lucide-react";

export default function Header({ search, setSearch, onMenuClick }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token"); // adjust auth key
    router.push("/login");
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm">
      <div className="px-8 py-4 flex justify-between items-center">

        {/* Left Section (mobile menu + title) */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded hover:bg-gray-200 transition"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight uppercase">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Monitor company devices in real time
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Search */}
          <div className="relative w-full max-w-[400px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search devices..."
              value={search || ""}
              onChange={(e) => setSearch?.(e.target.value)}
              className="pl-10 rounded-full bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-black transition-all duration-200"
            />
          </div>

          {/* Notification */}
          <div className="relative cursor-pointer hover:scale-105 transition-transform duration-150">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-full focus:outline-none hover:bg-gray-100 p-1 transition"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-black text-white">AC</AvatarFallback>
              </Avatar>
              <ChevronDown size={16} className="text-gray-600 transition-transform duration-200" 
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Animated Dropdown */}
            <div
              className={`absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 origin-top-right ${
                dropdownOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700  flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
