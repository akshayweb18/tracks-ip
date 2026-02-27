// import DeviceTable from "@/components/DeviceTable";

// export default function DevicesPage() {
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">
//         Registered Devices
//       </h1>
//       <DeviceTable />
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    const res = await fetch("/api/devices");
    const data = await res.json();
    setDevices(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Device Tracking</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Device</th>
            <th>Employee</th>
            <th>Public IP</th>
            <th>Status</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d._id}>
              <td>{d.deviceId}</td>
              <td>{d.assignedEmployee}</td>
              <td>{d.publicIP}</td>
              <td>
                <span style={{ color: d.status === "Active" ? "green" : "red" }}>
                  {d.status}
                </span>
              </td>
              <td>{new Date(d.lastSeen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}