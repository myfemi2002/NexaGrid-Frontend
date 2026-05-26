import { CalendarDays, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apartmentListings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ApartmentsPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-5xl text-emerald md:text-6xl">Find your comfort in Nigeria.</h1>
          <p className="mt-3 text-xl text-warm-gray">Handpicked apartments for premium local stays.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-full px-5">All Stays</Button>
          <Button variant="secondary" className="rounded-full px-5">City Centers</Button>
          <Button variant="secondary" className="rounded-full px-5">Nature Retreats</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-line">
          <img src={apartmentListings[0].image} alt={apartmentListings[0].name} className="h-full min-h-[340px] w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.58))]" />
          <div className="absolute inset-x-5 bottom-5 text-white">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">Featured Stay</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Verified Host</span>
            </div>
            <h2 className="font-heading text-4xl">{apartmentListings[0].name}</h2>
            <p className="mt-2 text-xl">{formatCurrency(apartmentListings[0].nightlyRate, "NGN")} / night</p>
          </div>
        </div>
        <Card className="bg-emerald text-white">
          <CalendarDays className="size-7" />
          <h3 className="mt-24 font-heading text-4xl">Check Availability</h3>
          <p className="mt-4 text-lg text-white/75">Find the perfect dates for your next getaway in just a few clicks.</p>
          <Button variant="secondary" className="mt-10 h-14 bg-white text-charcoal hover:text-charcoal">Open Calendar</Button>
        </Card>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {apartmentListings.map((apartment, index) => (
          <div key={apartment.id} className="group">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-line">
              <img src={apartment.image} alt={apartment.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
              <Heart className="absolute right-4 top-4 size-5 text-white" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl">{apartment.zone}</h3>
                <p className="mt-1 text-warm-gray">Hosted by {apartment.host}</p>
                <p className="mt-1 text-sm text-warm-gray">{index === 0 ? "Verified Merchant" : index === 1 ? "Top Tier Host" : "Ultra-Luxury"}</p>
                <p className="mt-4 font-heading text-3xl text-emerald">{formatCurrency(apartment.nightlyRate, "NGN")} <span className="text-base font-normal text-warm-gray">/ night</span></p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="size-4 fill-gold text-gold" />
                <span>{4.7 + index * 0.1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
