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
      {/* mobile card list */}
      {!loading && (
        <div className="space-y-4 md:hidden">
          {filteredDevices.map((d) => (
            <Link
              key={d._id}
              href={`/devices/${d._id}`}
              className="block bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-blue-600 truncate">
                  {d.assignedEmployee}
                </p>
                <StatusBadge status={d.status} />
              </div>
              <p className="text-sm text-gray-500 truncate">{d.deviceId}</p>
              <div className="flex items-center text-sm text-gray-700 mt-1">
                <FaWifi className="mr-1" />{d.publicIP}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="overflow-x-auto max-h-[600px] relative custom-scrollbar hidden md:block">

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
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b text-left text-gray-600">
                <th className="py-3 px-2 md:px-4">Employee</th>
                <th className="px-2 md:px-4">Device</th>
                <th className="px-2 md:px-4">Public IP</th>
                <th className="hidden lg:table-cell px-2 md:px-4">Local IP</th>
                <th className="hidden lg:table-cell px-2 md:px-4">System</th>
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

                  <td className="hidden lg:table-cell px-2 md:px-4">{d.localIP}</td>

                  <td className="hidden lg:table-cell px-2 md:px-4">
                    <div className="text-sm">
                      {d.systemInfo?.platform ? (
                        <div>{`${d.systemInfo.platform} ${d.systemInfo.release || ""}`}</div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                      <div className="text-xs text-gray-500">
                        {d.systemInfo?.cpuModel || ""}
                        {d.systemInfo?.totalMem
                          ? ` • ${(d.systemInfo.totalMem / (1024 ** 3)).toFixed(1)} GB`
                          : ""}
                      </div>
                    </div>
                  </td>

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