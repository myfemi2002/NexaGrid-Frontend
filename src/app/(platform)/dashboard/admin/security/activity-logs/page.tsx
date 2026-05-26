"use client";

import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { fetchSecurityActivityLogs } from "@/services/security-admin";

export default function SecurityActivityLogsPage() {
  return (
    <SecurityAdminLayout title="Suspicious Activity Logs" subtitle="Every sensitive authentication and security event is recorded here for review and incident follow-up.">
      <SecurityTableCard
        title="Activity Logs"
        subtitle="Recent security activity"
        load={async () => (await fetchSecurityActivityLogs()).items}
        columns={[
          { header: "Event", render: (row) => row.event_type },
          { header: "Severity", render: (row) => row.severity },
          { header: "Status", render: (row) => row.status },
          { header: "Email", render: (row) => row.email ?? "N/A" },
          { header: "IP Address", render: (row) => row.ip_address ?? "N/A" },
          { header: "When", render: (row) => new Date(row.created_at).toLocaleString() },
        ]}
      />
    </SecurityAdminLayout>
  );
}
