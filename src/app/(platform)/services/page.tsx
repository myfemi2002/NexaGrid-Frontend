import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, MapPin, ShieldCheck, Star, Wrench } from "lucide-react";
import { serviceListings } from "@/lib/mock-data";

const categoryChips = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "AC Repair",
  "Tutoring",
  "Dispatch",
];

const trustFeatures = [
  "Identity-verified professionals",
  "Clear local pricing before checkout",
  "Escrow-backed service completion",
];

export default function ServicesPage() {
  return (
    <div className="bg-[#fcf9f8]">
      <section className="border-b border-[#dedfd8] bg-[linear-gradient(180deg,#fdfbf7_0%,#f4f7f3_100%)]">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="max-w-[620px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7b817a]">
                Verified Professionals
              </p>
              <h1 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-[2.45rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#1b1c1c] sm:text-[4rem]">
                Book trusted artisans and service experts near you.
              </h1>
              <p className="mt-5 max-w-[520px] text-sm leading-7 text-[#5d625d] sm:text-lg sm:leading-8">
                Find electricians, tutors, plumbers, cleaners, and other verified professionals with transparent rates, fast response, and safer payments.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {categoryChips.map((chip, index) => (
                  <span
                    key={chip}
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      index === 0
                        ? "bg-[#003b1b] text-white"
                        : "border border-[#d9dcd5] bg-white text-[#5f645f]"
                    }`}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services/booking"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#003b1b] px-7 text-sm font-bold text-white transition hover:bg-[#14532d]"
                >
                  Book a Professional
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/dashboard/service-provider/onboarding"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#d8dbd4] bg-white px-7 text-sm font-bold text-[#1b1c1c] transition hover:bg-[#f7f4ef]"
                >
                  Become a Provider
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {serviceListings.slice(0, 2).map((service, index) => (
                <div
                  key={service.id}
                  className={`overflow-hidden rounded-[1.7rem] border border-[#dcdfd8] bg-white shadow-[0_18px_28px_-18px_rgba(0,59,27,0.16)] ${
                    index === 1 ? "sm:translate-y-8" : ""
                  }`}
                >
                  <img src={service.image} alt={service.name} className="aspect-[1/1.02] w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#ecf8ef] px-3 py-1 text-[10px] font-bold text-[#003b1b]">
                        {service.category}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-[#f8f5ef] px-2.5 py-1 text-[11px] font-bold text-[#1b1c1c]">
                        <Star className="size-3.5 fill-[#003b1b] text-[#003b1b]" />
                        {service.rating}
                      </span>
                    </div>
                    <h2 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1b1c1c]">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-xs text-[#6c716d]">{service.provider}</p>
                    <p className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-[#003b1b]">
                      {service.rate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid gap-4 rounded-[1.8rem] border border-[#d9ddd6] bg-white p-5 shadow-[0_18px_28px_-22px_rgba(0,59,27,0.2)] md:grid-cols-3">
          {trustFeatures.map((feature, index) => (
            <div key={feature} className="flex items-center gap-3 rounded-[1.2rem] bg-[#faf8f3] px-4 py-4">
              {index === 0 ? (
                <ShieldCheck className="size-5 text-[#003b1b]" />
              ) : index === 1 ? (
                <BriefcaseBusiness className="size-5 text-[#003b1b]" />
              ) : (
                <CalendarDays className="size-5 text-[#003b1b]" />
              )}
              <span className="text-sm font-medium text-[#1b1c1c]">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.95rem] font-bold tracking-[-0.03em] text-[#1b1c1c]">
              Featured Professionals
            </h2>
            <p className="mt-2 text-sm text-[#666b66]">
              Clear listings, local coverage, and readable rates from vetted service providers.
            </p>
          </div>
          <Link href="/services/booking" className="inline-flex items-center gap-1 text-sm font-bold text-[#003b1b]">
            Start a Booking
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceListings.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group overflow-hidden rounded-[1.6rem] border border-[#dcdfd8] bg-white shadow-[0_18px_28px_-22px_rgba(0,59,27,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_38px_-22px_rgba(0,59,27,0.28)]"
            >
              <img src={service.image} alt={service.name} className="aspect-[1/0.82] w-full object-cover" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#003b1b]">
                      {service.category}
                    </p>
                    <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-[1.18rem] font-bold text-[#1b1c1c]">
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#f7f4ef] px-2.5 py-1 text-[11px] font-bold text-[#1b1c1c]">
                    <Star className="size-3.5 fill-[#003b1b] text-[#003b1b]" />
                    {service.rating}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#5f645f]">{service.summary}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#666b66]">
                  <MapPin className="size-4 text-[#003b1b]" />
                  <span>{service.location}</span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-[#003b1b]">
                    {service.rate}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#003b1b]">
                    View Profile
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-[1.9rem] bg-[#003b1b] px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[620px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                Provider Network
              </p>
              <h3 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[1.9rem] font-bold tracking-[-0.03em] sm:text-[2.3rem]">
                Join NexaGrid as a verified service provider.
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Complete onboarding, verify your identity, list your services, and start receiving trusted bookings across the city grid.
              </p>
            </div>
            <Link
              href="/dashboard/service-provider/onboarding"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-7 text-sm font-bold text-[#003b1b] transition hover:bg-[#f2f4f1]"
            >
              <Wrench className="size-4" />
              Start Onboarding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
