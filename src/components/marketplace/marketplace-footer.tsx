import Link from "next/link";
import { Globe, MessageCircle, Phone } from "lucide-react";

export function MarketplaceFooter() {
  return (
    <footer className="bg-[#cfe0fb]">
      <div className="mx-auto max-w-[1420px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#003b1b]">NexaGrid</p>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#415063]">
              The digital gateway to Nigeria&apos;s finest products. Secure, verified, and delivered to your doorstep.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, MessageCircle, Phone].map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003b1b] text-white"
                >
                  <Icon className="size-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#263445]">Shop</p>
            <div className="grid gap-3 text-sm text-[#314154]">
              <Link href="/marketplace">All Collections</Link>
              <Link href="/marketplace#flash-sales">Flash Sales</Link>
              <Link href="#trusted-merchants">Brands</Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#263445]">Business</p>
            <div className="grid gap-3 text-sm text-[#314154]">
              <Link href="/auth/register">Become a Seller</Link>
              <Link href="/contact">Merchant Policy</Link>
              <Link href="/logistics">Logistics Partners</Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#263445]">Help</p>
            <div className="grid gap-3 text-sm text-[#314154]">
              <Link href="/contact">Customer Service</Link>
              <Link href="/marketplace/orders/1/tracking">Track My Order</Link>
              <Link href="/contact">Refunds &amp; Returns</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#b8cbe7] pt-6 text-xs text-[#607087]">
          © 2024 NexaGrid Smart-Commerce. Premium Marketplace.
        </div>
      </div>
    </footer>
  );
}
