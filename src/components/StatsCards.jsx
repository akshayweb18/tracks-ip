"use client";

import { useEffect, useState } from "react";
import { Monitor, Wifi, WifiOff } from "lucide-react";

export default function StatsCards() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/devices");
      const data = await res.json();
      setDevices(data);
    }
    load();
  }, []);

  const total = devices.length;
  const active = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;

  const Card = ({ title, value, icon: Icon, bg, textColor, valueColor, border }) => (
    <div className={`rounded-2xl shadow p-6 ${bg} ${border}`}>
      <h3 className={`text-sm ${textColor}`}>{title}</h3>
      <p className={`text-3xl font-bold mt-2 flex items-center gap-2 ${valueColor}`}>
        <Icon size={28} />
        {value}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card
        title="Total Devices"
        value={total}
        icon={Monitor}
        bg="bg-white"
        textColor="text-gray-500"
        valueColor="text-gray-800"
        border="border"
      />
      <Card
        title="Active Devices"
        value={active}
        icon={Wifi}
        bg="bg-green-50"
        textColor="text-green-600"
        valueColor="text-green-700"
        border="border border-green-200"
      />
      <Card
        title="Offline Devices"
        value={offline}
        icon={WifiOff}
        bg="bg-red-50"
        textColor="text-red-600"
        valueColor="text-red-700"
        border="border border-red-200"
      />
    </div>
  );
}