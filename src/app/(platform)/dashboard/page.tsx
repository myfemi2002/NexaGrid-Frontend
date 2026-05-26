import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function DashboardIndexPage() {
  const items = [
    ["Customer Dashboard", "/dashboard/customer"],
    ["Vendor Dashboard", "/dashboard/vendor"],
    ["Rider Dashboard", "/dashboard/logistics"],
    ["Service Provider", "/dashboard/service-provider"],
    ["Wallet", "/wallet"],
    ["Admin Dashboard", "/dashboard/admin"],
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <h1 className="font-heading text-5xl font-bold text-emerald">Choose a dashboard</h1>
      <p className="mt-3 text-xl text-warm-gray">Open the workspace that matches your role on NexaGrid.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map(([label, href]) => (
          <Link key={href} href={href}>
            <Card className="h-full">
              <h2 className="font-heading text-2xl">{label}</h2>
              <p className="mt-3 text-warm-gray">Open {label.toLowerCase()}.</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
