import { Card } from "@/components/ui/card";

const threads = [
  { name: "Amina's Farm Store", note: "Need 3 extra bags of rice", time: "2 min ago", status: "Online" },
  { name: "Chidi Rider", note: "Delivery at Gate 4 in 12 mins", time: "12 min ago", status: "In transit" },
  { name: "The Glass House", note: "Booking confirmation shared", time: "1 hour ago", status: "Host reply" },
];

export default function MessagesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-emerald-950 px-6 py-8 text-white sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Messages</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">Talk to vendors, riders, and hosts.</h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-100 sm:text-base">Simple chat for orders, bookings, negotiations, and support across your tenant.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {threads.map((thread) => (
            <Card key={thread.name} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{thread.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{thread.note}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">{thread.status}</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{thread.time}</p>
            </Card>
          ))}
        </div>

        <Card className="min-h-[30rem] p-4 sm:p-6">
          <div className="flex h-full flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="max-w-[70%] rounded-2xl bg-muted px-4 py-3 text-sm">
                Do you still have the 25kg bag in stock?
              </div>
              <div className="ml-auto max-w-[70%] rounded-2xl bg-emerald-950 px-4 py-3 text-sm text-white">
                Yes, we have 12 left. We can deliver today.
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3">
              <p className="text-sm text-muted-foreground">Type a message</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
