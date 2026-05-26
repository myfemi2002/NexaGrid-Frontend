import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">Plans</p>
        <h1 className="mt-4 font-heading text-5xl font-bold text-emerald md:text-6xl">Simple plans for local commerce growth.</h1>
        <p className="mt-5 text-xl text-warm-gray">
          Start small, grow confidently, and move into more tools only when your market, store, or service business needs them.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {[
          ["Starter", "₦25,000 / month", "For small vendors, service providers, and local sellers getting online."],
          ["Business", "₦85,000 / month", "For growing stores, dispatch teams, and apartment hosts managing more daily activity."],
          ["Community", "Custom", "For smart districts, estates, campuses, and larger communities with multiple operators."],
        ].map(([title, price, copy], index) => (
          <Card key={title} className={index === 1 ? "bg-emerald text-white" : ""}>
            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${index === 1 ? "text-white/70" : "text-emerald"}`}>{title}</p>
            <p className="mt-5 font-heading text-5xl font-bold">{price}</p>
            <p className={`mt-4 text-lg ${index === 1 ? "text-white/80" : "text-warm-gray"}`}>{copy}</p>
            <Button className="mt-8" variant={index === 1 ? "gold" : "primary"}>Request Demo</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
