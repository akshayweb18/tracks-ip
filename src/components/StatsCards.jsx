"use client";

import { useEffect, useState } from "react";

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
  const active = devices.filter(d => d.status === "online").length;
  const offline = devices.filter(d => d.status === "offline").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Total Devices */}
      <div className="bg-white rounded-2xl shadow p-6 border">
        <h3 className="text-sm text-gray-500">Total Devices</h3>
        <p className="text-3xl font-bold mt-2">{total}</p>
      </div>

      {/* Active Devices */}
      <div className="bg-green-50 rounded-2xl shadow p-6 border border-green-200">
        <h3 className="text-sm text-green-600">Active Devices</h3>
        <p className="text-3xl font-bold text-green-700 mt-2">
          {active}
        </p>
      </div>

      {/* Offline Devices */}
      <div className="bg-red-50 rounded-2xl shadow p-6 border border-red-200">
        <h3 className="text-sm text-red-600">Offline Devices</h3>
        <p className="text-3xl font-bold text-red-700 mt-2">
          {offline}
        </p>
      </div>

    </div>
  );
}