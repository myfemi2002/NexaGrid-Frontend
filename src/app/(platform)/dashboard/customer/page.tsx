import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { apartmentListings, marketplaceProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function CustomerDashboardPage() {
  return (
    <DashboardShell slug="customer" title="Welcome back" subtitle="Your orders, bookings, wallet, and savings in one simple place.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-4xl">Recent Orders</h2>
            <span className="text-lg text-emerald">See all</span>
          </div>
          <div className="space-y-4">
            {marketplaceProducts.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-line p-3">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-warm-gray">{item.eta}</p>
                </div>
                <p className="font-semibold text-emerald">{formatCurrency(item.price, "NGN")}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-4xl">Upcoming Stay</h2>
          <img src={apartmentListings[1].image} alt={apartmentListings[1].name} className="mt-5 h-56 w-full rounded-[1.5rem] object-cover" />
          <p className="mt-4 font-heading text-2xl">{apartmentListings[1].name}</p>
          <p className="mt-2 text-warm-gray">{apartmentListings[1].zone}</p>
        </Card>
      </div>
    </DashboardShell>
  );
}
