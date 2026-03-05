"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Laptop, PlusCircle, X } from "lucide-react";

export default function Sidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Devices", href: "/devices", icon: Laptop },
    { name: "Register", href: "/register", icon: PlusCircle },
  ];

  const isActiveLink = (href) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-6 z-40 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden z-50 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
        >
          <X size={22} className="text-black" />
        </button>

        {/* Logo */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-gray-800">
            TRACK
            <span className="text-yellow-400">E</span>
            FLOW
          </h4>
        </div>

        {/* Nav */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}