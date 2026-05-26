import { Card } from "@/components/ui/card";
import { serviceListings } from "@/lib/mock-data";

export default function ServiceBookingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Services</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-5xl">Book trusted help near you.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Electricians, cleaners, plumbers, and tutors ready for your community.</p>
        </div>
        <button className="w-fit rounded-full border border-border px-4 py-2 text-sm font-medium">Filter</button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {serviceListings.map((service) => (
          <Card key={service.id} className="p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">{service.category}</p>
            <h2 className="mt-3 font-heading text-2xl font-semibold">{service.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{service.summary}</p>
            <div className="mt-5 flex items-center justify-between">
              <p className="font-medium text-foreground">{service.rate}</p>
              <button className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">Book</button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
