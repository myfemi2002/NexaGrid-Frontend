"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock3, Flame, Ticket, Truck } from "lucide-react";
import { CategoryFilter } from "@/components/marketplace/category-filter";
import { FlashSaleCard } from "@/components/marketplace/flash-sale-card";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { MerchantStrip } from "@/components/marketplace/merchant-strip";
import { ProductCard } from "@/components/marketplace/product-card";
import { PromoBanner } from "@/components/marketplace/promo-banner";
import { SellingFastCard } from "@/components/marketplace/selling-fast-card";
import type { MarketplaceSectionProduct } from "@/components/marketplace/types";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { formatCurrency } from "@/lib/utils";
import { fetchPublicMarketplace } from "@/services/marketplace";
import { useAppStore } from "@/store/use-app-store";
import type { Product } from "@/types";

const marketplaceCategories = [
  "All Items",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Groceries",
  "Health & Beauty",
  "Artisanal Goods",
];

function MarketplaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#f6f8fd]">
      <div className="border-b border-[#d8e0ec] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-4">
          <div className="h-8 w-36 animate-pulse rounded bg-[#e8edf7]" />
          <div className="hidden h-11 w-[360px] animate-pulse rounded-xl bg-[#eef3fb] md:block" />
          <div className="h-11 w-44 animate-pulse rounded-full bg-[#eef3fb]" />
        </div>
      </div>
      <div className="mx-auto max-w-[1420px] px-4 py-8 sm:px-6">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-11 w-28 shrink-0 animate-pulse rounded-full bg-[#e8edf7]" />
          ))}
        </div>
        <div className="mt-8 grid gap-8">
          {Array.from({ length: 4 }).map((_, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="mb-4 h-8 w-52 animate-pulse rounded bg-[#e8edf7]" />
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, cardIndex) => (
                  <div key={cardIndex} className="rounded-2xl bg-white p-2 shadow-[0_16px_30px_-24px_rgba(0,59,27,0.25)]">
                    <div className="aspect-square animate-pulse rounded-[1rem] bg-[#e9edf4]" />
                    <div className="space-y-3 p-3">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-[#e9edf4]" />
                      <div className="h-4 w-full animate-pulse rounded bg-[#eef3fb]" />
                      <div className="h-5 w-1/2 animate-pulse rounded bg-[#e9edf4]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function normalizeCategory(category: string) {
  const value = category.toLowerCase();

  if (value.includes("elect")) {
    return "Electronics";
  }

  if (value.includes("fashion") || value.includes("cloth")) {
    return "Fashion";
  }

  if (value.includes("home") || value.includes("decor") || value.includes("furniture")) {
    return "Home & Living";
  }

  if (value.includes("groc") || value.includes("food") || value.includes("yam") || value.includes("spice")) {
    return "Groceries";
  }

  if (value.includes("beauty") || value.includes("health")) {
    return "Health & Beauty";
  }

  if (value.includes("artisan") || value.includes("craft")) {
    return "Artisanal Goods";
  }

  return "All Items";
}

function decorateProduct(product: Product, index: number): MarketplaceSectionProduct {
  const comparePrice = product.originalPrice ?? Math.round(product.price * 1.28);
  const discountPercent = Math.max(10, Math.min(60, Math.round(((comparePrice - product.price) / comparePrice) * 100)));

  return {
    ...product,
    originalPrice: comparePrice,
    discountPercent,
    claimedPercent: 28 + ((index * 17) % 61),
    badge: index % 2 === 0 ? "Flash Deal" : "Limited",
    statusText: index % 2 === 0 ? "Only 3 Left" : "Selling Fast",
  };
}

export default function MarketplacePreviewPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<MarketplaceSectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(2 * 60 * 60 + 45 * 60 + 12);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const cart = useAppStore((state) => state.cart);
  const addCartItem = useAppStore((state) => state.addCartItem);
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlistItem = useAppStore((state) => state.toggleWishlistItem);

  const mergeProducts = useCallback(
    (current: MarketplaceSectionProduct[], incoming: MarketplaceSectionProduct[]) => {
      const seen = new Set(current.map((item) => item.slug ?? item.id));
      const merged = [...current];

      incoming.forEach((item) => {
        const key = item.slug ?? item.id;

        if (!seen.has(key)) {
          seen.add(key);
          merged.push(item);
        }
      });

      return merged;
    },
    []
  );

  const loadPage = useCallback(
    async (pageToLoad: number, replace = false) => {
      if (replace) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const result = await fetchPublicMarketplace({
          q: query || undefined,
          sort: "latest",
          page: pageToLoad,
        });

        const incoming = result.products.map((product, index) =>
          decorateProduct(product, (pageToLoad - 1) * result.pagination.per_page + index)
        );

        setProducts((current) => (replace ? incoming : mergeProducts(current, incoming)));
        setCurrentPage(result.pagination.current_page);
        setHasMore(result.pagination.has_more);
        setError(null);
      } catch {
        setError("We could not load marketplace products right now.");

        if (replace) {
          setProducts([]);
          setCurrentPage(1);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [mergeProducts, query]
  );

  useEffect(() => {
    void loadPage(1, true);
  }, [loadPage]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const sentinelRef = useInfiniteScroll({
    enabled: !loading && !error,
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: () => {
      void loadPage(currentPage + 1);
    },
  });

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All Items") {
      return products;
    }

    return products.filter((product) => normalizeCategory(product.category) === selectedCategory);
  }, [products, selectedCategory]);

  const flashProducts = useMemo(() => filteredProducts.slice(0, 5), [filteredProducts]);
  const promoProducts = useMemo(() => filteredProducts.slice(0, 2), [filteredProducts]);
  const trendingProducts = useMemo(
    () => filteredProducts.slice(trendingIndex, trendingIndex + 6),
    [filteredProducts, trendingIndex]
  );
  const sellingFastProducts = useMemo(
    () => filteredProducts.filter((product) => product.fastDelivery || product.discountPercent! >= 20).slice(0, 3),
    [filteredProducts]
  );
  const freeDeliveryProducts = useMemo(() => {
    const fast = filteredProducts.filter((product) => product.fastDelivery);

    if (fast.length > 0) {
      return fast.slice(0, Math.max(3, Math.min(filteredProducts.length, 6)));
    }

    return filteredProducts.slice(0, Math.max(3, Math.min(filteredProducts.length, 6)));
  }, [filteredProducts]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const countdownText = useMemo(() => {
    const hours = String(Math.floor(countdown / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((countdown % 3600) / 60)).padStart(2, "0");
    const seconds = String(countdown % 60).padStart(2, "0");

    return `${hours} : ${minutes} : ${seconds}`;
  }, [countdown]);

  if (loading) {
    return <MarketplaceSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fd] text-[#15202b]">
      <MarketplaceNavbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => {
          setQuery(search.trim());
          setTrendingIndex(0);
        }}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
      />

      <main className="mx-auto max-w-[1420px] px-4 pb-16 pt-6 sm:px-6">
        <CategoryFilter
          categories={marketplaceCategories}
          activeCategory={selectedCategory}
          onSelect={(category) => {
            setSelectedCategory(category);
            setTrendingIndex(0);
          }}
        />

        <section id="flash-sales" className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#1b1c1c]">Flash Sales</h2>
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#ffe8e4] px-3 py-2 text-xs font-semibold text-[#d94a36]">
                <Clock3 className="size-3.5" />
                {countdownText}
              </div>
            </div>
            <Link href="/marketplace/products" className="text-sm font-semibold text-[#1b1c1c] hover:text-[#003b1b]">
              See More Deals
            </Link>
          </div>

          <div className="no-scrollbar grid auto-cols-[220px] grid-flow-col gap-4 overflow-x-auto pb-2 lg:grid-cols-5 lg:grid-flow-row lg:overflow-visible">
            {flashProducts.map((product) => (
              <FlashSaleCard key={product.slug ?? product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#1b1c1c]">Trending Now</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dfeb] bg-white text-[#526173] transition hover:border-[#003b1b] hover:text-[#003b1b] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={trendingIndex === 0}
                onClick={() => setTrendingIndex((value) => Math.max(0, value - 1))}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dfeb] bg-white text-[#526173] transition hover:border-[#003b1b] hover:text-[#003b1b] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={trendingIndex + 6 >= filteredProducts.length}
                onClick={() =>
                  setTrendingIndex((value) => Math.min(Math.max(filteredProducts.length - 6, 0), value + 1))
                }
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.slug ?? product.id}
                product={product}
                onAddToCart={(item) => addCartItem(item)}
                inCart={cart.some((item) => item.productId === product.id)}
                onToggleWishlist={(item) => toggleWishlistItem(item)}
                inWishlist={wishlist.some((item) => item.productId === product.id)}
              />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-[#eaf1fb] px-5 py-6 sm:px-6">
          <div className="mb-5 flex items-center gap-2 text-[#1b1c1c]">
            <Flame className="size-4 text-[#d94a36]" />
            <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-bold">Selling Fast!</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {sellingFastProducts.map((product) => (
              <SellingFastCard
                key={product.slug ?? product.id}
                product={product}
                onAddToCart={(item) => addCartItem(item)}
                inCart={cart.some((item) => item.productId === product.id)}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#1b1c1c]">Claim Your Offer</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {promoProducts.map((product, index) => (
              <PromoBanner key={product.slug ?? product.id} product={product} tone={index === 0 ? "green" : "gold"} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-[#1b1c1c]" />
              <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#1b1c1c]">Free Delivery Items</h2>
            </div>
            <span className="rounded-full bg-[#d9f0dd] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#256d36]">
              Nationwide
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {freeDeliveryProducts.map((product) => (
              <motion.div
                key={product.slug ?? product.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white p-2 shadow-[0_18px_36px_-24px_rgba(0,59,27,0.26)]"
              >
                <Link href={`/marketplace/products/${product.slug ?? product.id}`} className="block">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="aspect-[0.95/1] w-full rounded-[1rem] object-cover" />
                    <span className="absolute left-2 top-2 rounded-md bg-[#0e6134] px-2 py-1 text-[10px] font-bold uppercase text-white">
                      Free Delivery
                    </span>
                  </div>
                </Link>
                <div className="px-1 pb-1 pt-3">
                  <h3 className="line-clamp-2 text-sm font-medium text-[#15202b]">{product.name}</h3>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="font-['Space_Grotesk',sans-serif] text-[1.2rem] font-bold text-[#111827]">
                      {formatCurrency(product.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => addCartItem(product)}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        cart.some((item) => item.productId === product.id)
                          ? "bg-[#003b1b] text-white"
                          : "bg-[#edf4ff] text-[#203447] hover:bg-[#003b1b] hover:text-white"
                      }`}
                    >
                      {cart.some((item) => item.productId === product.id) ? "Added" : "Add"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {!error && filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#dbe4ef] bg-white px-6 py-12 text-center shadow-[0_16px_32px_-26px_rgba(0,59,27,0.22)]">
            <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#1b1c1c]">
              No products matched this marketplace view.
            </h3>
            <p className="mt-3 text-sm text-[#5b6a7c]">
              Try another category or search keyword and we&apos;ll refresh the premium picks instantly.
            </p>
          </div>
        ) : null}

        <MerchantStrip />

        {error ? (
          <div className="mt-8 rounded-2xl border border-[#f1c8c1] bg-white px-5 py-4 text-sm text-[#a03f31]">
            {error}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#dbe4ef] bg-white px-5 py-4 text-center shadow-[0_16px_32px_-26px_rgba(0,59,27,0.22)]">
            <div ref={sentinelRef} className="h-1 w-full" />
            {isLoadingMore ? (
              <p className="text-sm font-medium text-[#5b6a7c]">Loading more records...</p>
            ) : hasMore ? (
              <p className="text-sm text-[#5b6a7c]">Scroll a little more to discover more marketplace records automatically.</p>
            ) : (
              <p className="text-sm text-[#5b6a7c]">No more records to load.</p>
            )}
          </div>
        )}
      </main>

      <MarketplaceFooter />
    </div>
  );
}
