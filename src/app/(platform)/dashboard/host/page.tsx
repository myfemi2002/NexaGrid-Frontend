import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";

export default function HostDashboardPage() {
  return (
    <DashboardShell slug="host" title="Host Dashboard" subtitle="Manage apartment bookings, availability, guest check-ins, and payouts without complexity.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="font-heading text-4xl">Apartment Management</h2>
          <div className="mt-6 space-y-4">
            {["The Glass House, Lekki", "Savannah Studio, Camp Area", "Emerald Suite, Redemption City"].map((item) => (
              <div key={item} className="rounded-2xl border border-line p-4">{item}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-4xl">Upcoming Reservations</h2>
          <div className="mt-6 space-y-4">
            {["2-night booking • 12 Oct", "Weekend stay • 18 Oct", "Executive guest • 26 Oct"].map((item) => (
              <div key={item} className="rounded-2xl border border-line p-4">{item}</div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
