import { Card } from "@/components/ui/card";

export default function VendorOnboardingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-emerald-950 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Vendor setup</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">Start selling in your community.</h1>
          <p className="mt-4 max-w-xl text-sm text-emerald-100 sm:text-base">Set up your shop, verify your identity, and begin receiving orders from nearby customers.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Shop profile", "Catalog import", "Wallet settlement"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <h2 className="font-heading text-2xl font-semibold">Quick signup</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Shop name</div>
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">0803 123 4567</div>
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Ikeja, Lagos</div>
            <button className="w-full rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white">Continue</button>
          </div>
        </Card>
      </div>
    </section>
  );
}
