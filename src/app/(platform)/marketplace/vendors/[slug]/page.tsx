"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Star, Truck } from "lucide-react";
import { fetchPublicMarketplaceVendor } from "@/services/marketplace";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

const sortOptions = [
  { value: "latest", label: "Newest arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Alphabetical" },
] as const;

type VendorProfile = {
  name: string;
  slug: string;
  category?: string | null;
  verified: boolean;
  location?: string | null;
  about?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  status?: string | null;
};

export default function VendorStorefrontPage({ params }: { params: { slug: string } }) {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("latest");
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  const mergeProducts = useCallback((current: Product[], incoming: Product[]) => {
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
  }, []);

  const loadPage = useCallback(
    async (pageToLoad: number, replace = false) => {
      if (!replace) {
        setIsLoadingMore(true);
      }

      try {
        const data = await fetchPublicMarketplaceVendor(params.slug, { page: pageToLoad, sort });
        setVendor(data.vendor);
        setProducts((current) => (replace ? data.products : mergeProducts(current, data.products)));
        setCurrentPage(data.pagination.current_page);
        setHasMore(data.pagination.has_more);
        setFailed(false);
      } catch {
        if (replace) {
          setFailed(true);
          setProducts([]);
          setHasMore(false);
          setCurrentPage(1);
        }
      } finally {
        if (replace) {
          setLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [mergeProducts, params.slug, sort]
  );

  useEffect(() => {
    setLoading(true);
    setIsLoadingMore(false);
    setProducts([]);
    setHasMore(false);
    void loadPage(1, true);
  }, [loadPage]);

  const sentinelRef = useInfiniteScroll({
    enabled: !loading && !failed,
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: () => {
      void loadPage(currentPage + 1);
    },
  });

  if (!loading && (failed || !vendor)) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Link
        href="/marketplace"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#003b1b] hover:text-[#14532d]"
      >
        <ArrowLeft className="size-4" />
        Back to Marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fdfbf7_0%,#f3ede4_100%)] px-6 py-8 shadow-[0_24px_38px_-28px_rgba(0,59,27,0.2)] sm:px-8 sm:py-10">
          {vendor?.banner_url ? (
            <img
              alt={`${vendor.name} banner`}
              className="absolute inset-0 h-full w-full object-cover opacity-20"
              src={vendor.banner_url}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(253,251,247,0.94)_0%,rgba(243,237,228,0.9)_100%)]" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7d827c]">Vendor storefront</p>
            <h1 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[2rem] font-extrabold tracking-[-0.04em] text-[#1b1c1c] sm:text-[3.25rem]">
              {loading ? "Loading vendor..." : vendor?.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f645f] sm:text-base">
              {vendor?.about?.trim()
                ? vendor.about
                : "Browse verified inventory, compare pricing, and order directly from this vendor’s curated Marketplace selection."}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#dcdfd8] bg-white p-7 shadow-[0_22px_32px_-24px_rgba(0,59,27,0.18)]">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f7f4ef] text-lg font-bold text-[#003b1b]">
              {vendor?.logo_url ? (
                <img alt={`${vendor.name} logo`} className="h-full w-full object-cover" src={vendor.logo_url} />
              ) : (
                vendor?.name?.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d827c]">Public identity</p>
              <p className="mt-1 text-sm text-[#5f645f]">{vendor?.slug}</p>
            </div>
          </div>

          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.4rem] font-bold text-[#1b1c1c]">
            Shop details
          </h2>
          <div className="mt-5 space-y-3 text-sm text-[#4d524d]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#003b1b]" />
              <span>{vendor?.verified ? "Verified vendor" : "Vendor profile"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#003b1b]" />
              <span>{vendor?.location ?? "Redemption City"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-[#003b1b]" />
              <span>{vendor?.category ?? "Marketplace"} operations</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="size-4 fill-[#003b1b] text-[#003b1b]" />
              <span>Trusted storefront with live inventory</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#666b66]">
          {loading ? "Loading storefront..." : `${products.length} products currently listed`}
        </p>
        <label className="flex items-center gap-3 text-sm font-medium text-[#5f645f]">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number]["value"])}
            className="rounded-full border border-[#d8dbd3] bg-white px-4 py-2 text-sm text-[#1b1c1c] outline-none ring-4 ring-transparent transition focus:ring-[#003b1b]/10"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[1.6rem] border border-[#dcdfd8] bg-white">
              <div className="aspect-[1/0.88] animate-pulse bg-[#ece7de]" />
              <div className="space-y-4 p-5">
                <div className="h-6 w-3/4 animate-pulse rounded bg-[#ece7de]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#ece7de]" />
                <div className="h-7 w-1/3 animate-pulse rounded bg-[#dce7d8]" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-[1.6rem] border border-[#dcdfd8] bg-white px-6 py-12 text-center shadow-[0_18px_28px_-22px_rgba(0,59,27,0.12)]">
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#1b1c1c]">
            No live products from this vendor yet.
          </h3>
          <p className="mt-2 text-sm text-[#666b66]">This storefront will populate as soon as products are published.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug ?? product.id}
              href={`/marketplace/products/${product.slug ?? product.id}`}
              className="group overflow-hidden rounded-[1.6rem] border border-[#dcdfd8] bg-white shadow-[0_18px_28px_-22px_rgba(0,59,27,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_38px_-22px_rgba(0,59,27,0.28)]"
            >
              <img src={product.image} alt={product.name} className="aspect-[1/0.88] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.15rem] font-bold text-[#1b1c1c]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#666b66]">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#f7f4ef] px-2.5 py-1 text-[11px] font-bold text-[#1b1c1c]">
                    <Star className="size-3.5 fill-[#003b1b] text-[#003b1b]" />
                    {product.rating}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#666b66]">
                  <MapPin className="size-4 text-[#003b1b]" />
                  <span>{product.location}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#666b66]">
                  <Truck className="size-4 text-[#003b1b]" />
                  <span>{product.eta}</span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-[#003b1b]">
                      {formatCurrency(product.price, "NGN")}
                    </p>
                    {product.originalPrice ? (
                      <p className="text-xs text-[#b4b8b1] line-through">
                        {formatCurrency(product.originalPrice, "NGN")}
                      </p>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#003b1b]">
                    View Product
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length > 0 ? (
        <div className="mt-10 rounded-[1.6rem] border border-[#dcdfd8] bg-white px-6 py-5 text-center shadow-[0_18px_28px_-22px_rgba(0,59,27,0.12)]">
          <div ref={sentinelRef} className="h-1 w-full" />
          {isLoadingMore ? (
            <p className="text-sm font-medium text-[#666b66]">Loading more records...</p>
          ) : hasMore ? (
            <p className="text-sm text-[#666b66]">Scroll down to load more records automatically.</p>
          ) : (
            <p className="text-sm text-[#666b66]">No more records to load.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
