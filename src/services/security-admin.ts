import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type SecurityMetricMap = Record<string, number>;

export type ActiveSessionRecord = {
  id: number;
  device_name?: string | null;
  browser?: string | null;
  operating_system?: string | null;
  ip_address?: string | null;
  device_fingerprint?: string | null;
  last_activity?: string | null;
  expires_at?: string | null;
  is_active: boolean;
  revoked_at?: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
  tenant?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

export type LoginAttemptRecord = {
  id: number;
  email?: string | null;
  ip_address?: string | null;
  device_fingerprint?: string | null;
  status: string;
  reason?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
};

export type SecurityLockRecord = {
  id: number;
  lock_type: string;
  reason?: string | null;
  status: string;
  locked_until?: string | null;
  unlocked_at?: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
  tenant?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

export type SecurityActivityRecord = {
  id: number;
  event_type: string;
  email?: string | null;
  ip_address?: string | null;
  status: string;
  severity: string;
  description?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
};

export type SecurityAccessRuleRecord = {
  id: number;
  tenant_id?: number | null;
  type: string;
  target_type: string;
  value: string;
  reason?: string | null;
  status: string;
  creator?: {
    id: number;
    name: string;
    email: string;
  } | null;
  created_at: string;
};

export type SpamProtectionLogRecord = {
  id: number;
  source_type: string;
  ip_address?: string | null;
  spam_score: number;
  action_taken: string;
  reason?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
};

async function getSecurityData<T>(path: string, params?: Record<string, string>) {
  const response = await api.get<ApiEnvelope<T>>(path, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
    params,
  });

  return response.data.data;
}

export async function fetchSecurityOverview() {
  return getSecurityData<{ scope: string; metrics: SecurityMetricMap }>("/v1/admin/security/overview");
}

export async function fetchLoginAttempts() {
  return getSecurityData<{ items: LoginAttemptRecord[] }>("/v1/admin/security/login-attempts");
}

export async function fetchSecurityLocks() {
  return getSecurityData<{ items: SecurityLockRecord[] }>("/v1/admin/security/locks");
}

export async function fetchActiveSessions() {
  return getSecurityData<{ items: ActiveSessionRecord[] }>("/v1/admin/security/active-sessions");
}

export async function fetchSecurityActivityLogs() {
  return getSecurityData<{ items: SecurityActivityRecord[] }>("/v1/admin/security/activity-logs");
}

export async function fetchSecurityAccessRules() {
  return getSecurityData<{ items: SecurityAccessRuleRecord[] }>("/v1/admin/security/access-rules");
}

export async function fetchSpamProtectionLogs() {
  return getSecurityData<{ items: SpamProtectionLogRecord[] }>("/v1/admin/security/spam-logs");
}

export async function fetchUnlockHistory() {
  return getSecurityData<{ items: SecurityLockRecord[] }>("/v1/admin/security/unlock-history");
}

export async function terminateActiveSession(sessionId: number) {
  const response = await api.post<ApiEnvelope<{ session: ActiveSessionRecord }>>(
    `/v1/admin/security/active-sessions/${sessionId}/terminate`,
    {},
    {
      headers: {
        "X-Tenant-Slug": "redemption-city",
      },
    }
  );

  return response.data.data.session;
}
