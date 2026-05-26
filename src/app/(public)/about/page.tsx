import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">About NexaGrid</p>
        <h1 className="mt-4 font-heading text-5xl font-bold text-balance text-emerald md:text-6xl">
          A modern Nigerian smart-commerce system for connected communities.
        </h1>
        <p className="mt-5 text-xl text-warm-gray">
          NexaGrid helps everyday Nigerians shop local, book trusted services, move goods quickly, and find safe short-let stays without stress.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["Marketplace", "Compare prices from verified vendors, buy groceries and essentials, and enjoy simpler checkout flows."],
          ["Services", "Book electricians, tutors, plumbers, and skilled artisans with clear pricing and trusted reviews."],
          ["Living & Logistics", "Track deliveries, manage rider tasks, and find secure apartments around Redemption City and beyond."],
        ].map(([title, copy]) => (
          <Card key={title}>
            <h2 className="font-heading text-3xl">{title}</h2>
            <p className="mt-4 text-lg text-warm-gray">{copy}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
