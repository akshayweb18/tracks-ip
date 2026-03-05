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
    <div className="flex justify-center items-start py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <FaLaptop className="text-indigo-600" />
            <span>Register a Device</span>
          </h1>
        {success ? (
          <div className="text-center">
            <FaCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">Device registered successfully!</p>
            <pre className="mt-4 text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(success, null, 2)}
            </pre>
            <button
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={resetForm}
            >
              Register another device
            </button>
            <p className="mt-4">
              <a href="/" className="text-indigo-600 hover:underline">
                Back to dashboard
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm flex items-center gap-2">
                <FaTimesCircle /> {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Device ID</label>
              <input
                type="text"
                placeholder="e.g. LAPTOP-1234"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned Employee</label>
              <input
                type="text"
                placeholder="Full name"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location (optional)</label>
              <input
                type="text"
                placeholder="Office or lab"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Device"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
