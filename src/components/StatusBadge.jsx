"use client";

export default function StatusBadge({ status, animated }) {
  const isActive = status === "Active";

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
        ${isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"}
      `}
    >
      {/* Dot */}
      <span
        className={`
          w-2 h-2 rounded-full
          ${isActive ? "bg-green-500" : "bg-red-500"}
          ${animated && isActive ? "animate-pulse" : ""}
        `}
      />

      {status}
    </span>
  );
}