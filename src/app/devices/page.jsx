import DeviceTable from "@/components/DeviceTable";

export default function DevicesPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Registered Devices
      </h1>
      <DeviceTable />
    </div>
  );
}