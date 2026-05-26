import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminUsersTenantsData = {
  scope: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
    type: string;
    status: string;
  } | null;
  metrics: {
    total_users: number;
    vendors: number;
    customers: number;
    service_providers: number;
    riders: number;
    active_users: number;
  };
  recent_users: Array<{
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    role: string;
    status: string;
    kyc_status?: string | null;
    created_at?: string | null;
    tenant: {
      id?: number | null;
      name?: string | null;
    };
  }>;
  tenants: Array<{
    id: number;
    name: string;
    slug: string;
    type: string;
    status: string;
    users_count: number;
    vendors_count: number;
  }>;
};

export async function fetchAdminUsersTenants() {
  const response = await api.get<ApiEnvelope<AdminUsersTenantsData>>("/v1/admin/users-tenants", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data;
}
