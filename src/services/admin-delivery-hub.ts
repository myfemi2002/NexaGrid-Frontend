import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminDeliveryHubData = {
  scope: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
  } | null;
  metrics: {
    total_deliveries: number;
    active_riders: number;
    average_eta_minutes: number;
    success_rate: number;
    in_transit: number;
    failed_deliveries: number;
  };
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  top_hubs: Array<{
    hub: string;
    deliveries_count: number;
    progress: number;
  }>;
  recent_deliveries: Array<{
    id: number;
    tracking_code?: string | null;
    status: string;
    eta_minutes?: number | null;
    hub: string;
    updated_at?: string | null;
    order: {
      order_number?: string | null;
      shop_name: string;
      customer_name: string;
    };
    agent: {
      name: string;
      email?: string | null;
    };
  }>;
};

export async function fetchAdminDeliveryHub() {
  const response = await api.get<ApiEnvelope<AdminDeliveryHubData>>("/v1/admin/delivery-hub", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
