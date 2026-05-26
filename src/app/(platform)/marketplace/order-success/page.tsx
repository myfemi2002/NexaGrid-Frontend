"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchMarketplaceOrder, type MarketplaceOrder } from "@/services/orders";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const wishlist = useAppStore((state) => state.wishlist);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    void fetchMarketplaceOrder(orderId).then(setOrder).catch(() => undefined);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#f6f8fd]">
      <MarketplaceNavbar
        search=""
        onSearchChange={() => undefined}
        onSearchSubmit={() => undefined}
        cartCount={0}
        wishlistCount={wishlist.length}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Card className="border-[#dbe4ef] p-8 text-center shadow-[0_18px_32px_-24px_rgba(0,59,27,0.18)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e5f5e7] text-[#0e6134]">
            <CheckCircle2 className="size-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#0e6134]">Order confirmed</p>
          <h1 className="mt-4 font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#003b1b] sm:text-5xl">
            Your order is now being prepared.
          </h1>
          <p className="mt-4 text-lg text-[#607087]">
            Payment is secure, escrow is active, and delivery tracking is ready.
          </p>
          {order ? (
            <div className="mt-8 rounded-2xl bg-[#f4f7fd] p-5 text-left">
              <p className="text-sm text-[#607087]">Order Number</p>
              <p className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">{order.order_number}</p>
              <p className="mt-3 text-sm text-[#607087]">Grand Total</p>
              <p className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#101827]">
                {formatCurrency(Number(order.totals.grand_total))}
              </p>
            </div>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {orderId ? (
              <Link href={`/marketplace/orders/${orderId}/tracking`}>
                <Button>Track Order</Button>
              </Link>
            ) : null}
            <Link href="/marketplace/orders">
              <Button variant="secondary">View Orders</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="secondary">Continue Shopping</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f8fd]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
