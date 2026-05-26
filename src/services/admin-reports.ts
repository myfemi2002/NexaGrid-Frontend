import { api } from "@/services/api";

function parseFilenameFromDisposition(disposition?: string | null) {
  if (!disposition) {
    return "nexagrid-monthly-report.csv";
  }

  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? "nexagrid-monthly-report.csv";
}

export async function downloadAdminMonthlyReport() {
  const response = await api.get("/v1/admin/reports/monthly", {
    headers: {
      "X-Tenant-Slug": "redemption-city",
    },
    responseType: "blob",
  });

  const filename = parseFilenameFromDisposition(response.headers["content-disposition"]);

  return {
    blob: response.data as Blob,
    filename,
  };
}
