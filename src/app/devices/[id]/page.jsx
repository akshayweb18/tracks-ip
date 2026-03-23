"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaLaptop, FaNetworkWired, FaServer, FaClock, FaCheckCircle, FaTimesCircle, FaHdd, FaCog, FaMicrochip, FaBrain } from "react-icons/fa";


export default function DeviceDetails() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/devices")
      .then(res => res.json())
      .then(data => {
        const found = data.find(d => d._id === id);
        setDevice(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch device:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin mb-6 inline-block">
          <FaLaptop size={56} className="text-blue-600" />
        </div>
        <p className="text-xl text-gray-700 font-medium">Loading device details...</p>
      </div>
    </div>
  );

  if (!device) return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center">
        <FaTimesCircle size={72} className="mx-auto mb-6 text-red-500" />
        <p className="text-2xl text-gray-900 font-bold mb-2">Device Not Found</p>
        <p className="text-gray-600">The requested device could not be located.</p>
      </div>
    </div>
  );

  const lastSeenDate = device.lastSeen ? new Date(device.lastSeen).toLocaleString() : "N/A";
  const createdDate = device.createdAt ? new Date(device.createdAt).toLocaleString() : "N/A";
  const systemInfo = device.systemInfo || {};
  const isActive = device.status === "Active";
  
  const formatBytes = (bytes) => {
    if (!bytes) return "N/A";
    return `${(bytes / (1024 ** 3)).toFixed(1)} GB`;
  };

  const uptime = device.lastSeen ? Math.floor((Date.now() - new Date(device.lastSeen)) / 1000) : null;
  const uptimeText = uptime ? `${uptime < 60 ? uptime + 's' : Math.floor(uptime / 60) + 'm'} ago` : "N/A";
  const memoryPercent = systemInfo.freeMem && systemInfo.totalMem ? ((systemInfo.freeMem / systemInfo.totalMem) * 100).toFixed(1) : 0;

  const metricStyles = {
    blue: {
      iconBox: "bg-cyan-50",
      iconColor: "text-cyan-700",
    },
    green: {
      iconBox: "bg-emerald-50",
      iconColor: "text-emerald-700",
    },
    amber: {
      iconBox: "bg-amber-50",
      iconColor: "text-amber-700",
    },
    slate: {
      iconBox: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  };

  return (
    <section className="animate-fade-up">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6">
          <Link href="/devices" className="inline-flex items-center gap-2 font-medium text-cyan-700 transition-colors hover:text-cyan-900">
            <FaArrowLeft size={16} />
            Back to Devices
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-6 flex-1 min-w-0">
              <div className="rounded-xl bg-cyan-50 p-4 shadow-sm">
                <FaLaptop size={30} className="text-cyan-700" />
              </div>
              <div className="min-w-0">
                <h1 className="mb-1 wrap-break-word text-2xl font-bold text-slate-900 sm:text-4xl">{device.assignedEmployee}</h1>
                <p className="inline-block rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-sm text-slate-700 sm:text-base">{device.deviceId}</p>
              </div>
            </div>
            <div className="shrink-0">
              <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${isActive ? 'border-emerald-300 bg-emerald-100 text-emerald-700' : 'border-rose-300 bg-rose-100 text-rose-700'}`}>
                {isActive ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                {device.status}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Last Seen", value: uptimeText, icon: FaClock, color: "blue" },
            { label: "Public IP", value: device.publicIP, icon: FaNetworkWired, color: "green" },
            { label: "Local IP", value: device.localIP || "N/A", icon: FaHdd, color: "slate" },
            { label: "Memory", value: formatBytes(systemInfo.totalMem), icon: FaBrain, color: "amber" }
          ].map((metric, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">{metric.label}</p>
                <div className={`rounded-lg p-2 ${metricStyles[metric.color].iconBox}`}>
                  <metric.icon size={16} className={metricStyles[metric.color].iconColor} />
                </div>
              </div>
              <p className="truncate text-lg font-bold text-slate-900 sm:text-xl">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Device Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-lg bg-cyan-100 p-2.5">
                <FaLaptop className="text-cyan-700" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Device Information</h2>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Device ID</p>
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800 sm:text-base">{device.deviceId}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Location</p>
                <p className="text-base text-slate-800 sm:text-lg">{device.location || <span className="text-slate-400">Not specified</span>}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Assigned Employee</p>
                <p className="text-base font-semibold text-slate-900 sm:text-lg">{device.assignedEmployee}</p>
              </div>
            </div>
          </div>

          {/* Network Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <FaNetworkWired className="text-emerald-700" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Network Information</h2>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Public IP Address</p>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                  <p className="break-all font-mono text-base font-bold text-emerald-900 sm:text-lg">{device.publicIP}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Local IP Address</p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="break-all font-mono text-base font-bold text-blue-900 sm:text-lg">{device.localIP || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Connection Status</p>
                <div className={`rounded-lg border-2 px-5 py-3 text-center text-sm font-bold sm:text-base ${isActive ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700'}`}>
                  {isActive ? '✓ Active' : '✗ Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-lg bg-slate-200 p-2.5">
              <FaServer className="text-slate-800" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">System Specifications</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { label: "OS", value: systemInfo.platform ? `${systemInfo.platform} ${systemInfo.release || ""}`.trim() : "N/A", icon: FaMicrochip, color: "slate" },
              { label: "Architecture", value: systemInfo.arch || "N/A", icon: FaCog, color: "amber" },
              { label: "CPU Model", value: systemInfo.cpuModel || "N/A", icon: FaBrain, color: "blue" },
              { label: "Total Memory", value: formatBytes(systemInfo.totalMem), icon: FaHdd, color: "green" }
            ].map((spec, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{spec.label}</p>
                  <div className={`rounded-lg p-2 ${metricStyles[spec.color].iconBox}`}>
                    <spec.icon size={16} className={metricStyles[spec.color].iconColor} />
                  </div>
                </div>
                <p className="wrap-break-word text-base font-semibold text-slate-900 sm:text-lg">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Memory Usage */}
          {systemInfo.freeMem && systemInfo.totalMem && (
            <div className="mt-6 rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700">Memory Usage</p>
                <p className="text-xl font-bold text-slate-900 sm:text-2xl">{memoryPercent}% Free</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-linear-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${memoryPercent}%` }}
                ></div>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700 sm:flex-row sm:justify-between">
                <span>Free: <strong>{formatBytes(systemInfo.freeMem)}</strong></span>
                <span>Total: <strong>{formatBytes(systemInfo.totalMem)}</strong></span>
              </div>
            </div>
          )}
        </div>
        {/* Activity Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-lg bg-cyan-100 p-2.5">
              <FaClock className="text-cyan-700" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Activity Timeline</h2>
          </div>
          <div className="space-y-5">
            {[
              { label: "Last Seen", value: lastSeenDate, icon: FaCheckCircle },
              { label: "Created", value: createdDate, icon: FaClock },
              { label: "Last Updated", value: device.updatedAt ? new Date(device.updatedAt).toLocaleString() : "N/A", icon: FaClock }
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100">
                    <activity.icon size={16} className="text-cyan-700" />
                  </div>
                  {idx < 2 && <div className="mt-2 h-8 w-1 bg-cyan-200"></div>}
                </div>
                <div className="pt-2 pb-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{activity.label}</p>
                  <p className="text-sm font-semibold text-slate-900 sm:text-lg">{activity.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}