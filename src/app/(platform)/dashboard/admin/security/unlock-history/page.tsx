"use client";

import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { fetchUnlockHistory } from "@/services/security-admin";

export default function UnlockHistoryPage() {
  return (
    <SecurityAdminLayout title="User Unlock History" subtitle="Review released locks and follow the administrative trail for account recovery actions.">
      <SecurityTableCard
        title="Unlock History"
        subtitle="Released security lock records"
        load={async () => (await fetchUnlockHistory()).items}
        columns={[
          { header: "User", render: (row) => row.user?.email ?? "IP lock" },
          { header: "Type", render: (row) => row.lock_type },
          { header: "Status", render: (row) => row.status },
          { header: "Unlocked At", render: (row) => row.unlocked_at ? new Date(row.unlocked_at).toLocaleString() : "N/A" },
          { header: "Reason", render: (row) => row.reason ?? "N/A" },
          { header: "Tenant", render: (row) => row.tenant?.name ?? "Platform" },
        ]}
      />
    </SecurityAdminLayout>
  );
}
