import { Card } from "@/components/ui/card";

const items = [
  { title: "Order packed", body: "Your bag of rice is ready for pickup.", time: "Just now" },
  { title: "Delivery agent assigned", body: "Chidi will deliver to Redemption City Gate.", time: "14 mins ago" },
  { title: "Escrow release pending", body: "Waiting for customer confirmation.", time: "1 hour ago" },
  { title: "Apartment booking approved", body: "The Glass House is confirmed for Oct 12.", time: "Today" },
];

export default function NotificationsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Alerts</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-5xl">Notification center</h1>
        </div>
        <button className="rounded-full border border-border px-4 py-2 text-sm font-medium">Mark all read</button>
      </div>

      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <Card key={item.title} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-muted-foreground">{item.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
