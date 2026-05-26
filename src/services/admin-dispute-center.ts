import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminDisputeCenterData = {
  scope: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
  } | null;
  metrics: {
    total_disputes: number;
    open_disputes: number;
    in_review_disputes: number;
    resolved_disputes: number;
    urgent_disputes: number;
  };
  items: Array<{
    id: number;
    reference: string;
    summary: string;
    status: string;
    priority: string;
    reference_type: string;
    reference_id: number | null;
    evidence_count: number;
    created_at?: string | null;
    latest_admin_note?: string | null;
    user: {
      name: string;
      email?: string | null;
    };
  }>;
};

export async function fetchAdminDisputeCenter() {
  const response = await api.get<ApiEnvelope<AdminDisputeCenterData>>("/v1/admin/dispute-center", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}

export async function reviewAdminDispute(
  disputeId: number,
  payload: {
    status: "in_review" | "resolved";
    note?: string;
  }
) {
  const response = await api.post<ApiEnvelope<{ id: number; status: string; latest_admin_note?: string | null; updated_at?: string | null }>>(
    `/v1/admin/dispute-center/${disputeId}/review`,
    payload,
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data.data;
}
