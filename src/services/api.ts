import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api";
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const SESSION_FAILURE_CODES = new Set([
  "session_revoked",
  "session_expired",
  "session_invalid",
  "session_hijacking_detected",
]);

let csrfCookiePromise: Promise<void> | null = null;

export function getBackendBaseUrl() {
  return backendBaseUrl;
}

export async function ensureCsrfCookie() {
  if (csrfCookiePromise) {
    return csrfCookiePromise;
  }

  csrfCookiePromise = axios
    .get(`${backendBaseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(() => undefined)
    .finally(() => {
      csrfCookiePromise = null;
    });

  return csrfCookiePromise;
}

api.interceptors.request.use((config) => {
  config.headers["X-Tenant-Slug"] = config.headers["X-Tenant-Slug"] ?? "redemption-city";
  if (typeof window !== "undefined") {
    config.headers["X-Device-Fingerprint"] =
      config.headers["X-Device-Fingerprint"] ??
      window.sessionStorage.getItem("nexagrid.device_fingerprint") ??
      window.localStorage.getItem("nexagrid.device_fingerprint") ??
      undefined;
  }
  config.headers["X-Requested-With"] = config.headers["X-Requested-With"] ?? "XMLHttpRequest";
  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      const code = error.response?.data?.code;

      if (SESSION_FAILURE_CODES.has(code)) {
        const loginUrl = new URL("/auth/login", window.location.origin);
        loginUrl.searchParams.set("session", code);
        loginUrl.searchParams.set("reason", error.response?.data?.message ?? "Your session is no longer active. Please sign in again.");
        window.location.assign(loginUrl.toString());
      }
    }

    return Promise.reject(error);
  }
);
