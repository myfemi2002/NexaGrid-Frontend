import { api } from "@/services/api";
import type { Product } from "@/types";

type ApiMarketplaceProduct = {
  id: number;
  slug: string;
  name: string;
  category?: string | null;
  category_slug?: string | null;
  vendor?: string | null;
  vendor_slug?: string | null;
  description?: string | null;
  price: number | string;
  compare_price?: number | string | null;
  image_url?: string | null;
  verified?: boolean;
  location?: string | null;
  eta?: string | null;
  highlight?: string | null;
  fast_delivery?: boolean;
  in_stock?: boolean;
  average_rating?: number | string | null;
  review_count?: number | string | null;
};

type MarketplaceResponse = {
  success: boolean;
  data: {
    products: ApiMarketplaceProduct[];
    categories: string[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      next_page_url?: string | null;
      has_more: boolean;
    };
  };
};

export type MarketplaceQuery = {
  q?: string;
  category?: string;
  verified?: boolean;
  fastDelivery?: boolean;
  page?: number;
  sort?: "latest" | "price_asc" | "price_desc" | "name";
};

export type MarketplaceResult = {
  products: Product[];
  categories: string[];
  pagination: MarketplaceResponse["data"]["pagination"];
};

type MarketplaceCategoryResponse = {
  success: boolean;
  data: {
    category: {
      name: string;
      slug: string;
      description?: string | null;
    };
    products: ApiMarketplaceProduct[];
    pagination: MarketplaceResponse["data"]["pagination"];
  };
};

type MarketplaceVendorResponse = {
  success: boolean;
  data: {
    vendor: {
      name: string;
      slug: string;
      category?: string | null;
      verified: boolean;
      location?: string | null;
      status?: string | null;
    };
    products: ApiMarketplaceProduct[];
    pagination: MarketplaceResponse["data"]["pagination"];
  };
};

type MarketplaceProductDetailResponse = {
  success: boolean;
  data: {
    product: ApiMarketplaceProduct;
    related_products: ApiMarketplaceProduct[];
    reviews: Array<{
      id: number;
      rating: number;
      body?: string | null;
      reviewer_name?: string | null;
      verified_purchase: boolean;
      created_at?: string | null;
    }>;
    review_summary: {
      average_rating: number;
      review_count: number;
      breakdown: Record<string, number>;
    };
  };
};

export type MarketplaceProductReview = {
  id: number;
  rating: number;
  body?: string | null;
  reviewerName: string;
  verifiedPurchase: boolean;
  createdAt?: string | null;
};

export type MarketplaceReviewSummary = {
  averageRating: number;
  reviewCount: number;
  breakdown: Record<number, number>;
};

function mapProduct(product: ApiMarketplaceProduct): Product {
  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    category: product.category ?? "Marketplace",
    categorySlug: product.category_slug ?? undefined,
    vendor: product.vendor ?? "Verified Vendor",
    vendorSlug: product.vendor_slug ?? undefined,
    price: Number(product.price ?? 0),
    originalPrice: product.compare_price ? Number(product.compare_price) : undefined,
    eta: product.eta ?? "Standard delivery",
    location: product.location ?? "Redemption City",
    image: product.image_url ?? "/images/product-rice.png",
    inStock: product.in_stock ?? true,
    verified: product.verified ?? false,
    fastDelivery: product.fast_delivery ?? false,
    highlight: product.highlight ?? undefined,
    description: product.description ?? "Product details will appear here.",
    rating: Number(product.average_rating ?? (product.verified ? 4.8 : 4.5)),
    reviewCount: Number(product.review_count ?? 0),
  };
}

export async function fetchPublicMarketplace(query: MarketplaceQuery = {}): Promise<MarketplaceResult> {
  const response = await api.get<MarketplaceResponse>("/v1/public/marketplace", {
    params: {
      q: query.q || undefined,
      category: query.category || undefined,
      verified: query.verified || undefined,
      fast_delivery: query.fastDelivery || undefined,
      page: query.page || 1,
      sort: query.sort && query.sort !== "latest" ? query.sort : undefined,
    },
  });

  return {
    products: response.data.data.products.map(mapProduct),
    categories: response.data.data.categories,
    pagination: response.data.data.pagination,
  };
}

export async function fetchPublicMarketplaceProduct(slug: string): Promise<{
  product: Product;
  relatedProducts: Product[];
  reviews: MarketplaceProductReview[];
  reviewSummary: MarketplaceReviewSummary;
}> {
  const response = await api.get<MarketplaceProductDetailResponse>(`/v1/public/marketplace/${slug}`);

  return {
    product: mapProduct(response.data.data.product),
    relatedProducts: response.data.data.related_products.map(mapProduct),
    reviews: response.data.data.reviews.map((review) => ({
      id: review.id,
      rating: Number(review.rating ?? 0),
      body: review.body ?? null,
      reviewerName: review.reviewer_name ?? "Verified Buyer",
      verifiedPurchase: review.verified_purchase,
      createdAt: review.created_at ?? null,
    })),
    reviewSummary: {
      averageRating: Number(response.data.data.review_summary.average_rating ?? 0),
      reviewCount: Number(response.data.data.review_summary.review_count ?? 0),
      breakdown: Object.fromEntries(
        Object.entries(response.data.data.review_summary.breakdown ?? {}).map(([key, value]) => [
          Number(key),
          Number(value ?? 0),
        ]),
      ) as Record<number, number>,
    },
  };
}

export async function fetchPublicMarketplaceCategory(
  slug: string,
  query: Pick<MarketplaceQuery, "page" | "sort" | "verified" | "fastDelivery"> = {},
): Promise<{
  category: { name: string; slug: string; description?: string | null };
  products: Product[];
  pagination: MarketplaceResponse["data"]["pagination"];
}> {
  const response = await api.get<MarketplaceCategoryResponse>(`/v1/public/marketplace/categories/${slug}`, {
    params: {
      page: query.page || 1,
      sort: query.sort && query.sort !== "latest" ? query.sort : undefined,
      verified: query.verified || undefined,
      fast_delivery: query.fastDelivery || undefined,
    },
  });

  return {
    category: response.data.data.category,
    products: response.data.data.products.map(mapProduct),
    pagination: response.data.data.pagination,
  };
}

export async function fetchPublicMarketplaceVendor(
  slug: string,
  query: Pick<MarketplaceQuery, "page" | "sort"> = {},
): Promise<{
  vendor: {
    name: string;
    slug: string;
    category?: string | null;
    verified: boolean;
    location?: string | null;
    status?: string | null;
  };
  products: Product[];
  pagination: MarketplaceResponse["data"]["pagination"];
}> {
  const response = await api.get<MarketplaceVendorResponse>(`/v1/public/marketplace/vendors/${slug}`, {
    params: {
      page: query.page || 1,
      sort: query.sort && query.sort !== "latest" ? query.sort : undefined,
    },
  });

  return {
    vendor: response.data.data.vendor,
    products: response.data.data.products.map(mapProduct),
    pagination: response.data.data.pagination,
  };
}

export async function submitMarketplaceProductReview(productId: string, payload: { rating: number; body?: string }) {
  const response = await api.post<{
    success: boolean;
    data: {
      review: {
        id: number;
        rating: number;
        body?: string | null;
        reviewer_name?: string | null;
        verified_purchase: boolean;
        created_at?: string | null;
      };
    };
  }>(`/v1/marketplace/products/${productId}/reviews`, payload);

  return {
    id: response.data.data.review.id,
    rating: Number(response.data.data.review.rating ?? 0),
    body: response.data.data.review.body ?? null,
    reviewerName: response.data.data.review.reviewer_name ?? "Verified Buyer",
    verifiedPurchase: response.data.data.review.verified_purchase,
    createdAt: response.data.data.review.created_at ?? null,
  } satisfies MarketplaceProductReview;
}
