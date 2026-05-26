import { Card } from "@/components/ui/card";

export default function HostOnboardingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Host onboarding</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">List your apartment with confidence.</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">Show availability, manage bookings, and receive earnings without stress.</p>
          <div className="mt-6 space-y-3">
            {["Property listing", "Availability calendar", "Guest operations"].map((item) => (
              <div key={item} className="rounded-2xl border border-border px-4 py-3 text-sm">{item}</div>
            ))}
          </div>
        </Card>

        <div className="rounded-[2rem] bg-amber-50 p-6">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
            <h2 className="font-heading text-2xl font-semibold">Host checklist</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>1. Add apartment photos and price in ₦.</p>
              <p>2. Set check-in and check-out rules.</p>
              <p>3. Confirm identity and payout details.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
