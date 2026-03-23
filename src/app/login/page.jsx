"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // placeholder logic - replace with real auth later
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@company.com" && password === "password123") {
        localStorage.setItem("token", "dummy-auth-token");
        window.location.href = "/";
      } else {
        setError("Invalid email or password");
      }
    }, 800);
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8 animate-fade-up">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
          <FaUser className="text-cyan-700" />
          Admin Login
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">Access the monitoring console securely.</p>
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <div className="mt-1 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 pl-10 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 pl-10 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
