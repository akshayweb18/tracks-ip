"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [mobileOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-70 bg-slate-950/45 backdrop-blur-[1px] transition-opacity lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 h-screen w-72 bg-white/95 backdrop-blur border-r border-slate-200 p-6 z-80 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:sticky lg:top-0 lg:translate-x-0 lg:self-start`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="absolute right-4 top-4 z-90 rounded-full border border-slate-300 bg-white p-2.5 text-slate-800 shadow-md transition hover:bg-slate-100 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="mb-10 border-b border-slate-100 pb-6">
          <h4 className="text-2xl font-bold tracking-tight text-slate-900">
            TRACK
            <span className="text-amber-500">E</span>
            FLOW
          </h4>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Device Intelligence</p>
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
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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