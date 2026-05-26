"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleHelp,
  Home,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wrench,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { marketplaceProducts, serviceListings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const ecosystemCards = [
  {
    title: "Marketplace",
    copy: "Shop verified local products and international essentials with escrow security.",
    href: "/marketplace",
    cta: "Enter Marketplace",
    icon: ShoppingBag,
  },
  {
    title: "Artisans & Pros",
    copy: "Book vetted professionals from electricians to tutors with guaranteed quality.",
    href: "/services",
    cta: "Find a Service",
    icon: Wrench,
  },
  {
    title: "Logistics",
    copy: "Hyper-local delivery and intra-city logistics hub for rapid fulfillment.",
    href: "/logistics",
    cta: "Book Delivery",
    icon: Truck,
  },
  {
    title: "Short-lets",
    copy: "Premium serviced apartments in Redemption City for business or leisure.",
    href: "/apartments",
    cta: "Book a Stay",
    icon: Home,
  },
];

const trustCards = [
  {
    title: "Escrow Protected",
    copy: "Your payment is held securely and only released after you confirm delivery and satisfaction.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Merchants",
    copy: "Every vendor and service professional undergoes a rigorous identity and quality check.",
    icon: ShoppingBag,
  },
  {
    title: "24/7 City Support",
    copy: "Our local dedicated support team is always available to resolve disputes or offer guidance.",
    icon: CircleHelp,
  },
];

const artisanSteps = [
  {
    title: "Post or Browse",
    copy: "Describe your project or select from a directory of top-rated electricians, plumbers, and tutors.",
  },
  {
    title: "Compare & Hire",
    copy: "View profiles, read verified reviews, and get instant quotes from 3+ nearby professionals.",
  },
  {
    title: "Secure Completion",
    copy: "Milestone payments ensure you only pay when the job is done to your satisfaction.",
  },
];

export default function HomePage() {
  const featuredProducts = marketplaceProducts.slice(0, 3);

  return (
    <SiteShell>
      <div className="overflow-x-hidden font-['Inter',sans-serif] text-[#1b1c1c]">
        <section className="relative min-h-[760px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/hero-smart-city.svg"
              alt="Premium NexaGrid smart city background"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,59,27,0.92)_0%,rgba(0,59,27,0.88)_36%,rgba(0,59,27,0.76)_58%,rgba(0,59,27,0.68)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,59,27,0.12)_0%,rgba(0,59,27,0.36)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[760px] max-w-[1400px] items-center px-4 py-16 sm:px-6 md:py-20">
            <div className="max-w-[620px] pt-2">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#7ddc87]" />
                Nigeria&apos;s Premium Smart-City OS
              </div>

              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[2.65rem] font-extrabold leading-[0.96] tracking-[-0.05em] text-white sm:text-[4.6rem]">
                Nigeria&apos;s Smarter
                <br />
                Way to Trade.
              </h1>

              <p className="mt-6 max-w-[520px] text-sm leading-7 text-white/82 sm:text-lg sm:leading-8">
                The all-in-one &apos;Smart-Commerce&apos; ecosystem. Connect with verified vendors, book expert artisans, and manage city logistics seamlessly.
              </p>

              <div className="mt-10 flex max-w-[530px] flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#717970]" />
                  <input
                    type="text"
                    placeholder="Search for products, services, apartments..."
                    className="h-14 w-full rounded-2xl border-none bg-white px-12 text-sm text-[#1b1c1c] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.35)] outline-none ring-4 ring-transparent transition focus:ring-white/20"
                  />
                </div>
                <Link
                  href="/marketplace"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#003b1b] px-7 text-sm font-bold text-white shadow-[0_18px_36px_-18px_rgba(0,59,27,0.9)] transition hover:bg-[#14532d]"
                >
                  Explore the Grid
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-14 max-w-[1400px] px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ecosystemCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-[1.45rem] border border-[#d8ddd7] bg-white px-5 py-5 shadow-[0_18px_28px_-18px_rgba(0,59,27,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_36px_-18px_rgba(0,59,27,0.25)]"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6f3f2] text-[#003b1b] transition group-hover:bg-[#ecf5ef]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.05rem] font-bold text-[#1b1c1c]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#5b615a]">{card.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#003b1b]">
                    {card.cta}
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-24 pt-24 sm:px-6">
          <div className="mx-auto max-w-[1400px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7b847d]">
              Engineered for Trust
            </p>
            <h2 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-[2rem] font-bold tracking-[-0.03em] text-[#1b1c1c] sm:text-[2.35rem]">
              Trade with Unmatched Confidence
            </h2>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {trustCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div key={card.title} className="flex flex-col items-center">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#d8ddd7] bg-white text-[#003b1b] shadow-[0_10px_24px_-18px_rgba(0,59,27,0.35)]">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-[#1b1c1c]">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-[260px] text-[11px] leading-5 text-[#727870]">
                      {card.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.9rem] font-bold tracking-[-0.03em] text-[#1b1c1c] sm:text-[2.2rem]">
                  Marketplace Editor&apos;s Picks
                </h2>
                <p className="mt-1 text-xs text-[#727870] sm:text-sm">
                  The highest quality local goods curated for Redemption City.
                </p>
              </div>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003b1b] sm:text-sm"
              >
                View Catalog
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {featuredProducts.map((product, index) => (
                <Link key={product.id} href={`/marketplace/products/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-[1.35rem]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="aspect-[0.82] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold ${
                        index === 2 ? "bg-[#003b1b] text-white" : "bg-white/90 text-[#003b1b]"
                      }`}
                    >
                      {index === 0 ? "Best Seller" : index === 1 ? "Limited Edition" : "New Arrival"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1rem] font-bold text-[#1b1c1c] sm:text-[1.05rem]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#727870]">{product.vendor}</p>
                    </div>
                    <div className="whitespace-nowrap text-right font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-[#003b1b] sm:text-base">
                      {formatCurrency(product.price, "NGN")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#003b1b] px-4 py-20 text-white sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <h2 className="max-w-[420px] font-['Plus_Jakarta_Sans',sans-serif] text-[2.15rem] font-bold leading-[1] tracking-[-0.04em] sm:text-[3.1rem]">
                Need a Professional?
                <br />
                Vetted in 3 Simple Steps.
              </h2>

              <div className="mt-10 space-y-7">
                {artisanSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 text-[11px] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold sm:text-base">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-[420px] text-xs leading-6 text-white/72 sm:text-sm">
                        {step.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/services"
                className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#003b1b] transition hover:bg-[#f2f4f1]"
              >
                Book an Artisan
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="flex items-end gap-4 justify-self-center lg:justify-self-end">
              <img
                src={serviceListings[0].image}
                alt={serviceListings[0].name}
                className="h-[210px] w-[150px] rounded-[2rem] object-cover shadow-2xl sm:h-[260px] sm:w-[180px]"
              />
              <img
                src={serviceListings[1].image}
                alt={serviceListings[1].name}
                className="h-[210px] w-[150px] rounded-[2rem] object-cover shadow-2xl sm:h-[260px] sm:w-[180px]"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1400px] rounded-[2.2rem] bg-[#f6f3f2] px-6 py-10 sm:rounded-[2.75rem] sm:px-10 sm:py-14">
            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="max-w-[470px]">
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[2rem] font-bold tracking-[-0.03em] text-[#1b1c1c] sm:text-[2.3rem]">
                  The Grid in Your Pocket.
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#5f635e] sm:text-base">
                  Track deliveries, book apartments, and pay for services with the NexaGrid App. Experience seamless commerce anywhere.
                </p>

                <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-end">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-[1.2rem] bg-white p-3 shadow-[0_16px_28px_-20px_rgba(0,59,27,0.4)]">
                      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[#f0eded]">
                        <div className="grid grid-cols-4 gap-1">
                          {Array.from({ length: 16 }).map((_, index) => (
                            <span key={index} className="h-2.5 w-2.5 rounded-[2px] bg-[#cfd4cd]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7b7f7b]">
                      Scan to Download
                    </span>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white transition hover:scale-[1.02]"
                    >
                      <div className="text-[18px] font-black leading-none">Play</div>
                      <div>
                        <p className="text-[9px] uppercase opacity-70">Get it on</p>
                        <p className="text-base font-bold leading-tight">Google Play</p>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white transition hover:scale-[1.02]"
                    >
                      <div className="text-[18px] font-black leading-none">App</div>
                      <div>
                        <p className="text-[9px] uppercase opacity-70">Download on the</p>
                        <p className="text-base font-bold leading-tight">App Store</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative h-[430px] w-[220px] rounded-[2.1rem] border-[6px] border-[#0a3620] bg-[#003b1b] p-2 shadow-[0_30px_40px_-18px_rgba(0,59,27,0.35)] sm:h-[510px] sm:w-[255px] sm:rounded-[2.6rem]">
                  <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#0a3620]" />
                  <div className="h-full rounded-[1.7rem] bg-white px-3 py-4 sm:rounded-[2.15rem] sm:px-4">
                    <div className="mb-4 flex items-center justify-between text-[9px] font-semibold text-[#1b1c1c]">
                      <span>NexaGrid</span>
                      <span>9:41</span>
                    </div>
                    <div className="rounded-2xl bg-[#0d5b32] p-3 text-white">
                      <p className="text-[10px] opacity-80">Smart City</p>
                      <p className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold leading-tight">
                        Logistics Hub
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#f6f3f2] p-3">
                        <p className="text-[10px] text-[#727870]">Marketplace</p>
                        <div className="mt-3 h-10 rounded-xl bg-white" />
                      </div>
                      <div className="rounded-2xl bg-[#f6f3f2] p-3">
                        <p className="text-[10px] text-[#727870]">Services</p>
                        <div className="mt-3 h-10 rounded-xl bg-white" />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#f6f3f2] p-3">
                        <p className="text-[10px] text-[#727870]">Logistics</p>
                        <div className="mt-3 h-10 rounded-xl bg-white" />
                      </div>
                      <div className="rounded-2xl bg-[#f6f3f2] p-3">
                        <p className="text-[10px] text-[#727870]">Apartments</p>
                        <div className="mt-3 h-10 rounded-xl bg-white" />
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-[#f6f3f2] p-3">
                      <div className="mb-2 h-2 w-20 rounded-full bg-[#d9ded8]" />
                      <div className="h-2 w-32 rounded-full bg-[#e7ebe6]" />
                    </div>
                    <div className="absolute bottom-5 left-1/2 flex w-[78%] -translate-x-1/2 items-center justify-between rounded-full bg-white px-4 py-2 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#003b1b]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#d9ded8]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#d9ded8]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#d9ded8]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
