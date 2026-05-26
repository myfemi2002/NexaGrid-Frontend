import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ServiceProviderDashboardData = {
  provider: {
    name: string;
    business_name: string;
    about?: string | null;
    years_of_experience?: number | null;
    certifications?: string[] | null;
    coverage_area?: string | null;
    availability_status?: string | null;
    kyc_status?: string | null;
    wallet_balance?: number | null;
  };
  metrics: {
    monthly_earnings: number;
    growth_percent: number;
    completed_jobs: number;
    average_rating: number;
    new_requests: number;
    active_requests: number;
  };
  requests: Array<{
    id: number;
    title: string;
    location: string;
    status: string;
    status_label: string;
    subcopy: string;
    customer_name?: string | null;
    amount: number;
  }>;
  calendar: Array<{
    id: number;
    scheduled_for?: string | null;
    label: string;
  }>;
  reviews: Array<{
    id: number;
    rating: number;
    body?: string | null;
    reviewer_name: string;
    created_at: string;
  }>;
};

export async function fetchServiceProviderDashboard() {
  const response = await api.get<ApiEnvelope<ServiceProviderDashboardData>>("/v1/dashboard/service-provider", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function acceptServiceRequest(requestId: number) {
  const response = await api.post<ApiEnvelope<{ request_id: number; status: string }>>(
    `/v1/dashboard/service-provider/requests/${requestId}/accept`,
    {},
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data;
}

export async function completeServiceRequest(requestId: number) {
  const response = await api.post<ApiEnvelope<{ request_id: number; status: string }>>(
    `/v1/dashboard/service-provider/requests/${requestId}/complete`,
    {},
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data;
}
