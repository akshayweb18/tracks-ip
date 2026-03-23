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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">

        {/* Left Section (mobile menu + title) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-xl uppercase">
              Dashboard
            </h2>
            <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
              Monitor company devices in real time
            </p>
            <p className="eyebrow mt-1 hidden lg:block">Operations Console</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="relative hidden w-60 md:block lg:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search devices..."
              value={search || ""}
              onChange={(e) => setSearch?.(e.target.value)}
              className="h-10 rounded-full border-slate-200 bg-slate-100/70 pl-10 text-sm focus-visible:ring-slate-400"
            />
          </div>

          {/* Notification */}
          <button
            aria-label="Notifications"
            className="relative rounded-full border border-slate-200 p-2 transition-transform duration-150 hover:scale-105 hover:bg-slate-100"
            type="button"
          >
            <Bell size={18} className="text-slate-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 transition hover:bg-slate-100 focus:outline-none"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-slate-900 text-white">AC</AvatarFallback>
              </Avatar>
              <ChevronDown size={16} className="hidden text-slate-600 transition-transform duration-200 sm:block" 
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Animated Dropdown */}
            <div
              className={`absolute right-0 mt-3 w-48 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-300 ${
                dropdownOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
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
