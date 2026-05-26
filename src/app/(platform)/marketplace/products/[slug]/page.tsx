"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  GitCompareArrows,
  Heart,
  MapPin,
  MessageSquareMore,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { fetchAuthStatus, getApiErrorMessage } from "@/services/auth";
import {
  fetchPublicMarketplaceProduct,
  submitMarketplaceProductReview,
  type MarketplaceProductReview,
  type MarketplaceReviewSummary,
} from "@/services/marketplace";
import { useAppStore } from "@/store/use-app-store";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

function ProductDetailSkeleton() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#dcdfd8] bg-white shadow-[0_22px_32px_-24px_rgba(0,59,27,0.24)]">
          <div className="aspect-[1/0.84] animate-pulse bg-[#ece7de]" />
        </div>
        <div className="rounded-[2rem] border border-[#dcdfd8] bg-white p-7 shadow-[0_22px_32px_-24px_rgba(0,59,27,0.22)]">
          <div className="h-7 w-40 animate-pulse rounded-full bg-[#ece7de]" />
          <div className="mt-6 h-16 w-full animate-pulse rounded-3xl bg-[#ece7de]" />
          <div className="mt-4 h-24 w-full animate-pulse rounded-3xl bg-[#f3efe7]" />
          <div className="mt-6 space-y-3">
            <div className="h-5 w-52 animate-pulse rounded bg-[#ece7de]" />
            <div className="h-5 w-48 animate-pulse rounded bg-[#ece7de]" />
            <div className="h-5 w-56 animate-pulse rounded bg-[#ece7de]" />
          </div>
          <div className="mt-8 h-12 w-40 animate-pulse rounded-2xl bg-[#dce7d8]" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="h-14 animate-pulse rounded-2xl bg-[#dce7d8]" />
            <div className="h-14 animate-pulse rounded-2xl bg-[#ece7de]" />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-5 h-9 w-56 animate-pulse rounded-2xl bg-[#ece7de]" />
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[1.6rem] border border-[#dcdfd8] bg-white shadow-[0_18px_28px_-22px_rgba(0,59,27,0.18)]"
            >
              <div className="aspect-[1/0.88] animate-pulse bg-[#ece7de]" />
              <div className="space-y-4 p-5">
                <div className="h-6 w-3/4 animate-pulse rounded bg-[#ece7de]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#ece7de]" />
                <div className="h-7 w-1/3 animate-pulse rounded bg-[#dce7d8]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<MarketplaceProductReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<MarketplaceReviewSummary>({
    averageRating: 0,
    reviewCount: 0,
    breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reviewerName, setReviewerName] = useState("Customer");
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const addCartItem = useAppStore((state) => state.addCartItem);
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);
  const compare = useAppStore((state) => state.compare);
  const toggleWishlistItem = useAppStore((state) => state.toggleWishlistItem);
  const toggleCompareItem = useAppStore((state) => state.toggleCompareItem);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setFailed(false);

    fetchPublicMarketplaceProduct(params.slug)
      .then((data) => {
        if (!active) {
          return;
        }

        setProduct(data.product);
        setRelatedProducts(data.relatedProducts);
        setReviews(data.reviews);
        setReviewSummary(data.reviewSummary);
      })
      .catch(() => {
        if (active) {
          setFailed(true);
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
  }, [params.slug]);

  useEffect(() => {
    let active = true;

    fetchAuthStatus()
      .then((status) => {
        if (!active) {
          return;
        }

        setIsAuthenticated(status.authenticated);
        setReviewerName(status.user?.name ?? "Customer");
      })
      .catch(() => {
        if (active) {
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        if (active) {
          setAuthReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (failed || !product) {
    notFound();
  }

  const inCart = cart.some((item) => item.productId === product.id);
  const inWishlist = wishlist.some((item) => item.productId === product.id);
  const inCompare = compare.some((item) => item.productId === product.id);

  const reviewCount = reviewSummary.reviewCount || product.reviewCount || 0;
  const averageRating = reviewSummary.averageRating || product.rating || 0;

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setReviewError("Please sign in before submitting a review.");
      setReviewSuccess("");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const savedReview = await submitMarketplaceProductReview(product.id, {
        rating: selectedRating,
        body: reviewBody.trim(),
      });

      setReviews((current) => {
        const withoutCurrentUser = current.filter((review) => review.reviewerName !== reviewerName);
        return [savedReview, ...withoutCurrentUser];
      });
      setReviewSummary((current) => {
        const breakdown = { ...current.breakdown };
        const existingReview = reviews.find((review) => review.reviewerName === reviewerName);

        if (existingReview) {
          breakdown[existingReview.rating] = Math.max(0, (breakdown[existingReview.rating] ?? 0) - 1);
        }

        breakdown[savedReview.rating] = (breakdown[savedReview.rating] ?? 0) + 1;

        const updatedReviews = reviews.filter((review) => review.reviewerName !== reviewerName);
        const merged = [savedReview, ...updatedReviews];
        const average =
          merged.reduce((total, review) => total + review.rating, 0) / Math.max(merged.length, 1);

        return {
          averageRating: Number(average.toFixed(1)),
          reviewCount: merged.length,
          breakdown,
        };
      });
      setReviewBody("");
      setSelectedRating(5);
      setReviewSuccess("Your review has been saved successfully.");
    } catch (error) {
      setReviewError(getApiErrorMessage(error, "We could not save your review right now."));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <Link
        href="/marketplace"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#003b1b] transition hover:text-[#14532d]"
      >
        <ArrowLeft className="size-4" />
        Back to Marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#dcdfd8] bg-white shadow-[0_22px_32px_-24px_rgba(0,59,27,0.24)]">
          <img src={product.image} alt={product.name} className="aspect-[1/0.84] w-full object-cover" />
        </div>

        <div className="rounded-[2rem] border border-[#dcdfd8] bg-white p-7 shadow-[0_22px_32px_-24px_rgba(0,59,27,0.22)]">
          <div className="flex flex-wrap gap-2">
            {product.highlight ? (
              <span className="rounded-full bg-[#fff1dc] px-3 py-1 text-[10px] font-bold text-[#774500]">
                {product.highlight}
              </span>
            ) : null}
            {product.verified ? (
              <span className="rounded-full bg-[#ecf8ef] px-3 py-1 text-[10px] font-bold text-[#003b1b]">
                Verified Vendor
              </span>
            ) : null}
            {product.fastDelivery ? (
              <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-[10px] font-bold text-[#254672]">
                Fast Delivery
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-[2.4rem] font-extrabold tracking-[-0.04em] text-[#1b1c1c] sm:text-[3.25rem]">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-[#5f645f] sm:text-lg">
            {product.description}
          </p>

          <div className="mt-6 space-y-3 text-sm text-[#474b47]">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#003b1b]" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-[#003b1b]" />
              <span>{product.eta}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#003b1b]" />
              <span>
                Sold by{" "}
                {product.vendorSlug ? (
                  <Link href={`/marketplace/vendors/${product.vendorSlug}`} className="font-semibold text-[#003b1b] hover:underline">
                    {product.vendor}
                  </Link>
                ) : (
                  product.vendor
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="size-4 fill-[#003b1b] text-[#003b1b]" />
              <span>
                {averageRating.toFixed(1)} rating from {reviewCount} {reviewCount === 1 ? "verified review" : "verified reviews"}
              </span>
            </div>
          </div>

          {product.categorySlug ? (
            <div className="mt-4">
              <Link
                href={`/marketplace/categories/${product.categorySlug}`}
                className="inline-flex rounded-full bg-[#f7f4ef] px-3 py-1.5 text-xs font-bold text-[#003b1b] hover:bg-[#ece6dc]"
              >
                {product.category}
              </Link>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-end gap-4">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[2rem] font-extrabold text-[#003b1b] sm:text-[2.5rem]">
              {formatCurrency(product.price, "NGN")}
            </p>
            {product.originalPrice ? (
              <p className="pb-1 text-sm text-[#b4b8b1] line-through">
                {formatCurrency(product.originalPrice, "NGN")}
              </p>
            ) : null}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => addCartItem(product)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#003b1b] px-6 text-sm font-bold text-white transition hover:bg-[#14532d]"
            >
              <ShoppingCart className="size-4" />
              {inCart ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => toggleCompareItem(product)}
              className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl border px-6 text-sm font-bold transition ${
                inCompare
                  ? "border-[#003b1b] bg-[#ecf8ef] text-[#003b1b]"
                  : "border-[#d5d9d2] bg-[#fbfaf7] text-[#1b1c1c] hover:border-[#003b1b]/20 hover:text-[#003b1b]"
              }`}
            >
              <GitCompareArrows className="size-4" />
              {inCompare ? "In Compare" : "Compare Prices"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlistItem(product)}
            className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold transition ${
              inWishlist ? "text-[#003b1b]" : "text-[#607087] hover:text-[#003b1b]"
            }`}
          >
            <Heart className={`size-4 ${inWishlist ? "fill-current" : ""}`} />
            {inWishlist ? "Saved to Wishlist" : "Save to Wishlist"}
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-[#dcdfd8] bg-white p-6 shadow-[0_18px_28px_-22px_rgba(0,59,27,0.16)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7b807a]">Review Summary</p>
              <h2 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[2.4rem] font-extrabold text-[#003b1b]">
                {averageRating.toFixed(1)}
              </h2>
              <p className="mt-1 text-sm text-[#5f645f]">
                Based on {reviewCount} verified {reviewCount === 1 ? "purchase" : "purchases"}
              </p>
            </div>
            <div className="flex rounded-full bg-[#ecf8ef] px-3 py-1.5 text-xs font-bold text-[#003b1b]">
              Verified Buyers Only
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewSummary.breakdown[rating] ?? 0;
              const width = reviewCount > 0 ? `${(count / reviewCount) * 100}%` : "0%";

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex w-12 items-center gap-1 text-sm font-semibold text-[#1b1c1c]">
                    <span>{rating}</span>
                    <Star className="size-3.5 fill-[#003b1b] text-[#003b1b]" />
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#edf1ec]">
                    <div className="h-full rounded-full bg-[#003b1b]" style={{ width }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-[#666b66]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#dcdfd8] bg-white p-6 shadow-[0_18px_28px_-22px_rgba(0,59,27,0.16)]">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ecf8ef] text-[#003b1b]">
              <MessageSquareMore className="size-5" />
            </div>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.6rem] font-bold tracking-[-0.03em] text-[#1b1c1c]">
                Share Your Review
              </h2>
              <p className="text-sm text-[#5f645f]">Only verified buyers can rate and review this product.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#1b1c1c]">Your Rating</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(rating)}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedRating === rating
                        ? "bg-[#003b1b] text-white"
                        : "bg-[#f6f3f2] text-[#364036] hover:bg-[#e8eee7]"
                    }`}
                  >
                    <Star className={`size-4 ${selectedRating >= rating ? "fill-current" : ""}`} />
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">Your Experience</span>
              <textarea
                value={reviewBody}
                onChange={(event) => setReviewBody(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Tell other buyers about product quality, delivery, and overall satisfaction."
                className="w-full rounded-[1.4rem] border border-[#d5d9d2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#1b1c1c] outline-none transition focus:border-[#003b1b] focus:ring-2 focus:ring-[#003b1b]/10"
              />
            </label>

            {!authReady ? (
              <p className="text-sm text-[#666b66]">Checking your review access...</p>
            ) : isAuthenticated ? (
              <p className="text-sm text-[#5f645f]">
                Signed in as <span className="font-semibold text-[#003b1b]">{reviewerName}</span>
              </p>
            ) : (
              <p className="text-sm text-[#8b5e17]">
                Please sign in and complete a purchase before leaving a review.
              </p>
            )}

            {reviewError ? <p className="text-sm font-medium text-[#ba1a1a]">{reviewError}</p> : null}
            {reviewSuccess ? <p className="text-sm font-medium text-[#14532d]">{reviewSuccess}</p> : null}

            <button
              type="submit"
              disabled={submittingReview || !authReady}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#003b1b] px-5 text-sm font-bold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingReview ? "Saving Review..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 rounded-[2rem] border border-[#dcdfd8] bg-white p-6 shadow-[0_18px_28px_-22px_rgba(0,59,27,0.16)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.8rem] font-bold tracking-[-0.03em] text-[#1b1c1c]">
            Verified Buyer Reviews
          </h2>
          <span className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs font-bold text-[#003b1b]">
            {reviewCount} total
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article key={review.id} className="rounded-[1.5rem] border border-[#e2e5df] bg-[#fcfbf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#1b1c1c]">{review.reviewerName}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#666b66]">
                      <span className="rounded-full bg-[#ecf8ef] px-2.5 py-1 font-bold text-[#003b1b]">
                        Verified Purchase
                      </span>
                      {review.createdAt ? (
                        <span>{new Date(review.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#fff8ea] px-3 py-1.5 text-sm font-bold text-[#7a4c00]">
                    <Star className="size-4 fill-current" />
                    {review.rating.toFixed(1)}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#4f554f]">
                  {review.body?.trim() ? review.body : "Verified buyer rating submitted without additional written feedback."}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[#d5d9d2] bg-[#fbfaf7] px-5 py-10 text-center text-sm text-[#666b66]">
              No verified reviews yet. The first completed buyer review will appear here.
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.8rem] font-bold tracking-[-0.03em] text-[#1b1c1c]">
            Related Picks
          </h2>
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-[#003b1b] hover:underline">
            View Marketplace
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {relatedProducts.map((related) => (
            <Link
              key={related.slug ?? related.id}
              href={`/marketplace/products/${related.slug ?? related.id}`}
              className="overflow-hidden rounded-[1.6rem] border border-[#dcdfd8] bg-white shadow-[0_18px_28px_-22px_rgba(0,59,27,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_38px_-22px_rgba(0,59,27,0.24)]"
            >
              <img src={related.image} alt={related.name} className="aspect-[1/0.88] w-full object-cover" />
              <div className="p-5">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1b1c1c]">
                  {related.name}
                </h3>
                <p className="mt-1 text-xs text-[#666b66]">{related.vendor}</p>
                <p className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-[#003b1b]">
                  {formatCurrency(related.price, "NGN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
