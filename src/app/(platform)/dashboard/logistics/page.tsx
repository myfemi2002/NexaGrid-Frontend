import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LogisticsDashboardPage() {
  return (
    <DashboardShell slug="logistics" title="Rider Dashboard" subtitle="Track active deliveries, available tasks, and your daily earnings.">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-emerald-950 text-white sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Today's Total Earnings</p>
              <p className="mt-3 font-heading text-5xl font-semibold">₦12,450.00</p>
              <div className="mt-6 flex gap-3 text-sm text-emerald-100">
                <span className="rounded-full bg-white/10 px-3 py-2">8 Completed</span>
                <span className="rounded-full bg-white/10 px-3 py-2">6.5 Hours</span>
              </div>
            </Card>
            <Card className="bg-muted text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Rider Rating</p>
              <p className="mt-3 font-heading text-5xl font-semibold text-emerald-950">4.92</p>
              <p className="mt-2 text-sm text-muted-foreground">Top 5% in Redemption City</p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <Card className="overflow-hidden p-0">
              <div className="min-h-[24rem] bg-emerald-100 p-4">
                <div className="rounded-2xl bg-white/90 px-4 py-2 text-sm shadow-sm">Next Stop - Km 46, Lagos-Ibadan Expy</div>
              </div>
            </Card>

            <Card className="border-emerald-950 p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-950">In Progress</span>
                <span className="text-sm text-muted-foreground">#NG-8829</span>
              </div>
              <h2 className="mt-5 font-heading text-4xl font-semibold">Luxury Hamper Delivery</h2>
              <div className="mt-8 space-y-5 text-sm">
                <div>
                  <p className="text-muted-foreground">Pick-up From</p>
                  <p className="mt-1">Redemption City Central Hub, Block C</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deliver To</p>
                  <p className="mt-1 font-semibold">House 12, Wisdom Estate, Phase 2</p>
                </div>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <Button variant="secondary" className="h-14">Call Customer</Button>
                <Button className="h-14">Confirm Pick Up</Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-semibold">Available Tasks</h2>
            <button className="text-sm font-medium text-emerald-950">Refresh</button>
          </div>
          <div className="grid gap-4">
            {[
              ["Electronics Package", "RCCG Youth Village • 1.2km away", "₦1,200"],
              ["Lunch Bundle (3x)", "CRM Canteen • 0.8km away", "₦850"],
            ].map(([title, copy, amount]) => (
              <Card key={title} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                </div>
                <p className="font-heading text-2xl font-semibold text-emerald-950">{amount}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-muted p-6">
            <h2 className="font-heading text-3xl font-semibold">Recent History</h2>
            <div className="mt-6 space-y-4">
              {[
                ["Order #NG-8812", "Completed • 10:45 AM", "+ ₦1,500.00"],
                ["Order #NG-8805", "Completed • 09:30 AM", "+ ₦2,100.00"],
                ["Daily Bonus Reward", "System Credit • 08:00 AM", "+ ₦500.00"],
              ].map(([title, subtitle, amount]) => (
                <div key={title} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  </div>
                  <p className="font-medium text-emerald-950">{amount}</p>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-6 w-full">View Full History</Button>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
