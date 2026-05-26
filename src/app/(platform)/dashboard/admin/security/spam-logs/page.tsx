"use client";

import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { fetchSpamProtectionLogs } from "@/services/security-admin";

export default function SpamProtectionLogsPage() {
  return (
    <SecurityAdminLayout title="Spam Protection Logs" subtitle="Inspect challenged, blocked, and reviewed submissions across auth and abuse-sensitive endpoints.">
      <SecurityTableCard
        title="Spam Review Queue"
        subtitle="Recent spam scoring decisions"
        load={async () => (await fetchSpamProtectionLogs()).items}
        columns={[
          { header: "Source", render: (row) => row.source_type },
          { header: "Score", render: (row) => row.spam_score },
          { header: "Action", render: (row) => row.action_taken },
          { header: "Reason", render: (row) => row.reason ?? "N/A" },
          { header: "IP Address", render: (row) => row.ip_address ?? "N/A" },
          { header: "When", render: (row) => new Date(row.created_at).toLocaleString() },
        ]}
      />
    </SecurityAdminLayout>
  );
}
