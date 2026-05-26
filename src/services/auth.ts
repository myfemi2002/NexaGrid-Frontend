import { api, ensureCsrfCookie } from "@/services/api";

export type OtpFlow = "login" | "signup" | "reset";
export type OtpChannel = "email";

type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  profile_data?: {
    business_name?: string;
    community?: string;
  } | null;
};

export type CurrentSession = {
  id: number;
  device_name?: string | null;
  browser?: string | null;
  operating_system?: string | null;
  ip_address?: string | null;
  last_activity?: string | null;
  expires_at?: string | null;
  is_active: boolean;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type RequestOtpResponse = {
  purpose: OtpFlow;
  channel: OtpChannel;
  recipient: string;
  delivery_status: string;
  expires_at: string;
  otp_preview?: string;
};

export type VerifyOtpResponse = {
  purpose: OtpFlow;
  channel: OtpChannel;
  verified: boolean;
  verification_key: string;
  user?: ApiUser;
  reset_token?: string;
  email?: string;
};

export type RegisterResponse = {
  user: ApiUser;
};

export type LoginResponse = {
  user: ApiUser;
};

export type AuthStatus = {
  authenticated: boolean;
  user: ApiUser | null;
};

const TENANT_SLUG = "redemption-city";
const AUTH_STATE_KEY = "nexagrid.auth.state";

export type PendingAuthState = {
  flow: OtpFlow;
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  community?: string;
  channel?: "email";
  recipient?: string;
  resetEmail?: string;
  resetToken?: string;
  otpPreview?: string;
  verificationKey?: string;
};

export function savePendingAuthState(state: PendingAuthState) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
}

export function getPendingAuthState(): PendingAuthState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_STATE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingAuthState;
  } catch {
    return null;
  }
}

export function clearPendingAuthState() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(AUTH_STATE_KEY);
}

export function roleToDashboard(role?: string) {
  switch (role) {
    case "vendor":
      return "/dashboard/vendor";
    case "delivery-rider":
      return "/dashboard/logistics";
    case "service-provider":
    case "artisan":
      return "/dashboard/service-provider";
    case "apartment-host":
      return "/dashboard/host";
    case "tenant-admin":
      return "/dashboard/admin";
    case "super-admin":
      return "/dashboard/super-admin";
    default:
      return "/dashboard/customer";
  }
}

export function createFormStartedAt() {
  return Math.floor(Date.now() / 1000);
}

export function getDeviceFingerprint() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing =
    window.sessionStorage.getItem("nexagrid.device_fingerprint") ??
    window.localStorage.getItem("nexagrid.device_fingerprint");

  if (existing) {
    window.sessionStorage.setItem("nexagrid.device_fingerprint", existing);
    window.localStorage.setItem("nexagrid.device_fingerprint", existing);
    return existing;
  }

  const source = [
    window.navigator.userAgent,
    window.navigator.language,
    window.navigator.platform,
    window.screen?.width,
    window.screen?.height,
    window.Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone,
  ].join("|");

  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(index);
    hash |= 0;
  }

  const fingerprint = `fp_${Math.abs(hash)}`;

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("nexagrid.device_fingerprint", fingerprint);
    window.localStorage.setItem("nexagrid.device_fingerprint", fingerprint);
  }

  return fingerprint;
}

async function prepareSecureRequest() {
  await ensureCsrfCookie();
}

export async function requestOtp(params: {
  flow: OtpFlow;
  identity: string;
  formStartedAt: number;
}) {
  await prepareSecureRequest();

  const payload = {
    tenant_slug: TENANT_SLUG,
    purpose: params.flow,
    channel: "email" as const,
    email: params.identity,
    company_name: "",
    form_started_at: params.formStartedAt,
    device_fingerprint: getDeviceFingerprint(),
  };

  const response = await api.post<ApiEnvelope<RequestOtpResponse>>("/v1/auth/request-otp", payload, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data.data;
}

export async function verifyOtp(params: {
  flow: OtpFlow;
  identity: string;
  code: string;
}) {
  await prepareSecureRequest();

  const response = await api.post<ApiEnvelope<VerifyOtpResponse>>("/v1/auth/verify-otp", {
    tenant_slug: TENANT_SLUG,
    purpose: params.flow,
    channel: "email",
    email: params.identity,
    code: params.code,
    device_fingerprint: getDeviceFingerprint(),
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data.data;
}

export async function registerUser(params: {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  verificationKey: string;
  formStartedAt: number;
}) {
  await prepareSecureRequest();

  const response = await api.post<ApiEnvelope<RegisterResponse>>("/v1/auth/register", {
    tenant_slug: TENANT_SLUG,
    verification_key: params.verificationKey,
    name: params.name,
    email: params.email,
    phone: params.phone,
    role: params.role,
    password: params.password,
    password_confirmation: params.password,
    company_name: "",
    form_started_at: params.formStartedAt,
    device_fingerprint: getDeviceFingerprint(),
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data.data;
}

export async function loginWithPassword(params: { identity: string; password: string; formStartedAt: number }) {
  await prepareSecureRequest();

  const response = await api.post<ApiEnvelope<LoginResponse>>("/v1/auth/login", {
    tenant_slug: TENANT_SLUG,
    login: params.identity,
    password: params.password,
    company_name: "",
    form_started_at: params.formStartedAt,
    device_fingerprint: getDeviceFingerprint(),
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data.data;
}

export async function resetPassword(params: {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
  formStartedAt: number;
}) {
  await prepareSecureRequest();

  const response = await api.post<ApiEnvelope<{ message?: string }>>("/v1/auth/reset-password", {
    email: params.email,
    token: params.token,
    password: params.password,
    password_confirmation: params.passwordConfirmation,
    company_name: "",
    form_started_at: params.formStartedAt,
    device_fingerprint: getDeviceFingerprint(),
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data;
}

export async function updateProfile(params: {
  name?: string;
  phone?: string;
  businessName?: string;
  community?: string;
}) {
  await prepareSecureRequest();

  const response = await api.patch<ApiEnvelope<{ user: ApiUser }>>("/v1/auth/profile", {
    tenant_slug: TENANT_SLUG,
    name: params.name,
    phone: params.phone,
    business_name: params.businessName,
    community: params.community,
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data.data;
}

export async function forgotPassword(params: { email: string; formStartedAt: number }) {
  await prepareSecureRequest();

  const response = await api.post<ApiEnvelope<{ message?: string }>>("/v1/auth/forgot-password", {
    email: params.email,
    tenant_slug: TENANT_SLUG,
    company_name: "",
    form_started_at: params.formStartedAt,
    device_fingerprint: getDeviceFingerprint(),
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get<ApiEnvelope<{ user: ApiUser }>>("/v1/auth/me", {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
      "X-Device-Fingerprint": getDeviceFingerprint(),
    },
  });

  return response.data.data.user;
}

export async function fetchAuthStatus(): Promise<AuthStatus> {
  const response = await api.get<ApiEnvelope<{ user: ApiUser }>>("/v1/auth/me", {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
      "X-Device-Fingerprint": getDeviceFingerprint(),
    },
    validateStatus: (status) => status === 200 || status === 401,
  });

  if (response.status === 401) {
    return {
      authenticated: false,
      user: null,
    };
  }

  return {
    authenticated: true,
    user: response.data.data.user,
  };
}

export async function fetchCurrentSession() {
  const response = await api.get<ApiEnvelope<{ session: CurrentSession | null }>>("/v1/auth/session", {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
      "X-Device-Fingerprint": getDeviceFingerprint(),
    },
  });

  return response.data.data.session;
}

export async function logoutUser() {
  await prepareSecureRequest();

  await api.post("/v1/auth/logout", {}, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });
}

export async function submitUnlockRequest(params: { email: string; reason?: string; formStartedAt: number }) {
  await prepareSecureRequest();

  const response = await api.post<ApiEnvelope<{ message?: string }>>("/v1/auth/unlock-request", {
    email: params.email,
    reason: params.reason,
    tenant_slug: TENANT_SLUG,
    company_name: "",
    form_started_at: params.formStartedAt,
    device_fingerprint: getDeviceFingerprint(),
  }, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
  });

  return response.data;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data
  ) {
    const data = (error as { response?: { data?: { message?: string; errors?: Record<string, string[] | string> } } }).response?.data;

    if (data?.message) {
      return data.message;
    }

    const firstError = data?.errors ? Object.values(data.errors)[0] : null;

    if (Array.isArray(firstError)) {
      return firstError[0] ?? fallback;
    }

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return fallback;
}
