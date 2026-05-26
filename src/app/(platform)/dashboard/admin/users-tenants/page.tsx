"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ShieldCheck, Store, Truck, User, Users } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { getApiErrorMessage } from "@/services/auth";
import { fetchAdminUsersTenants, type AdminUsersTenantsData } from "@/services/admin-users-tenants";

function formatRole(role: string) {
  return role
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClassName(status?: string | null) {
  const normalized = (status ?? "").toLowerCase();

  if (normalized === "active" || normalized === "verified") {
    return "bg-emerald-100 text-emerald-950";
  }

  if (normalized === "pending") {
    return "bg-amber-100 text-amber-950";
  }

  if (normalized === "rejected" || normalized === "inactive" || normalized === "suspended") {
    return "bg-rose-100 text-rose-950";
  }

  return "bg-slate-100 text-slate-800";
}

export default function AdminUsersTenantsPage() {
  const [data, setData] = useState<AdminUsersTenantsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchAdminUsersTenants()
      .then((response) => {
        if (active) {
          setData(response);
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load users and tenants right now."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const recentAccounts = useMemo(() => data?.recent_users ?? [], [data]);
  const tenantRows = useMemo(() => data?.tenants ?? [], [data]);

  return (
    <AdminConsoleShell tenantLabel={data?.tenant?.name ?? "Lagos Hub (Main)"}>
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">
            Users &amp; Tenants
          </h3>
          <p className="text-[1.05rem] text-[#404941]">
            Monitor community accounts, role distribution, and tenant structure from one place.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-sm text-[#93000a]">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: <Users className="h-6 w-6" />, label: "Total Users", value: data?.metrics.total_users ?? 0 },
            { icon: <Store className="h-6 w-6" />, label: "Vendors", value: data?.metrics.vendors ?? 0 },
            { icon: <User className="h-6 w-6" />, label: "Customers", value: data?.metrics.customers ?? 0 },
            { icon: <ShieldCheck className="h-6 w-6" />, label: "Service Providers", value: data?.metrics.service_providers ?? 0 },
            { icon: <Truck className="h-6 w-6" />, label: "Riders", value: data?.metrics.riders ?? 0 },
            { icon: <Building2 className="h-6 w-6" />, label: "Active Users", value: data?.metrics.active_users ?? 0 },
          ].map((card) => (
            <div key={card.label} className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#b1f2be] p-3 text-[#00210d]">{card.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#404941]">{card.label}</p>
                  <p className="mt-2 font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.7fr_1fr]">
          <AdminDataTable
            title="Recent Accounts"
            description="Newly created accounts inside the current tenant scope."
            rows={recentAccounts}
            searchPlaceholder="Search users, emails, roles..."
            emptyMessage="No recent users found in this admin scope."
            pageSize={6}
            columns={[
              {
                id: "user",
                header: "User",
                accessor: (row) => row.name,
                render: (row) => (
                  <div>
                    <p className="font-semibold text-[#1b1c1c]">{row.name}</p>
                    <p className="mt-1 text-xs text-[#404941]">{row.email ?? row.phone ?? "No contact details"}</p>
                  </div>
                ),
              },
              {
                id: "role",
                header: "Role",
                accessor: (row) => formatRole(row.role),
                render: (row) => (
                  <div>
                    <p>{formatRole(row.role)}</p>
                    <p className="mt-1 text-xs text-[#404941]">{row.tenant?.name ?? "Tenant"}</p>
                  </div>
                ),
              },
              {
                id: "status",
                header: "Status",
                accessor: (row) => `${row.status} ${row.kyc_status ?? "pending"}`,
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                      {row.status}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.kyc_status)}`}>
                      KYC {row.kyc_status ?? "pending"}
                    </span>
                  </div>
                ),
              },
              {
                id: "created",
                header: "Created",
                accessor: (row) => row.created_at ?? "",
                render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString("en-NG") : "Recently"),
              },
            ]}
          />

          <div className="space-y-8">
            <AdminDataTable
              title="Tenant Summary"
              rows={tenantRows}
              searchPlaceholder="Search tenants..."
              emptyMessage="No tenants found in this admin scope."
              pageSize={5}
              columns={[
                {
                  id: "tenant",
                  header: "Tenant",
                  accessor: (row) => row.name,
                  render: (row) => (
                    <div>
                      <p className="font-semibold text-[#1b1c1c]">{row.name}</p>
                      <p className="mt-1 text-xs text-[#404941]">{row.slug} | {row.type}</p>
                    </div>
                  ),
                },
                {
                  id: "status",
                  header: "Status",
                  accessor: (row) => row.status,
                  render: (row) => (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                      {row.status}
                    </span>
                  ),
                },
                { id: "users", header: "Users", accessor: (row) => row.users_count },
                { id: "vendors", header: "Vendors", accessor: (row) => row.vendors_count },
              ]}
            />

            <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
              <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Scope</h4>
              <p className="mt-3 text-sm text-[#404941]">
                {data?.scope === "tenant"
                  ? "You are viewing users and tenants inside the current tenant community."
                  : "You are viewing platform-wide users and tenant distribution."}
              </p>
              {data?.tenant ? (
                <div className="mt-5 rounded-2xl border border-[#c0c9be] bg-[#fcf9f8] p-4">
                  <p className="font-semibold text-[#1b1c1c]">{data.tenant.name}</p>
                  <p className="mt-1 text-sm text-[#404941]">{data.tenant.slug} | {data.tenant.type}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AdminConsoleShell>
  );
}
