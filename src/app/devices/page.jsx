"use client";

import DeviceTable from "@/components/DeviceTable";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function DevicesPage() {
  const [search, setSearch] = useState("");

  return (
    <section className="animate-fade-up">
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Devices
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, monitor, and inspect every tracked endpoint.
          </p>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search device or employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-full border border-slate-300 px-10 text-sm text-slate-800 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      <DeviceTable search={search} />
    </section>
  );
}