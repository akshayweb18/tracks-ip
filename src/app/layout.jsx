"use client";

import "./globals.css"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Sora, JetBrains_Mono } from "next/font/google"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${sora.variable} ${jetbrainsMono.variable} bg-muted/40 font-sans`}>
        <div className="flex min-h-screen overflow-hidden">
          {!hideSidebar && (
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            {!hideSidebar && (
              <Header
                onMenuClick={() => setMobileOpen(true)}
                search={null}
                setSearch={null}
              />
            )}
            <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}