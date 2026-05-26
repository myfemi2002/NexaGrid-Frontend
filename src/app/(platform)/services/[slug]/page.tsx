import { Card } from "@/components/ui/card";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Verified provider</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold capitalize sm:text-5xl">{slug.replaceAll("-", " ")}</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">Trusted service profile, availability, reviews, and escrow-ready booking details for your tenant.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["4.9 rating", "Same-day booking", "Escrow ready"].map((item) => (
              <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800">{item}</span>
            ))}
          </div>
        </div>
        <Card className="p-6">
          <h2 className="font-heading text-2xl font-semibold">Book now</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Select date</div>
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Location: Lagos Mainland</div>
            <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">Budget: ₦0 - ₦25,000</div>
            <button className="w-full rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white">Request booking</button>
          </div>
        </Card>
      </div>
    </section>
  );
}
