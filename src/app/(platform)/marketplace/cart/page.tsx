"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function CartPage() {
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);
  const clearCart = useAppStore((state) => state.clearCart);
  const removeCartItem = useAppStore((state) => state.removeCartItem);
  const updateCartQuantity = useAppStore((state) => state.updateCartQuantity);

  const groupedItems = useMemo(() => {
    const groups = new Map<
      string,
      {
        vendor: string;
        vendorSlug?: string;
        items: typeof cart;
      }
    >();

    cart.forEach((item) => {
      const key = item.vendor;
      const existing = groups.get(key);

      if (existing) {
        existing.items.push(item);
      } else {
        groups.set(key, {
          vendor: item.vendor,
          vendorSlug: item.vendorSlug,
          items: [item],
        });
      }
    });

    return Array.from(groups.values());
  }, [cart]);

  const summary = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = groupedItems.reduce((sum, group) => {
      const fastGroup = group.items.some((item) => item.fastDelivery);
      return sum + (fastGroup ? 1200 : 2500);
    }, 0);
    const vat = subtotal * 0.075;
    const total = subtotal + shipping + vat;

    return {
      itemCount,
      subtotal,
      shipping,
      vat,
      total,
    };
  }, [cart, groupedItems]);

  return (
    <div className="min-h-screen bg-[#f6f8fd]">
      <MarketplaceNavbar
        search=""
        onSearchChange={() => undefined}
        onSearchSubmit={() => undefined}
        cartCount={summary.itemCount}
        wishlistCount={wishlist.length}
      />

      <section className="mx-auto max-w-[1420px] px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/marketplace"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#003b1b] hover:text-[#14532d]"
            >
              <ArrowLeft className="size-4" />
              Continue shopping
            </Link>
            <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827] sm:text-5xl">
              Your Cart ({summary.itemCount} items)
            </h1>
          </div>
          {cart.length > 0 ? (
            <button className="text-sm font-semibold text-[#003b1b]" onClick={() => clearCart()}>
              Clear Cart
            </button>
          ) : null}
        </div>

        {cart.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-[#dbe4ef] bg-white px-6 py-16 text-center shadow-[0_18px_32px_-26px_rgba(0,59,27,0.2)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4ff] text-[#203447]">
              <ShoppingBag className="size-7" />
            </div>
            <h2 className="mt-5 font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">Your cart is empty</h2>
            <p className="mt-3 text-sm text-[#5f6d7d]">
              Add products from flash sales, trending picks, or free delivery items to start checkout.
            </p>
            <Link
              href="/marketplace"
              className="mt-6 inline-flex rounded-full bg-[#003b1b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532d]"
            >
              Return to Marketplace
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              {groupedItems.map((group) => (
                <div
                  key={group.vendor}
                  className="rounded-[1.75rem] border border-[#dbe4ef] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.18)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e8edf5] pb-4">
                    <div>
                      <p className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">{group.vendor}</p>
                      <p className="mt-1 text-sm text-[#69778a]">Grouped for cleaner delivery and merchant checkout.</p>
                    </div>
                    <div className="text-right text-sm text-[#69778a]">
                      <p className="font-semibold text-[#003b1b]">
                        {group.items.some((item) => item.fastDelivery) ? "Express Delivery Available" : "Standard Delivery"}
                      </p>
                      <p>
                        Shipping: {formatCurrency(group.items.some((item) => item.fastDelivery) ? 1200 : 2500)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-5">
                    {group.items.map((item) => (
                      <div key={item.productId} className="flex flex-col gap-4 sm:flex-row">
                        <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-[#101827]">{item.name}</p>
                              <p className="mt-1 text-sm text-[#69778a]">
                                {item.category} • {item.location}
                              </p>
                              <p className="mt-1 text-xs text-[#8090a2]">{item.eta}</p>
                            </div>
                            <p className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center overflow-hidden rounded-full border border-[#d6dfeb]">
                              <button
                                type="button"
                                className="px-3 py-2 text-[#203447]"
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="border-x border-[#d6dfeb] px-4 py-2 font-semibold text-[#101827]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="px-3 py-2 text-[#203447]"
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-[#d6dfeb] px-4 py-2 text-[#203447] hover:border-[#d62f2f] hover:text-[#d62f2f]"
                              onClick={() => removeCartItem(item.productId)}
                            >
                              <Trash2 className="size-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.2)]">
                <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">Order Summary</h2>
                <div className="mt-6 space-y-3 text-sm text-[#69778a]">
                  <div className="flex justify-between">
                    <span>Subtotal ({summary.itemCount} items)</span>
                    <span>{formatCurrency(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span>{formatCurrency(summary.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (VAT 7.5%)</span>
                    <span>{formatCurrency(summary.vat)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#e8edf5] pt-4 text-lg font-semibold text-[#003b1b]">
                    <span>Total</span>
                    <span>{formatCurrency(summary.total)}</span>
                  </div>
                </div>
                <Link href="/marketplace/checkout" className="mt-6 block">
                  <Button className="h-14 w-full">Proceed to Checkout</Button>
                </Link>
                <p className="mt-3 text-center text-xs text-[#8090a2]">Secure payment via NexaGrid checkout.</p>
              </div>

              <div className="rounded-[1.75rem] bg-[#003b1b] p-6 text-white shadow-[0_18px_32px_-24px_rgba(0,59,27,0.32)]">
                <p className="text-sm font-medium text-[#d9efdc]">Delivery Promise</p>
                <p className="mt-4 text-sm leading-7 text-[#d9efdc]">
                  Your items stay protected through merchant verification, route-aware delivery partners, and checkout confirmation before release.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
