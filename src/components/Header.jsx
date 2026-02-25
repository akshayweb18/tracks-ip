"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  return (
    <header className="border-b bg-background px-6 py-4 flex justify-between items-center">
      <Input placeholder="Search devices..." className="max-w-sm" />
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    </header>
  )
}