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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin mb-6 inline-block">
          <FaLaptop size={56} className="text-blue-600" />
        </div>
        <p className="text-xl text-gray-700 font-medium">Loading device details...</p>
      </div>
    </div>
  );

  if (!device) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <Link href="/devices" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <FaArrowLeft size={16} />
            Back to Devices
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-6 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl shadow-sm flex-shrink-0">
                <FaLaptop size={32} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-1 break-words">{device.assignedEmployee}</h1>
                <p className="text-lg text-gray-600 font-mono bg-gray-50 px-4 py-2 rounded-lg inline-block">{device.deviceId}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className={`flex items-center gap-3 px-5 py-3 rounded-full font-semibold text-sm ${isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'}`}>
                {isActive ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                {device.status}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Last Seen", value: uptimeText, icon: FaClock, color: "blue" },
            { label: "Public IP", value: device.publicIP, icon: FaNetworkWired, color: "green" },
            { label: "Local IP", value: device.localIP || "N/A", icon: FaHdd, color: "purple" },
            { label: "Memory", value: formatBytes(systemInfo.totalMem), icon: FaBrain, color: "orange" }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{metric.label}</p>
                <div className={`p-2 rounded-lg bg-${metric.color}-50`}>
                  <metric.icon size={18} className={`text-${metric.color}-600`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 truncate">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Device Information */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaLaptop className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Device Information</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Device ID</p>
                <p className="text-lg font-mono bg-slate-50 p-4 rounded-lg text-gray-800 border border-slate-200">{device.deviceId}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Location</p>
                <p className="text-lg text-gray-800">{device.location || <span className="text-gray-400">Not specified</span>}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Assigned Employee</p>
                <p className="text-lg font-semibold text-gray-900">{device.assignedEmployee}</p>
              </div>
            </div>
          </div>

          {/* Network Information */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaNetworkWired className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Network Information</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Public IP Address</p>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                  <p className="text-lg font-mono font-bold text-emerald-900">{device.publicIP}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Local IP Address</p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-lg font-mono font-bold text-blue-900">{device.localIP || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Connection Status</p>
                <div className={`px-6 py-3 rounded-lg font-bold text-center border-2 ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-rose-50 text-rose-700 border-rose-300'}`}>
                  {isActive ? '✓ Active' : '✗ Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaServer className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">System Specifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "OS", value: systemInfo.platform ? `${systemInfo.platform} ${systemInfo.release || ""}`.trim() : "N/A", icon: FaMicrochip, color: "purple" },
              { label: "Architecture", value: systemInfo.arch || "N/A", icon: FaCog, color: "orange" },
              { label: "CPU Model", value: systemInfo.cpuModel || "N/A", icon: FaBrain, color: "cyan" },
              { label: "Total Memory", value: formatBytes(systemInfo.totalMem), icon: FaHdd, color: "green" }
            ].map((spec, idx) => (
              <div key={idx} className={`bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{spec.label}</p>
                  <div className={`p-2 rounded-lg bg-${spec.color}-100`}>
                    <spec.icon size={16} className={`text-${spec.color}-600`} />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Memory Usage */}
          {systemInfo.freeMem && systemInfo.totalMem && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Memory Usage</p>
                <p className="text-2xl font-bold text-gray-900">{memoryPercent}% Free</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${memoryPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-700">
                <span>Free: <strong>{formatBytes(systemInfo.freeMem)}</strong></span>
                <span>Total: <strong>{formatBytes(systemInfo.totalMem)}</strong></span>
              </div>
            </div>
          )}
        </div>
        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaClock className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Activity Timeline</h2>
          </div>
          <div className="space-y-6">
            {[
              { label: "Last Seen", value: lastSeenDate, color: "emerald", icon: FaCheckCircle },
              { label: "Created", value: createdDate, color: "blue", icon: FaClock },
              { label: "Last Updated", value: device.updatedAt ? new Date(device.updatedAt).toLocaleString() : "N/A", color: "indigo", icon: FaClock }
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <activity.icon size={18} className={`text-${activity.color}-600`} />
                  </div>
                  {idx < 2 && <div className={`w-1 h-8 bg-${activity.color}-200 mt-2`}></div>}
                </div>
                <div className="pt-2 pb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{activity.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{activity.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}