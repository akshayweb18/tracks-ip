import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r p-4">
      <div className="mb-6 text-xl font-semibold">Tracking</div>
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="px-3 py-2 rounded hover:bg-muted/30">Dashboard</Link>
        <Link href="/devices" className="px-3 py-2 rounded hover:bg-muted/30">Devices</Link>
        <Link href="/api/register" className="px-3 py-2 rounded hover:bg-muted/30">Register</Link>
      </nav>
    </aside>
  )
}