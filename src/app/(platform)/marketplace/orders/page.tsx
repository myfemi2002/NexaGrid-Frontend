"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardList, PackageCheck, Truck } from "lucide-react";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { Button } from "@/components/ui/button";
import { fetchMarketplaceOrders, type MarketplaceOrder } from "@/services/orders";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

function statusTone(status?: string) {
  switch (status) {
    case "delivered":
      return "bg-[#e4f7e8] text-[#0d6732]";
    case "shipped":
    case "processing":
      return "bg-[#e8f0ff] text-[#214972]";
    case "queued":
    case "pending":
    default:
      return "bg-[#fff3df] text-[#8a5a00]";
  }
}

export default function MarketplaceOrdersPage() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);

  useEffect(() => {
    let active = true;

    fetchMarketplaceOrders()
      .then((result) => {
        if (active) {
          setOrders(result.orders);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError("We could not load your marketplace orders right now.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      active: orders.filter((order) => ["pending", "processing", "shipped"].includes(order.status)).length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#f6f8fd]">
      <MarketplaceNavbar
        search=""
        onSearchChange={() => undefined}
        onSearchSubmit={() => undefined}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
      />

      <section className="mx-auto max-w-[1420px] px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0e6134]">Buyer Order Desk</p>
            <h1 className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827] sm:text-5xl">
              Order History
            </h1>
            <p className="mt-3 text-sm text-[#607087] sm:text-base">
              Review your purchases, track deliveries, and revisit recent merchant checkouts.
            </p>
          </div>
          <Link href="/marketplace">
            <Button variant="secondary">Back to Marketplace</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <ClipboardList className="size-6 text-[#003b1b]" />
            <p className="mt-4 text-sm text-[#607087]">Total Orders</p>
            <p className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827]">{summary.total}</p>
          </div>
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <Truck className="size-6 text-[#214972]" />
            <p className="mt-4 text-sm text-[#607087]">In Progress</p>
            <p className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827]">{summary.active}</p>
          </div>
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <PackageCheck className="size-6 text-[#0d6732]" />
            <p className="mt-4 text-sm text-[#607087]">Delivered</p>
            <p className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827]">{summary.delivered}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[1.75rem] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <p className="text-sm text-[#607087]">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[1.75rem] border border-[#f1c8c1] bg-white p-6 text-sm text-[#a03f31]">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] bg-white p-12 text-center shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">No orders yet</h2>
            <p className="mt-3 text-sm text-[#607087]">Your completed marketplace purchases will appear here once you check out.</p>
            <Link href="/marketplace" className="mt-6 inline-flex">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#607087]">{order.order_number}</p>
                    <h2 className="mt-2 font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">
                      {order.items?.[0]?.product_name ?? "Marketplace order"}
                    </h2>
                    <p className="mt-2 text-sm text-[#607087]">
                      {order.items?.length ?? 0} item(s) • {order.meta?.city ?? "Redemption City"} • {order.meta?.payment_method ?? "wallet"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="mt-3 font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#003b1b]">
                      {formatCurrency(Number(order.totals.grand_total))}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e7edf5] pt-5">
                  <div className="text-sm text-[#607087]">
                    {order.delivery?.tracking_code ? `Tracking: ${order.delivery.tracking_code}` : "Tracking pending assignment"}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/marketplace/orders/${order.id}/tracking`}>
                      <Button>Track Order</Button>
                    </Link>
                    <Link
                      href={`/marketplace/order-success?orderId=${order.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#003b1b]"
                    >
                      View Summary
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
