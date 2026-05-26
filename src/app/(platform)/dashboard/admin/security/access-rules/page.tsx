"use client";

import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { fetchSecurityAccessRules } from "@/services/security-admin";

export default function SecurityAccessRulesPage() {
  return (
    <SecurityAdminLayout title="Blacklist / Whitelist" subtitle="Review trusted and blocked emails, domains, devices, and IPs used by the access rule engine.">
      <SecurityTableCard
        title="Access Rules"
        subtitle="Active and historical rule entries"
        load={async () => (await fetchSecurityAccessRules()).items}
        columns={[
          { header: "Type", render: (row) => row.type },
          { header: "Target", render: (row) => `${row.target_type}: ${row.value}` },
          { header: "Status", render: (row) => row.status },
          { header: "Reason", render: (row) => row.reason ?? "N/A" },
          { header: "Created By", render: (row) => row.creator?.email ?? "System" },
          { header: "When", render: (row) => new Date(row.created_at).toLocaleString() },
        ]}
      />
    </SecurityAdminLayout>
  );
}
