"use client";

import DeviceTable from "@/components/DeviceTable";
import StatsCards from "@/components/StatsCards";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function DevicesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        Device Monitoring Dashboard
      </h1>

      {/* Search Input */}
      <div className="mb-6 flex justify-center md:justify-end">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search device or employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition-all duration-300 hover:shadow-md"
          />
        </div>
      </div>

      {/* Device Table */}
     
        <DeviceTable search={search} />
     
    </div>
  );
}