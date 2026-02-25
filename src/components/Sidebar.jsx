
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-muted/40">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}