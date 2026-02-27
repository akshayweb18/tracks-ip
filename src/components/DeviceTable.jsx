"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import Link from "next/link";
import { FaLaptop, FaWifi } from "react-icons/fa";

export default function DeviceTable({ search }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDevices() {
    try {
      const res = await fetch("/api/devices");
      const data = await res.json();

      // 🔥 Auto inactive detection (1 min rule)
      const updated = data.map((d) => {
        const lastSeen = new Date(d.lastSeen);
        const now = new Date();
        const diff = (now - lastSeen) / 1000; // seconds

        return {
          ...d,
          status: diff > 60 ? "Inactive" : "Active",
        };
      });

      setDevices(updated);
    } catch (err) {
      console.error("Failed to load devices:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 10000); // 🔁 auto refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const filteredDevices = useMemo(() => {
    const query = search?.toLowerCase().trim() || "";
    if (!query) return devices;

    return devices.filter((d) =>
      d.assignedEmployee?.toLowerCase().includes(query) ||
      d.deviceId?.toLowerCase().includes(query) ||
      d.publicIP?.toLowerCase().includes(query) ||
      d.localIP?.toLowerCase().includes(query)
    );
  }, [search, devices]);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6">
      <div className="overflow-x-auto max-h-[600px] relative custom-scrollbar">

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded flex items-center px-4"
              >
                <div className="flex-1 h-4 bg-gray-300 rounded mr-4"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-[700px] md:min-w-full text-sm border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b text-left text-gray-600">
                <th className="py-3 px-2 md:px-4">Employee</th>
                <th className="px-2 md:px-4">Device ID</th>
                <th className="px-2 md:px-4">Public IP</th>
                <th className="px-2 md:px-4">Local IP</th>
                <th className="px-2 md:px-4">Status</th>
                <th className="px-2 md:px-4">Last Seen</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.map((d) => (
                <tr
                  key={d._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 md:px-4 font-medium text-blue-600 hover:underline flex items-center gap-2">
                    <FaLaptop className="text-gray-400" />
                    <Link href={`/devices/${d._id}`}>
                      {d.assignedEmployee}
                    </Link>
                  </td>

                  <td className="px-2 md:px-4">{d.deviceId}</td>

                  <td className="px-2 md:px-4 flex items-center gap-1">
                    <FaWifi className="text-gray-400" />
                    {d.publicIP}
                  </td>

                  <td className="px-2 md:px-4">{d.localIP}</td>

                  <td className="px-2 md:px-4">
                    <StatusBadge status={d.status} animated />
                  </td>

                  <td className="px-2 md:px-4 text-gray-500 whitespace-nowrap">
                    {d.lastSeen
                      ? new Date(d.lastSeen).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredDevices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-lg font-medium">No devices found.</p>
            <p className="text-sm">Try changing your search.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #111;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}