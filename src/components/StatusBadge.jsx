export default function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium
      ${status === "online"
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-red-600"}`}>
      {status}
    </span>
  );
}