import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminVendorApprovalsData = {
  items: Array<{
    id: number;
    name: string;
    slug: string;
    category: string;
    status: string;
    is_verified: boolean;
    location: string;
    review_note?: string | null;
    reviewed_at?: string | null;
    owner: {
      name: string;
      email?: string | null;
      status?: string | null;
      kyc_status?: string | null;
    };
  }>;
  metrics: {
    pending_count: number;
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

export async function fetchAdminVendorApprovals(page = 1) {
  const response = await api.get<ApiEnvelope<AdminVendorApprovalsData>>("/v1/admin/vendor-approvals", {
    params: { page },
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function reviewAdminVendorApproval(
  shopId: number,
  payload: { decision: "approved" | "rejected"; note?: string }
) {
  const response = await api.post<
    ApiEnvelope<{
      id: number;
      status: string;
      is_verified: boolean;
    }>
  >(`/v1/admin/vendor-approvals/${shopId}/review`, payload, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
