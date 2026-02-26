"use client";

import Link from "next/link";
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
    <aside className="w-64 min-h-screen bg-white border-r p-6">
      
      <div className="mb-10 text-2xl font-bold">
      🌐 TrackFlow
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-150 ease-in-out
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }
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