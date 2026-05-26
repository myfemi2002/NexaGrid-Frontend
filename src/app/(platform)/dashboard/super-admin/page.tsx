import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  return (
    <DashboardShell slug="super-admin" title="Platform Overview" subtitle="Watch performance across all communities, merchants, deliveries, and support flows.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="font-heading text-4xl">Tenant Performance</h2>
          <div className="mt-6 space-y-4">
            {["Redemption Camp • Strong vendor growth", "Lekki District • Top delivery revenue", "Campus Market • High student demand"].map((item) => (
              <div key={item} className="rounded-2xl border border-line p-4">{item}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-4xl">Platform Monitoring</h2>
          <div className="mt-6 space-y-4">
            {["Notifications healthy", "Payments queue normal", "Two support cases under review"].map((item) => (
              <div key={item} className="rounded-2xl border border-line p-4">{item}</div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/dashboard/super-admin/settings/smtp" className="rounded-full bg-emerald px-4 py-2 text-sm font-medium text-white">
              Open SMTP Settings
            </Link>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
