"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import Link from "next/link";
import { FaLaptop, FaWifi } from "react-icons/fa";

export default function DeviceTable({ search }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDevices() {
    try {
      setError("");
      const res = await fetch("/api/devices", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load devices.");
      }
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
      setError(err.message || "Unable to load devices.");
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
    <div className="surface-panel p-4 md:p-6 animate-fade-up">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
        <div>
          <p className="eyebrow">Device Registry</p>
          <h3 className="text-lg font-semibold text-slate-900">Live Endpoints</h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {filteredDevices.length} shown
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* mobile card list */}
      {loading && (
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-2/5 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3 md:hidden">
          {filteredDevices.map((d) => (
            <Link
              key={d._id}
              href={`/devices/${d._id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="max-w-[60%] truncate font-medium text-cyan-700">
                  {d.assignedEmployee}
                </p>
                <StatusBadge status={d.status} />
              </div>
              <p className="truncate text-sm text-slate-500">{d.deviceId}</p>
              <div className="mt-1 flex items-center text-sm text-slate-700">
                <FaWifi className="mr-1" />{d.publicIP}
              </div>
            </Link>
          ))}

          {filteredDevices.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
              <p className="font-medium text-slate-700">No devices found.</p>
              <p className="mt-1 text-sm">Try changing your search.</p>
            </div>
          )}
        </div>
      )}

      <div className="relative hidden max-h-160 overflow-x-auto custom-scrollbar md:block">

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
        ) : !error ? (
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b text-left text-slate-600">
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
                  className="border-b transition-colors hover:bg-slate-50"
                >
                  <td className="flex items-center gap-2 px-2 py-3 font-medium text-cyan-700 hover:underline md:px-4">
                    <FaLaptop className="text-slate-400" />
                    <Link href={`/devices/${d._id}`}>
                      {d.assignedEmployee}
                    </Link>
                  </td>

                  <td className="px-2 md:px-4">{d.deviceId}</td>

                  <td className="flex items-center gap-1 px-2 md:px-4">
                    <FaWifi className="text-slate-400" />
                    {d.publicIP}
                  </td>

                  <td className="hidden lg:table-cell px-2 md:px-4">{d.localIP}</td>

                  <td className="hidden lg:table-cell px-2 md:px-4">
                    <div className="text-sm">
                      {d.systemInfo?.platform ? (
                        <div>{`${d.systemInfo.platform} ${d.systemInfo.release || ""}`}</div>
                      ) : (
                        <div className="text-slate-400">-</div>
                      )}
                      <div className="text-xs text-slate-500">
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

                  <td className="whitespace-nowrap px-2 text-slate-500 md:px-4">
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
        ) : null}

        {!loading && !error && filteredDevices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
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