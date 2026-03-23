import StatsCards from "@/components/StatsCards";
import DeviceTable from "@/components/DeviceTable";

export default function Home() {
  return (
    <section className="animate-fade-up">
      <div className="surface-panel mb-6 p-5 sm:p-6 lg:p-7">
        <p className="eyebrow">Realtime Monitoring</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          IP Tracking Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Live visibility of your device fleet, network identity, and connection health.
        </p>
      </div>

      {/* Top Stats */}
      <StatsCards />

      {/* Table */}
      <DeviceTable />
    </section>
  );
}