"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function DeviceTable() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function loadDevices() {
      const res = await fetch("/api/devices");
      const data = await res.json();
      setDevices(data);
    }

    loadDevices();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3">Employee</th>
            <th>Device ID</th>
            <th>IP Address</th>
            <th>Location</th>
            <th>Status</th>
            <th>Last Active</th>
          </tr>
        </thead>

        <tbody>
          {devices.map((d) => (
            <tr
              key={d._id}
              className="border-b hover:bg-gray-50 transition cursor-pointer"
            >
              <td className="py-3 font-medium text-blue-600 hover:underline">
                <Link href={`/devices/${d._id}`}>
                  {d.assignedEmployee}
                </Link>
              </td>

              <td>{d.deviceId}</td>
              <td>{d.publicIP}</td>
              <td>{d.location}</td>
              <td>
                <StatusBadge status={d.status} />
              </td>
              <td>
                {d.lastActive
                  ? new Date(d.lastActive).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {devices.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No devices found.
        </div>
      )}
    </div>
  );
}