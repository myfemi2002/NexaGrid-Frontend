import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminOrderAnalyticsData = {
  scope: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
  } | null;
  metrics: {
    total_orders: number;
    gross_revenue: number;
    average_order_value: number;
    delivery_revenue: number;
    processing_orders: number;
    delivered_orders: number;
  };
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  weekly_series: Array<{
    day: string;
    revenue: number;
    count: number;
  }>;
  top_vendors: Array<{
    shop_id: number;
    shop_name: string;
    shop_slug?: string | null;
    orders_count: number;
    revenue_total: number;
  }>;
  recent_orders: Array<{
    id: number;
    order_number: string;
    status: string;
    fulfillment_mode: string;
    grand_total: number;
    delivery_fee: number;
    created_at?: string | null;
    shop: {
      name: string;
      slug?: string | null;
    };
    customer: {
      name: string;
      email?: string | null;
    };
  }>;
};

export async function fetchAdminOrderAnalytics() {
  const response = await api.get<ApiEnvelope<AdminOrderAnalyticsData>>("/v1/admin/order-analytics", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
