"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell } from "lucide-react";

export default function Header({ search, setSearch }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
      <div className="px-8 py-4 flex justify-between items-center">

        {/* Left Section */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            🌐 TrackFlow Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Monitor company devices in real time
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Search */}
          <div className="relative w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch?.(e.target.value)}
              className="pl-10 rounded-full bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-black transition-all duration-200"
            />
          </div>

          {/* Notification Icon */}
          <div className="relative cursor-pointer hover:scale-105 transition-transform duration-150">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-black text-white">
                AC
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Akshay</p>
              <p className="text-xs text-gray-500">IT Admin</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}