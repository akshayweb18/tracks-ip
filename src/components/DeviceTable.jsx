"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import Link from "next/link";
import { FaLaptop, FaWifi } from "react-icons/fa";

export default function DeviceTable({ search }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDevices() {
      try {
        setLoading(true);
        const res = await fetch("/api/devices");
        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error("Failed to load devices:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDevices();
  }, []);

  const filteredDevices = useMemo(() => {
    const query = search?.toLowerCase().trim() || "";
    if (!query) return devices;

    return devices.filter((d) =>
      d.assignedEmployee.toLowerCase().includes(query) ||
      d.deviceId.toLowerCase().includes(query) ||
      d.publicIP.toLowerCase().includes(query) ||
      d.location.toLowerCase().includes(query)
    );
  }, [search, devices]);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <div className="overflow-x-auto max-h-[600px] relative custom-scrollbar">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded relative overflow-hidden flex items-center px-4"
              >
                <div className="flex-1 h-4 bg-gray-300 rounded mr-4"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b text-left text-gray-600">
                <th className="py-3 px-4">Employee</th>
                <th className="px-4">Device ID</th>
                <th className="px-4">IP Address</th>
                <th className="px-4">Location</th>
                <th className="px-4">Status</th>
                <th className="px-4">Last Active</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.map((d) => (
                <tr
                  key={d._id}
                  className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium text-blue-600 hover:underline flex items-center gap-2">
                    <FaLaptop className="text-gray-400" />
                    <Link href={`/devices/${d._id}`}>{d.assignedEmployee}</Link>
                  </td>
                  <td className="px-4">{d.deviceId}</td>
                  <td className="px-4 flex items-center gap-1">
                    <FaWifi className="text-gray-400" />
                    {d.publicIP}
                  </td>
                  <td className="px-4">{d.location}</td>
                  <td className="px-4">
                    <StatusBadge status={d.status} animated />
                  </td>
                  <td className="px-4 text-gray-500">
                    {new Date(d.lastActive).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredDevices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-6h6v6m2 0h2a2 2 0 002-2V9a2 2 0 00-2-2h-2m-8 0H5a2 2 0 00-2 2v6a2 2 0 002 2h2"
              />
            </svg>
            <p className="text-lg font-medium">No devices found.</p>
            <p className="text-sm">Try changing your search or check back later.</p>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        /* Chrome, Edge, Safari */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #111; /* black scrollbar */
          border-radius: 4px;
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #111 #f1f1f1;
        }
      `}</style>
    </div>
  );
}