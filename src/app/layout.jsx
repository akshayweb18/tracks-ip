"use client";

import "./globals.css"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function RootLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <html lang="en">
      <body className="bg-muted/40">
        <div className="flex h-screen overflow-hidden">
          {!hideSidebar && (
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          )}
          <div className="flex flex-col flex-1">
            {!hideSidebar && (
              <Header
                onMenuClick={() => setMobileOpen(true)}
                search={null}
                setSearch={null}
              />
            )}
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}