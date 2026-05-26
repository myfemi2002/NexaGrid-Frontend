"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SecurityAdminLayout } from "@/components/security/security-admin-layout";
import { fetchSecurityOverview, type SecurityMetricMap } from "@/services/security-admin";

export default function SecurityOverviewPage() {
  const [metrics, setMetrics] = useState<SecurityMetricMap>({});
  const [scope, setScope] = useState("platform");

  useEffect(() => {
    fetchSecurityOverview()
      .then((response) => {
        setMetrics(response.metrics);
        setScope(response.scope);
      })
      .catch(() => undefined);
  }, []);

  return (
    <SecurityAdminLayout
      title="Security Dashboard"
      subtitle="Track authentication abuse, account locks, suspicious activity, and review actions across the platform."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Scope", scope],
          ["Failed Logins (24h)", String(metrics.failed_logins_24h ?? 0)],
          ["Active Locks", String(metrics.active_locks ?? 0)],
          ["Suspicious Events", String(metrics.suspicious_events_24h ?? 0)],
          ["Active Blacklists", String(metrics.active_blacklists ?? 0)],
          ["Blocked Spam", String(metrics.blocked_spam_24h ?? 0)],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 font-heading text-3xl font-semibold capitalize">{value}</p>
          </Card>
        ))}
      </div>
    </SecurityAdminLayout>
  );
}
