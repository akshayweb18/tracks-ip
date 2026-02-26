"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DeviceDetails() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);

  useEffect(() => {
    fetch("/api/devices")
      .then(res => res.json())
      .then(data => {
        const found = data.find(d => d._id === id);
        setDevice(found);
      });
  }, [id]);

  if (!device) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Device Details
        </h2>

        <div className="space-y-3">
          <p><strong>Employee:</strong> {device.assignedEmployee}</p>
          <p><strong>Device ID:</strong> {device.deviceId}</p>
          <p><strong>Serial:</strong> {device.serialNumber}</p>
          <p><strong>IP:</strong> {device.publicIP}</p>
          <p><strong>Location:</strong> {device.location}</p>
          <p><strong>Status:</strong> {device.status}</p>
          <p><strong>Last Active:</strong> {new Date(device.lastActive).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}