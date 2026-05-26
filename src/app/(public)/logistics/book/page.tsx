import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LogisticsBookingPage() {
  return (
    <>
      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <header>
              <p className="text-sm font-medium text-emerald">New Shipment Booking</p>
              <h1 className="mt-3 font-heading text-4xl font-semibold text-charcoal">Complete the following details to register your premium logistics request.</h1>
            </header>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-sm">
              {["Sender", "Receiver", "Package", "Priority"].map((step, index) => (
                <div key={step} className="flex items-center gap-2 whitespace-nowrap">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${index === 0 ? "border-emerald bg-emerald text-white" : "border-line text-warm-gray"}`}>
                    {index + 1}
                  </span>
                  <span className={index === 0 ? "font-semibold text-charcoal" : "text-warm-gray"}>{step}</span>
                  {index < 3 ? <span className="mx-2 h-px w-16 bg-line" /> : null}
                </div>
              ))}
            </div>

            <Card className="p-6 md:p-8">
              <form className="space-y-8">
                <section>
                  <div className="mb-6 flex items-center gap-3">
                    <UserRound className="size-5 text-emerald" />
                    <h2 className="font-heading text-3xl font-semibold">Sender Details</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Full Name</label>
                      <input className="h-14 w-full rounded-2xl border border-line px-4" placeholder="e.g. Adeola Balogun" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Phone Number</label>
                      <input className="h-14 w-full rounded-2xl border border-line px-4" placeholder="+234 800 000 0000" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">Pickup Address</label>
                      <input className="h-14 w-full rounded-2xl border border-line px-4" placeholder="Street name, Building number" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">State</label>
                      <select className="h-14 w-full rounded-2xl border border-line px-4">
                        <option>Lagos</option>
                        <option>Abuja (FCT)</option>
                        <option>Rivers</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">LGA / Landmark</label>
                      <input className="h-14 w-full rounded-2xl border border-line px-4" placeholder="e.g. Near Ikeja City Mall" />
                    </div>
                  </div>
                </section>

                <div className="border-t border-line pt-8 text-warm-gray">
                  <p className="text-2xl font-semibold">Receiver Details</p>
                  <p className="mt-3 italic">Complete sender details to unlock receiver information fields.</p>
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <Button variant="secondary" className="sm:min-w-52">Save Draft</Button>
                  <Link href="/auth/login">
                    <Button className="w-full sm:min-w-52">
                      Next Step <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </div>
              </form>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="bg-[#e9e6e2] p-6">
              <h3 className="font-heading text-3xl font-semibold text-charcoal">Price Summary</h3>
              <div className="mt-8 space-y-5 text-lg">
                <div className="flex justify-between"><span>Base Freight</span><span>NGN 4,500.00</span></div>
                <div className="flex justify-between"><span>Insurance (Standard)</span><span>NGN 250.00</span></div>
                <div className="flex justify-between"><span>Handling Fee</span><span>NGN 1,000.00</span></div>
                <div className="flex justify-between border-t border-line pt-4 font-heading text-3xl font-semibold text-emerald"><span>Total Est.</span><span>NGN 5,750.00</span></div>
              </div>

              <div className="mt-6 rounded-[1.25rem] bg-white p-4 text-charcoal">
                <p>Inclusive of all local taxes</p>
                <p className="mt-3">Estimated Delivery: 2-3 Days</p>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.25rem]">
                <img
                  src="/images/logistics-map.svg"
                  alt="Live route tracking"
                  className="h-40 w-full object-cover"
                />
              </div>

              <Button className="mt-6 w-full">Proceed to Checkout</Button>
              <p className="mt-6 text-center text-sm text-warm-gray">
                By proceeding, you agree to our{" "}
                <Link href="/contact" className="font-medium text-emerald underline">
                  Shipping Policy
                </Link>
              </p>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}
