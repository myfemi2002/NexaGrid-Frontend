import { api } from "@/services/api";

const TENANT_SLUG = "redemption-city";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type ProviderOnboardingDocument = {
  id: number;
  document_type: "business_document" | "proof_of_address";
  original_name: string;
  mime_type: string;
  size: number;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
};

export type ProviderOnboardingData = {
  account: {
    full_name: string;
    email: string;
    phone_number?: string | null;
  };
  profile: {
    business_name?: string | null;
    business_type?: string | null;
    cac_registration_number?: string | null;
    business_address?: string | null;
    service_category?: string | null;
    service_subcategory?: string | null;
    years_of_experience?: number | null;
    price_range_min?: number | null;
    price_range_max?: number | null;
    emergency_service_available: boolean;
    service_description?: string | null;
    state?: string | null;
    city?: string | null;
    service_radius?: number | null;
    available_days: string[];
    working_hours: {
      start?: string;
      end?: string;
    };
    instant_booking: boolean;
  };
  identity: {
    identification_type: "nin" | "voters_card";
    identification_number: string;
    status: "pending" | "approved" | "rejected";
    has_document: boolean;
    document_name?: string | null;
  } | null;
  documents: ProviderOnboardingDocument[];
  current_step: number;
  verification_status: "pending" | "approved" | "rejected";
  completed_at?: string | null;
  steps: {
    account: boolean;
    identity: boolean;
    business: boolean;
    service: boolean;
    coverage: boolean;
  };
};

export type ProviderOnboardingStatus = {
  verification_status: "pending" | "approved" | "rejected";
  current_step: number;
  completed_at?: string | null;
  expected_review_time: string;
  documents: ProviderOnboardingDocument[];
  identity: ProviderOnboardingData["identity"];
};

function tenantHeaders() {
  return {
    "X-Tenant-Slug": TENANT_SLUG,
  };
}

export async function fetchProviderOnboarding() {
  const response = await api.get<ApiEnvelope<ProviderOnboardingData>>("/v1/provider/onboarding", {
    headers: tenantHeaders(),
  });

  return response.data.data;
}

export async function saveProviderOnboardingAccount(payload: {
  full_name: string;
  email: string;
  phone_number: string;
  password?: string;
  password_confirmation?: string;
}) {
  const response = await api.post<ApiEnvelope<ProviderOnboardingData>>("/v1/provider/onboarding/account", payload, {
    headers: tenantHeaders(),
  });

  return response.data;
}

export async function saveProviderOnboardingIdentity(payload: {
  identification_type: "nin" | "voters_card";
  identification_number: string;
  id_document: File;
}) {
  const formData = new FormData();
  formData.append("identification_type", payload.identification_type);
  formData.append("identification_number", payload.identification_number);
  formData.append("id_document", payload.id_document);

  const response = await api.post<ApiEnvelope<ProviderOnboardingData>>("/v1/provider/onboarding/identity", formData, {
    headers: {
      ...tenantHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function saveProviderOnboardingBusiness(payload: {
  business_name: string;
  business_type: string;
  cac_registration_number?: string;
  business_address: string;
}) {
  const response = await api.post<ApiEnvelope<ProviderOnboardingData>>("/v1/provider/onboarding/business", payload, {
    headers: tenantHeaders(),
  });

  return response.data;
}

export async function saveProviderOnboardingService(payload: {
  service_category: string;
  service_subcategory: string;
  years_of_experience: number;
  price_range_min: number;
  price_range_max: number;
  emergency_service_available: boolean;
  service_description: string;
}) {
  const response = await api.post<ApiEnvelope<ProviderOnboardingData>>("/v1/provider/onboarding/service", payload, {
    headers: tenantHeaders(),
  });

  return response.data;
}

export async function saveProviderOnboardingCoverage(payload: {
  state: string;
  city: string;
  service_radius: number;
  available_days: string[];
  working_hours: {
    start: string;
    end: string;
  };
  instant_booking: boolean;
}) {
  const response = await api.post<ApiEnvelope<ProviderOnboardingData>>("/v1/provider/onboarding/coverage", payload, {
    headers: tenantHeaders(),
  });

  return response.data;
}

export async function uploadProviderOnboardingDocument(payload: {
  document_type: "business_document" | "proof_of_address";
  document: File;
}) {
  const formData = new FormData();
  formData.append("document_type", payload.document_type);
  formData.append("document", payload.document);

  const response = await api.post<ApiEnvelope<{ document: ProviderOnboardingDocument; current_step: number }>>(
    "/v1/provider/onboarding/documents",
    formData,
    {
      headers: {
        ...tenantHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function fetchProviderOnboardingStatus() {
  const response = await api.get<ApiEnvelope<ProviderOnboardingStatus>>("/v1/provider/onboarding/status", {
    headers: tenantHeaders(),
  });

  return response.data.data;
}
