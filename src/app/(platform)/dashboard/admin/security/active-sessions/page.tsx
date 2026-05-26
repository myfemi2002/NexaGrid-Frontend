"use client";

import { useCallback, useState } from "react";
import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { SecurityTableCard } from "@/components/security/security-table-card";
import { Button } from "@/components/ui/button";
import { fetchActiveSessions, terminateActiveSession, type ActiveSessionRecord } from "@/services/security-admin";

export default function ActiveSessionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [terminatingId, setTerminatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const response = await fetchActiveSessions();
    return response.items;
  }, [refreshKey]);

  return (
    <SecurityAdminLayout
      title="Active Sessions"
      subtitle="Monitor current authenticated sessions, review active devices, and terminate sessions when a forced logout is required."
    >
      <SecurityTableCard<ActiveSessionRecord>
        title="Current Sessions"
        subtitle="Only one active browser or device should exist per account under the enforced single-session policy."
        load={load}
        columns={[
          {
            header: "User",
            render: (row) => (
              <div>
                <p className="font-medium">{row.user?.name ?? "Unknown user"}</p>
                <p className="text-xs text-muted-foreground">{row.user?.email ?? "No email"}</p>
              </div>
            ),
          },
          {
            header: "Device",
            render: (row) => (
              <div>
                <p>{row.device_name ?? "Unknown device"}</p>
                <p className="text-xs text-muted-foreground">
                  {[row.browser, row.operating_system].filter(Boolean).join(" • ") || "No client metadata"}
                </p>
              </div>
            ),
          },
          {
            header: "Network",
            render: (row) => (
              <div>
                <p>{row.ip_address ?? "Unknown IP"}</p>
                <p className="text-xs text-muted-foreground">{row.tenant?.slug ?? "platform"}</p>
              </div>
            ),
          },
          {
            header: "Activity",
            render: (row) => (
              <div>
                <p>{row.last_activity ? new Date(row.last_activity).toLocaleString() : "Unknown"}</p>
                <p className="text-xs text-muted-foreground">
                  Expires {row.expires_at ? new Date(row.expires_at).toLocaleString() : "n/a"}
                </p>
              </div>
            ),
          },
          {
            header: "Status",
            render: (row) => (
              <span className="inline-flex rounded-full border border-emerald/20 bg-emerald/5 px-3 py-1 text-xs font-semibold text-emerald">
                {row.is_active ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            header: "Action",
            render: (row) => (
              <Button
                size="sm"
                variant="secondary"
                disabled={terminatingId === row.id}
                onClick={async () => {
                  setTerminatingId(row.id);

                  try {
                    await terminateActiveSession(row.id);
                    setRefreshKey((value) => value + 1);
                  } finally {
                    setTerminatingId(null);
                  }
                }}
              >
                {terminatingId === row.id ? "Terminating..." : "Terminate"}
              </Button>
            ),
          },
        ]}
      />
    </SecurityAdminLayout>
  );
}
