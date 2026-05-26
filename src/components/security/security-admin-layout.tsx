"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/admin/security", label: "Overview" },
  { href: "/dashboard/admin/security/login-attempts", label: "Login Attempts" },
  { href: "/dashboard/admin/security/locked-accounts", label: "Locked Accounts" },
  { href: "/dashboard/admin/security/active-sessions", label: "Active Sessions" },
  { href: "/dashboard/admin/security/activity-logs", label: "Activity Logs" },
  { href: "/dashboard/admin/security/access-rules", label: "Blacklist / Whitelist" },
  { href: "/dashboard/admin/security/spam-logs", label: "Spam Logs" },
  { href: "/dashboard/admin/security/unlock-history", label: "Unlock History" },
];

export function SecurityAdminLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardShell slug="super-admin" title={title} subtitle={subtitle}>
      <div className="mb-6 flex flex-wrap gap-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active ? "border-emerald bg-emerald text-white" : "border-border bg-background text-muted-foreground hover:text-emerald"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      {children}
    </DashboardShell>
  );
}
