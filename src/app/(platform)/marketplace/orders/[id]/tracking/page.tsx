"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { fetchMarketplaceOrder, type MarketplaceOrder } from "@/services/orders";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const cart = useAppStore((state) => state.cart);
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
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
      />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0e6134]">Order ID: {order?.order_number ?? orderId}</p>
            <h1 className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827] sm:text-5xl">
              Tracking your delivery
            </h1>
            <p className="mt-2 text-sm text-[#607087] sm:text-base">
              {order?.meta?.address_line ? `Arriving at ${order.meta.address_line}` : "Preparing your destination details"}
            </p>
          </div>
          <Card className="bg-[#003b1b] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d7eedb]">Estimated Arrival</p>
            <p className="mt-2 font-['Space_Grotesk',sans-serif] text-5xl font-bold">
              {order?.delivery?.eta_minutes ? `${order.delivery.eta_minutes}m` : "--"}
            </p>
            <p className="text-sm text-[#d7eedb]">{order?.delivery?.meta?.hub ?? "Redemption City Hub"}</p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between gap-4 overflow-x-auto pb-4">
                {[
                  ["Order Placed", true],
                  ["Packed", true],
                  ["With Rider", order?.delivery?.status !== "queued"],
                  ["Delivered", order?.status === "delivered"],
                ].map(([label, active], index) => (
                  <div key={label as string} className="min-w-[130px] text-center">
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${active ? "bg-[#003b1b] text-white" : "bg-[#e7edf5] text-[#7a8798]"}`}>{index + 1}</div>
                    <p className={`mt-3 text-sm font-medium ${active ? "text-[#003b1b]" : "text-[#7a8798]"}`}>{label as string}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="relative min-h-[28rem] bg-[#dfe9f8]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,83,45,0.15),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(20,83,45,0.08),transparent_35%)]" />
                <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-4 py-2 text-sm shadow-sm">
                  {order?.delivery?.tracking_code ? `Tracking: ${order.delivery.tracking_code}` : "Tracking is being assigned"}
                </div>
                <div className="absolute bottom-8 right-10 rounded-full border-2 border-[#003b1b] bg-white px-3 py-2 text-xs font-medium">Your Location</div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">Order Summary</h2>
              <div className="mt-6 space-y-3 text-sm text-[#607087]">
                {order?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>{formatCurrency(Number(item.line_total))}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e7edf5] pt-4"><span>Subtotal</span><span>{formatCurrency(Number(order?.totals.subtotal ?? 0))}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>{formatCurrency(Number(order?.totals.delivery_fee ?? 0))}</span></div>
                <div className="flex justify-between border-t border-[#e7edf5] pt-4 text-lg font-semibold text-[#003b1b]"><span>Total</span><span>{formatCurrency(Number(order?.totals.grand_total ?? 0))}</span></div>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#607087]">Payment Method</p>
              <div className="mt-4 rounded-2xl border border-[#dbe4ef] bg-[#f8fbff] p-4">
                <p className="font-medium text-[#101827]">{order?.meta?.payment_method ?? "Nexa Wallet"}</p>
                <p className="text-sm text-[#607087]">Protected checkout payment</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
