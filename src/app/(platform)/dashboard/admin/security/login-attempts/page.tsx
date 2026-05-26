"use client";

import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { fetchLoginAttempts } from "@/services/security-admin";

export default function LoginAttemptsPage() {
  return (
    <SecurityAdminLayout title="Login Attempts" subtitle="Review successful and failed sign-in attempts by email, IP, and device fingerprint.">
      <SecurityTableCard
        title="Attempts"
        subtitle="Recent authentication activity"
        load={async () => (await fetchLoginAttempts()).items}
        columns={[
          { header: "Email", render: (row) => row.email ?? "Unknown" },
          { header: "Status", render: (row) => row.status },
          { header: "Reason", render: (row) => row.reason ?? "N/A" },
          { header: "IP Address", render: (row) => row.ip_address ?? "N/A" },
          { header: "User", render: (row) => row.user?.name ?? "Guest" },
          { header: "When", render: (row) => new Date(row.created_at).toLocaleString() },
        ]}
      />
    </SecurityAdminLayout>
  );
}
