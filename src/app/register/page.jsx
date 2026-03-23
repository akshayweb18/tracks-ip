"use client";

import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaLaptop } from "react-icons/fa";

export default function RegisterPage() {
  const [deviceId, setDeviceId] = useState("");
  const [employee, setEmployee] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic client-side validation
    if (!/^[\w-]+$/i.test(deviceId.trim())) {
      setError("Device ID can only contain letters, numbers, hyphens or underscores.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, assignedEmployee: employee, location }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");
      setSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDeviceId("");
    setEmployee("");
    setLocation("");
    setError(null);
    setSuccess(null);
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8 animate-fade-up">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
            <FaLaptop className="text-cyan-700" />
            <span>Register a Device</span>
          </h1>
        <p className="mb-6 text-center text-sm text-slate-600">Add a new endpoint and start heartbeat monitoring instantly.</p>
        {success ? (
          <div className="text-center">
            <FaCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">Device registered successfully!</p>
            <pre className="mt-4 max-h-56 overflow-auto rounded bg-slate-100 p-2 text-left text-xs sm:text-sm">
              {JSON.stringify(success, null, 2)}
            </pre>
            <button
              className="mt-6 inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
              onClick={resetForm}
            >
              Register another device
            </button>
            <p className="mt-4">
              <a href="/" className="text-cyan-700 hover:underline">
                Back to dashboard
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <FaTimesCircle /> {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Device ID</label>
              <input
                type="text"
                placeholder="e.g. LAPTOP-1234"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Assigned Employee</label>
              <input
                type="text"
                placeholder="Full name"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Location (optional)</label>
              <input
                type="text"
                placeholder="Office or lab"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Device"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
