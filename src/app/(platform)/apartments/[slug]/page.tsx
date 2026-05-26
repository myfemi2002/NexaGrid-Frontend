import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apartmentListings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function ApartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apartment = apartmentListings.find((item) => item.id === slug);
  if (!apartment) notFound();

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden p-0">
          <img src={apartment.image} alt={apartment.name} className="min-h-[420px] w-full object-cover" />
          <div className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">{apartment.zone}</p>
            <h1 className="mt-3 font-heading text-5xl font-bold">{apartment.name}</h1>
            <p className="mt-4 text-lg text-warm-gray">{apartment.summary}</p>
          </div>
        </Card>
        <Card>
          <p className="font-heading text-5xl font-bold text-emerald">{formatCurrency(apartment.nightlyRate, "NGN")} <span className="text-xl font-normal text-warm-gray">/ night</span></p>
          <p className="mt-3 text-lg text-warm-gray">{apartment.rooms}</p>
          <div className="mt-8 space-y-4 text-warm-gray">
            <p>Check-in: Oct 12, 2024</p>
            <p>Check-out: Oct 14, 2024</p>
            <p>Guest support available 24/7</p>
          </div>
          <Button className="mt-8 h-14 w-full">Book Now</Button>
        </Card>
      </div>
    </section>
  );
}
