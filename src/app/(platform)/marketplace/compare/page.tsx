"use client";

import Link from "next/link";
import { ArrowLeft, GitCompareArrows, ShoppingCart, Star, Trash2, Truck } from "lucide-react";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function PriceComparisonPage() {
  const compare = useAppStore((state) => state.compare);
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);
  const addCartItem = useAppStore((state) => state.addCartItem);
  const removeCompareItem = useAppStore((state) => state.removeCompareItem);
  const clearCompare = useAppStore((state) => state.clearCompare);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f6f8fd]">
      <MarketplaceNavbar
        search=""
        onSearchChange={() => undefined}
        onSearchSubmit={() => undefined}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
      />

      <section className="mx-auto max-w-[1420px] px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/marketplace"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#003b1b]"
            >
              <ArrowLeft className="size-4" />
              Back to Marketplace
            </Link>
            <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827] sm:text-5xl">
              Compare Products
            </h1>
            <p className="mt-3 text-sm text-[#607087] sm:text-base">
              Review pricing, delivery speed, merchant trust, and product notes side by side before you buy.
            </p>
          </div>
          {compare.length > 0 ? (
            <button className="text-sm font-semibold text-[#003b1b]" onClick={() => clearCompare()}>
              Clear Compare
            </button>
          ) : null}
        </div>

        {compare.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white px-6 py-16 text-center shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4ff] text-[#214972]">
              <GitCompareArrows className="size-7" />
            </div>
            <h2 className="mt-5 font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">No products in compare yet</h2>
            <p className="mt-3 text-sm text-[#607087]">
              Use the compare action on marketplace cards or the product page to build a smart shortlist.
            </p>
            <Link href="/marketplace" className="mt-6 inline-flex">
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-[2rem] bg-white p-4 shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <div
              className="grid min-w-[980px] gap-4"
              style={{ gridTemplateColumns: `240px repeat(${compare.length}, minmax(220px, 1fr))` }}
            >
              <div className="space-y-3 rounded-[1.5rem] bg-[#f4f7fd] p-5 text-sm font-semibold text-[#203447]">
                <div className="h-[220px] rounded-[1rem] bg-transparent" />
                <div>Name</div>
                <div>Price</div>
                <div>Vendor</div>
                <div>Location</div>
                <div>Delivery</div>
                <div>Rating</div>
                <div>Trust</div>
                <div>Description</div>
                <div>Actions</div>
              </div>

              {compare.map((item) => {
                const inCart = cart.some((cartItem) => cartItem.productId === item.productId);

                return (
                  <div key={item.productId} className="space-y-3 rounded-[1.5rem] border border-[#dbe4ef] p-5">
                    <div className="relative">
                      <Link href={`/marketplace/products/${item.slug ?? item.productId}`}>
                        <img src={item.image} alt={item.name} className="h-[220px] w-full rounded-[1rem] object-cover" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeCompareItem(item.productId)}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#a03f31]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="min-h-[52px] text-base font-semibold text-[#101827]">{item.name}</div>
                    <div className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#003b1b]">
                      {formatCurrency(item.price)}
                    </div>
                    <div className="text-sm text-[#607087]">{item.vendor}</div>
                    <div className="text-sm text-[#607087]">{item.location}</div>
                    <div className="flex items-center gap-2 text-sm text-[#607087]">
                      <Truck className="size-4 text-[#003b1b]" />
                      {item.eta}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#607087]">
                      <Star className="size-4 fill-[#003b1b] text-[#003b1b]" />
                      {item.rating.toFixed(1)}
                    </div>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.verified ? "bg-[#e4f7e8] text-[#0d6732]" : "bg-[#fff3df] text-[#8a5a00]"
                        }`}
                      >
                        {item.verified ? "Verified Merchant" : "Marketplace Seller"}
                      </span>
                    </div>
                    <div className="line-clamp-4 text-sm leading-6 text-[#607087]">{item.description}</div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          addCartItem({
                            id: item.productId,
                            slug: item.slug,
                            name: item.name,
                            vendor: item.vendor,
                            vendorSlug: item.vendorSlug,
                            category: item.category,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            rating: item.rating,
                            eta: item.eta,
                            location: item.location,
                            image: item.image,
                            inStock: true,
                            verified: item.verified,
                            fastDelivery: item.fastDelivery,
                            description: item.description,
                          })
                        }
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          inCart
                            ? "bg-[#003b1b] text-white"
                            : "bg-[#edf4ff] text-[#203447] hover:bg-[#003b1b] hover:text-white"
                        }`}
                      >
                        <ShoppingCart className="size-4" />
                        {inCart ? "Added to Cart" : "Add to Cart"}
                      </button>
                      <Link
                        href={`/marketplace/products/${item.slug ?? item.productId}`}
                        className="block rounded-xl border border-[#dbe4ef] px-4 py-3 text-center text-sm font-semibold text-[#203447]"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
