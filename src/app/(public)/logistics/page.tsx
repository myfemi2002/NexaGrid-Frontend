import Link from "next/link";
import { ArrowRight, MapPinned, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LogisticsLandingPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-10">
        <div
          className="overflow-hidden rounded-[2rem] border border-line bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg,rgba(252,249,240,0.96),rgba(252,249,240,0.86)),url('/images/logistics-warehouse.svg')",
          }}
        >
          <div className="grid gap-8 px-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-16">
            <div>
              <span className="inline-flex rounded-full bg-emerald px-4 py-1 text-sm font-semibold text-white">
                Premium Logistics Nigeria
              </span>
              <h1 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-tight text-emerald md:text-6xl">
                Ship Anywhere in Nigeria
              </h1>
              <p className="mt-4 max-w-xl text-lg text-warm-gray">
                Reliable, real-time tracked deliveries for businesses and individuals. From Lagos to Kano, we bridge the distance with speed and affluent trust.
              </p>
              <div className="mt-8 flex flex-col gap-3 md:max-w-2xl">
                <div className="flex flex-col gap-3 rounded-[1.5rem] bg-white/90 p-3 shadow-sm md:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-line bg-[#f6f3ee] px-4 py-4 text-warm-gray">
                    <MapPinned className="size-5 text-emerald" />
                    <span>Enter Tracking Number</span>
                  </div>
                  <Link href="/logistics/book">
                    <Button className="w-full md:w-auto md:px-10">Track</Button>
                  </Link>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/logistics/book">
                    <Button className="w-full sm:px-10">Book Now</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="secondary" className="w-full sm:px-10">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <Card className="self-start p-6 md:p-8">
              <h2 className="font-heading text-3xl font-semibold text-charcoal">Cost Calculator</h2>
              <p className="mt-2 text-sm text-warm-gray">Instant estimates for your shipment</p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Origin State</label>
                  <select className="h-12 w-full rounded-2xl border border-line bg-white px-4">
                    <option>Lagos State</option>
                    <option>Abuja (FCT)</option>
                    <option>Rivers State</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Destination State</label>
                  <select className="h-12 w-full rounded-2xl border border-line bg-white px-4">
                    <option>Kano State</option>
                    <option>Enugu State</option>
                    <option>Oyo State</option>
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Weight (kg)</label>
                    <input className="h-12 w-full rounded-2xl border border-line bg-white px-4" defaultValue="1" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Package Type</label>
                    <select className="h-12 w-full rounded-2xl border border-line bg-white px-4">
                      <option>Standard</option>
                      <option>Fragile</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="text-warm-gray">Estimated Total</span>
                  <span className="font-heading text-3xl font-semibold text-emerald">NGN 4,500.00</span>
                </div>
                <Link href="/logistics/book">
                  <Button className="w-full">Calculate &amp; Book</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-4 px-4 py-8 md:grid-cols-3 md:px-6">
        <Card className="bg-emerald-950 text-white md:col-span-2">
          <Truck className="size-10 text-emerald-200" />
          <h2 className="mt-6 font-heading text-4xl font-semibold">Become a NexaGrid Partner</h2>
          <p className="mt-4 max-w-xl text-emerald-100">
            Join our growing network of fleet owners and logistics hubs across Nigeria. Scale your business with our world-class technology.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding/logistics">
              <Button className="bg-white text-emerald hover:bg-white/90">
                Apply Now <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/dashboard/logistics">
              <Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                View Hub Demo
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-[#7a5200] text-white">
          <ShieldCheck className="size-10 text-[#fdba57]" />
          <h3 className="mt-6 font-heading text-3xl font-semibold">Real-time Analytics</h3>
          <p className="mt-4 text-white/80">Partners get access to route planning, package sorting visibility, and live operations metrics.</p>
        </Card>

        <Card>
          <h3 className="font-heading text-3xl font-semibold text-charcoal">Secure Warehousing</h3>
          <p className="mt-4 text-warm-gray">Strategic hubs in Lagos, Abuja, and Port Harcourt for climate-controlled storage.</p>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="font-heading text-3xl font-semibold text-charcoal">Download NexaGrid App</h3>
          <p className="mt-3 text-warm-gray">Manage shipments, track drivers, and pay with ease on the go.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary">App Store</Button>
            <Button variant="secondary">Google Play</Button>
          </div>
        </Card>
      </section>
    </>
  );
}
