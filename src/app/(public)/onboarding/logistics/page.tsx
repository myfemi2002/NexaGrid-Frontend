import { Card } from "@/components/ui/card";

export default function LogisticsOnboardingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] bg-emerald-950 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Logistics partner</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">Deliver faster across your tenant.</h1>
          <p className="mt-4 max-w-xl text-sm text-emerald-100 sm:text-base">Register your fleet, manage riders, and track payments in one simple flow.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Fleet registration", "Live dispatch", "Payout operations"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium">{item}</div>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <h2 className="font-heading text-2xl font-semibold">Coverage details</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Company name</div>
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Fleet size</div>
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Lagos Mainland, Abuja, Port Harcourt</div>
            <button className="w-full rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white">Start onboarding</button>
          </div>
        </Card>
      </div>
    </section>
  );
}
