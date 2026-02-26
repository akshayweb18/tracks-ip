"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Laptop, PlusCircle } from "lucide-react";
export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Devices", href: "/devices", icon: Laptop },
    { name: "Register", href: "/register", icon: PlusCircle },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-5 relative">
      {/* Logo */}
<div className="mb-4 relative h-12">
  <h4 className="font-sans text-2xl font-bold text-gray-800">
    TRACK
    <span className="inline-block text-yellow-400 relative 
      animate-[flashE_1s_ease-in-out_infinite] 
      [@keyframes_flashE:{0%,100%{text-shadow:0_0_0px_#fff}50%{text-shadow:0_0_12px_#fff}}]">
      E
    </span>
    FLOW
  </h4>
</div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          // Highlight active link
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out
                ${isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100 hover:text-black"}
              `}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}