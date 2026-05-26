import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminOverviewData = {
  scope: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
  } | null;
  metrics: {
    users: number;
    active_vendors: number;
    pending_vendor_approvals: number;
    published_products: number;
    orders: number;
    active_deliveries: number;
    service_bookings: number;
    apartment_bookings: number;
    open_disputes: number;
    wallet_float: number;
    monthly_gmv: number;
  };
  sales_performance: {
    range: string;
    series: Array<{
      day: string;
      amount: number;
    }>;
  };
  approval_queue: Array<{
    id: number;
    name: string;
    category: string;
    location: string;
    status: string;
    initials: string;
  }>;
  delivery_performance: {
    active_riders: number;
    average_delivery_minutes: number;
    success_rate: number;
    top_hubs: Array<{
      hub: string;
      deliveries_count: number;
      progress: number;
    }>;
  };
  dispute_center: {
    high_priority_count: number;
    items: Array<{
      id: number;
      reference: string;
      summary: string;
      status: string;
      escalation: "urgent" | "in_review";
    }>;
  };
};

export async function fetchAdminOverview() {
  const response = await api.get<ApiEnvelope<AdminOverviewData>>("/v1/admin/overview", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
