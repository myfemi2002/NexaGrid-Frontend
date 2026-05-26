import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminVendorPayoutsData = {
  items: Array<{
    id: number;
    reference: string;
    amount: number;
    status: string;
    note?: string | null;
    review_note?: string | null;
    requested_at?: string | null;
    reviewed_at?: string | null;
    vendor: {
      name: string;
      email?: string | null;
    };
  }>;
  metrics: {
    pending_count: number;
    pending_amount: number;
    approved_count: number;
    rejected_count: number;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export async function fetchAdminVendorPayouts(page = 1) {
  const response = await api.get<ApiEnvelope<AdminVendorPayoutsData>>("/v1/admin/vendor-payouts", {
    params: { page },
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function reviewAdminVendorPayout(
  payoutId: number,
  payload: { decision: "approved" | "rejected"; note?: string }
) {
  const response = await api.post<
    ApiEnvelope<{
      id: number;
      status: string;
      wallet: {
        available_balance: number;
        held_balance: number;
      };
    }>
  >(`/v1/admin/vendor-payouts/${payoutId}/review`, payload, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
