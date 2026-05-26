"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function MarketplaceWishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const cart = useAppStore((state) => state.cart);
  const addCartItem = useAppStore((state) => state.addCartItem);
  const removeWishlistItem = useAppStore((state) => state.removeWishlistItem);

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
              Saved Items
            </h1>
            <p className="mt-3 text-sm text-[#607087] sm:text-base">
              Keep your favorite marketplace finds close and move them into checkout when you are ready.
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white px-6 py-16 text-center shadow-[0_18px_32px_-26px_rgba(0,59,27,0.22)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4ff] text-[#214972]">
              <Heart className="size-7" />
            </div>
            <h2 className="mt-5 font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">No saved items yet</h2>
            <p className="mt-3 text-sm text-[#607087]">
              Tap the heart icon on products you like and they will show up here.
            </p>
            <Link href="/marketplace" className="mt-6 inline-flex">
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {wishlist.map((item) => {
              const inCart = cart.some((cartItem) => cartItem.productId === item.productId);

              return (
                <div
                  key={item.productId}
                  className="rounded-2xl bg-white p-2 shadow-[0_18px_36px_-24px_rgba(0,59,27,0.26)]"
                >
                  <Link href={`/marketplace/products/${item.slug ?? item.productId}`} className="block">
                    <img src={item.image} alt={item.name} className="aspect-[0.95/1] w-full rounded-[1rem] object-cover" />
                  </Link>
                  <div className="px-1 pb-1 pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7885]">{item.category}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[#15202b]">{item.name}</h3>
                    <p className="mt-1 text-xs text-[#607087]">{item.vendor}</p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <p className="font-['Space_Grotesk',sans-serif] text-[1.15rem] font-bold text-[#111827]">
                        {formatCurrency(item.price)}
                      </p>
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
                            rating: 4.8,
                            eta: item.eta,
                            location: item.location,
                            image: item.image,
                            inStock: true,
                            verified: true,
                            fastDelivery: item.fastDelivery,
                            description: item.name,
                          })
                        }
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          inCart
                            ? "bg-[#003b1b] text-white"
                            : "bg-[#edf4ff] text-[#203447] hover:bg-[#003b1b] hover:text-white"
                        }`}
                      >
                        {inCart ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWishlistItem(item.productId)}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#a03f31]"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
