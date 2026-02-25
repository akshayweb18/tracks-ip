import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Laptop, Wifi, WifiOff } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor all company laptops in real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Total Devices */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Devices</CardTitle>
            <Laptop className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            150
          </CardContent>
        </Card>

        {/* Online */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Online</CardTitle>
            <Wifi className="text-green-500" size={20} />
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            120
          </CardContent>
        </Card>

        {/* Offline */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Offline</CardTitle>
            <WifiOff className="text-red-500" size={20} />
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">
            30
          </CardContent>
        </Card>

      </div>

    </div>
  )
}