"use client";

import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { fetchSecurityLocks } from "@/services/security-admin";

export default function LockedAccountsPage() {
  return (
    <SecurityAdminLayout title="Locked Accounts" subtitle="View temporary cooldowns, account locks, and IP blocks raised by the protection layer.">
      <SecurityTableCard
        title="Security Locks"
        subtitle="Recent and active lock records"
        load={async () => (await fetchSecurityLocks()).items}
        columns={[
          { header: "User", render: (row) => row.user?.email ?? "IP-based lock" },
          { header: "Type", render: (row) => row.lock_type },
          { header: "Status", render: (row) => row.status },
          { header: "Reason", render: (row) => row.reason ?? "N/A" },
          { header: "Locked Until", render: (row) => row.locked_until ? new Date(row.locked_until).toLocaleString() : "Manual" },
          { header: "Tenant", render: (row) => row.tenant?.name ?? "Platform" },
        ]}
      />
    </SecurityAdminLayout>
  );
}
