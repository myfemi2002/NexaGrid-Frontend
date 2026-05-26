import Link from "next/link";
import { Card } from "@/components/ui/card";

const roles = [
  { title: "Customer", copy: "Shop, book, and track orders.", value: "customer" },
  { title: "Vendor", copy: "Sell products and manage stock.", value: "vendor" },
  { title: "Delivery Rider", copy: "Take assignments and earn daily.", value: "delivery-rider" },
  { title: "Service Provider", copy: "Offer trusted local services.", value: "service-provider" },
  { title: "Apartment Host", copy: "List stays and manage bookings.", value: "apartment-host" },
];

export default function AccountTypePage() {
  return (
    <div className="mx-auto max-w-6xl px-1 py-1">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="font-heading text-2xl font-semibold text-emerald-950">NexaGrid</Link>
        <Link href="/auth/login" className="inline-flex h-10 items-center justify-center rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-charcoal transition duration-200 hover:border-emerald hover:text-emerald">Sign In</Link>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-center">
        {["Role", "Details", "Confirm"].map((step, index) => (
          <div key={step} className="flex items-center gap-4">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${index === 0 ? "bg-emerald-950 text-white" : "bg-muted text-muted-foreground"}`}>{index + 1}</div>
            <div className="hidden h-px w-20 bg-border sm:block" />
            <p className="text-xs font-medium text-muted-foreground sm:hidden">{step}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-3xl text-center">
        <h1 className="font-heading text-3xl font-semibold text-emerald-950 sm:text-4xl">How will you use NexaGrid?</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Choose your primary role. You can always expand your services later.</p>
      </div>

      <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-3">
        {roles.map((role, index) => (
          <Link key={role.title} href={`/auth/register?role=${role.value}`}>
            <Card className={`h-full p-6 transition-colors hover:border-emerald-950 ${index === 0 ? "md:col-span-2 border-emerald-950" : ""}`}>
              <div className="mb-5 h-12 w-12 rounded-full bg-muted" />
              <h2 className="font-heading text-2xl font-semibold">{role.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{role.copy}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mx-auto mt-6 max-w-5xl p-6">
        <h3 className="font-heading text-3xl font-semibold">Your Personal Details</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="h-12 rounded-xl border border-border px-4" placeholder="Enter your full name" />
          <input className="h-12 rounded-xl border border-border px-4" placeholder="example@provider.com" />
          <div className="flex overflow-hidden rounded-xl border border-border">
            <span className="flex items-center bg-muted px-4 text-sm text-muted-foreground">+234</span>
            <input className="h-12 flex-1 px-4" placeholder="801 234 5678" />
          </div>
          <select className="h-12 rounded-xl border border-border px-4">
            <option>Select your community</option>
            <option>Redemption City</option>
            <option>Lekki Phase 1</option>
          </select>
        </div>
        <input className="mt-4 h-12 w-full rounded-xl border border-border px-4" type="password" placeholder="Minimum 8 characters" />
        <Link href="/auth/register?role=customer" className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-950 text-sm font-semibold text-white">
          Continue Registration
        </Link>
      </Card>
    </div>
  );
}
