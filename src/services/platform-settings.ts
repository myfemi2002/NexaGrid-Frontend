import { api } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type MailSettingForm = {
  mailer: "smtp";
  host: string;
  port: string;
  username: string;
  password: string;
  from_name: string;
  from_address: string;
  encryption: "tls" | "ssl";
};

export async function fetchMailSettings() {
  const response = await api.get<ApiEnvelope<{ settings: MailSettingForm }>>("/v1/admin/platform-settings/mail", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data.data.settings;
}

export async function updateMailSettings(settings: MailSettingForm) {
  const response = await api.put<ApiEnvelope<{ settings: MailSettingForm }>>("/v1/admin/platform-settings/mail", settings, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data;
}

export async function sendMailTest(to_email: string) {
  const response = await api.post<ApiEnvelope<Record<string, never>>>("/v1/admin/platform-settings/mail/test", {
    to_email,
  }, {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
  });

  return response.data;
}
