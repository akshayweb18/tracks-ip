import StatsCards from "@/components/StatsCards";
import DeviceTable from "@/components/DeviceTable";

export default function Home() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        IP Tracking Dashboard
      </h1>

      {/* Top Stats */}
      <StatsCards />

      {/* Table */}
      <DeviceTable />
    </div>
  );
}