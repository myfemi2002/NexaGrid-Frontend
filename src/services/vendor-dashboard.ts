import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type VendorDashboardData = {
  vendor: {
    name: string;
    business_name: string;
    shop_name?: string | null;
    location?: string | null;
    about?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
    verified: boolean;
  };
  metrics: {
    total_sales: number;
    growth_percent: number;
    new_orders: number;
    active_products: number;
    wallet_balance: number;
  };
  recent_orders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    amount: number;
    status: string;
    created_at?: string | null;
  }>;
  low_stock: Array<{
    id: number;
    name: string;
    image_url?: string | null;
    quantity: number;
    low_stock_threshold: number;
  }>;
  payouts: {
    pending_count: number;
    pending_amount: number;
    latest_request?: {
      reference: string;
      status: string;
      amount: number;
      created_at?: string | null;
    } | null;
  };
  logistics: {
    scheduled_pickups: number;
    hub_name: string;
    cutoff_time: string;
    message: string;
  };
  catalog: {
    categories: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  };
};

export type VendorInventoryProduct = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_price?: number | null;
  status: string;
  image_url?: string | null;
  category: {
    id?: number | null;
    name?: string | null;
    slug?: string | null;
  };
  inventory: {
    quantity: number;
    reserved_quantity: number;
    low_stock_threshold: number;
  };
  updated_at?: string | null;
};

export type VendorOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  fulfillment_mode?: string | null;
  item_count: number;
  totals: {
    subtotal: number;
    delivery_fee: number;
    discount_total: number;
    grand_total: number;
  };
  created_at?: string | null;
  updated_at?: string | null;
  meta?: Record<string, unknown>;
};

export type VendorOrdersData = {
  orders: VendorOrder[];
  metrics: {
    total_orders: number;
    pending_orders: number;
    shipped_orders: number;
    delivered_orders: number;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type VendorProfileData = {
  vendor_name: string;
  business_name: string;
  shop_name: string;
  slug: string;
  category?: string | null;
  location?: string | null;
  about?: string | null;
  verified: boolean;
  status?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
};

export type VendorEarningsData = {
  wallet: {
    available_balance: number;
    held_balance: number;
    currency: string;
  };
  metrics: {
    gross_revenue: number;
    monthly_revenue: number;
    orders_count: number;
    pending_payouts: number;
  };
  transactions: Array<{
    id: string;
    title: string;
    category: string;
    amount: number;
    direction: "credit" | "debit";
    status: string;
    timestamp?: string | null;
  }>;
  payouts: Array<{
    id: number;
    reference: string;
    amount: number;
    status: string;
    note?: string | null;
    created_at?: string | null;
  }>;
};

export async function fetchVendorDashboard() {
  const response = await api.get<ApiEnvelope<VendorDashboardData>>("/v1/dashboard/vendor", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function fetchVendorProducts(page = 1) {
  return fetchVendorProductsWithFilters({ page });
}

export async function fetchVendorProductsWithFilters({
  page = 1,
  q,
  status,
  categoryId,
}: {
  page?: number;
  q?: string;
  status?: string;
  categoryId?: number | null;
}) {
  const response = await api.get<
    ApiEnvelope<{
      products: VendorInventoryProduct[];
      pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        has_more: boolean;
      };
    }>
  >("/v1/dashboard/vendor/products", {
    params: {
      page,
      q: q || undefined,
      status: status || undefined,
      category_id: categoryId || undefined,
    },
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function createVendorProduct(payload: {
  product_category_id: number;
  name: string;
  description?: string;
  price: number;
  compare_price?: number | null;
  quantity: number;
  low_stock_threshold?: number;
  status?: "draft" | "published";
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append("product_category_id", String(payload.product_category_id));
  formData.append("name", payload.name);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  formData.append("price", String(payload.price));
  if (payload.compare_price !== null && payload.compare_price !== undefined) {
    formData.append("compare_price", String(payload.compare_price));
  }
  formData.append("quantity", String(payload.quantity));
  formData.append("low_stock_threshold", String(payload.low_stock_threshold ?? 10));
  formData.append("status", payload.status ?? "published");
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await api.post<ApiEnvelope<{ product_id: number; name: string; slug: string }>>(
    "/v1/dashboard/vendor/products",
    formData,
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}

export async function updateVendorInventory(
  productId: number,
  payload: {
    quantity: number;
    low_stock_threshold?: number;
  }
) {
  const response = await api.patch<ApiEnvelope<{ product_id: number; quantity: number; low_stock_threshold: number }>>(
    `/v1/dashboard/vendor/products/${productId}/inventory`,
    payload,
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data.data;
}

export async function updateVendorProduct(
  productId: number,
  payload: {
    product_category_id: number;
    name: string;
    description?: string;
    price: number;
    compare_price?: number | null;
    status: "draft" | "published";
  }
) {
  const response = await api.patch<
    ApiEnvelope<{ product_id: number; name: string; slug: string; status: string }>
  >(`/v1/dashboard/vendor/products/${productId}`, payload, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function updateVendorProductImage(productId: number, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<
    ApiEnvelope<{ product_id: number; image_url: string }>
  >(`/v1/dashboard/vendor/products/${productId}/image`, formData, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}

export async function fetchVendorOrders(page = 1) {
  const response = await api.get<ApiEnvelope<VendorOrdersData>>("/v1/dashboard/vendor/orders", {
    params: { page },
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function updateVendorOrderStatus(
  orderId: number,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  const response = await api.patch<ApiEnvelope<{ order_id: number; status: string }>>(
    `/v1/dashboard/vendor/orders/${orderId}/status`,
    { status },
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data.data;
}

export async function requestVendorPayout(payload: { amount: number; note?: string }) {
  const response = await api.post<
    ApiEnvelope<{
      transaction_id: number;
      reference: string;
      status: string;
      amount: number;
      wallet: {
        available_balance: number;
        held_balance: number;
      };
    }>
  >("/v1/dashboard/vendor/payouts/request", payload, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function fetchVendorProfile() {
  const response = await api.get<ApiEnvelope<{ profile: VendorProfileData }>>("/v1/dashboard/vendor/profile", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data.profile;
}

export async function updateVendorProfile(payload: {
  business_name: string;
  shop_name: string;
  category?: string;
  location?: string;
  about?: string;
  status?: "draft" | "active" | "inactive";
}) {
  const response = await api.patch<ApiEnvelope<{ profile: VendorProfileData }>>(
    "/v1/dashboard/vendor/profile",
    payload,
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data.data.profile;
}

export async function updateVendorLogo(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<ApiEnvelope<{ profile: VendorProfileData }>>(
    "/v1/dashboard/vendor/profile/logo",
    formData,
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data.profile;
}

export async function updateVendorBanner(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<ApiEnvelope<{ profile: VendorProfileData }>>(
    "/v1/dashboard/vendor/profile/banner",
    formData,
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data.profile;
}

export async function fetchVendorEarnings() {
  const response = await api.get<ApiEnvelope<VendorEarningsData>>("/v1/dashboard/vendor/earnings", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
