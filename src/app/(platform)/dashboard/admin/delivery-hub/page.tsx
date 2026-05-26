"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Truck, UserRound, XCircle } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { getApiErrorMessage } from "@/services/auth";
import { fetchAdminDeliveryHub, type AdminDeliveryHubData } from "@/services/admin-delivery-hub";

function statusClassName(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "delivered") return "bg-emerald-100 text-emerald-950";
  if (normalized === "queued" || normalized === "assigned" || normalized === "in_transit") return "bg-amber-100 text-amber-950";
  if (normalized === "failed") return "bg-rose-100 text-rose-950";
  return "bg-slate-100 text-slate-800";
}

export default function AdminDeliveryHubPage() {
  const [data, setData] = useState<AdminDeliveryHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAdminDeliveryHub()
      .then((response) => {
        if (active) setData(response);
      })
      .catch((error) => {
        if (active) setErrorMessage(getApiErrorMessage(error, "Unable to load delivery hub right now."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const topHubs = useMemo(() => data?.top_hubs ?? [], [data]);
  const recentDeliveries = useMemo(() => data?.recent_deliveries ?? [], [data]);

  return (
    <AdminConsoleShell tenantLabel={data?.tenant?.name ?? "Lagos Hub (Main)"}>
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">Delivery Hub</h3>
          <p className="text-[1.05rem] text-[#404941]">
            Track rider activity, hub throughput, shipment status, and latest delivery movement across the tenant.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-sm text-[#93000a]">{errorMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: <Truck className="h-6 w-6" />, label: "Total Deliveries", value: data?.metrics.total_deliveries ?? 0 },
            { icon: <UserRound className="h-6 w-6" />, label: "Active Riders", value: data?.metrics.active_riders ?? 0 },
            { icon: <Clock3 className="h-6 w-6" />, label: "Average ETA", value: `${data?.metrics.average_eta_minutes ?? 0}m` },
            { icon: <CheckCircle2 className="h-6 w-6" />, label: "Success Rate", value: `${(data?.metrics.success_rate ?? 0).toFixed(1)}%` },
            { icon: <Truck className="h-6 w-6" />, label: "In Transit", value: data?.metrics.in_transit ?? 0 },
            { icon: <XCircle className="h-6 w-6" />, label: "Failed Deliveries", value: data?.metrics.failed_deliveries ?? 0 },
          ].map((card) => (
            <div key={card.label} className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#b1f2be] p-3 text-[#00210d]">{card.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#404941]">{card.label}</p>
                  <p className="mt-2 font-['Space_Grotesk'] text-4xl font-bold tracking-[-0.03em]">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Delivery Status Breakdown</h4>
              <p className="mt-2 text-sm text-[#404941]">
                Current distribution of queued, active, delivered, and failed shipments.
              </p>
            </div>
            <div className="space-y-4">
              {(data?.status_breakdown.length ? data.status_breakdown : []).map((item) => (
                <div key={item.status} className="rounded-2xl border border-[#c0c9be] bg-[#fcf9f8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(item.status)}`}>{item.status}</span>
                    <span className="font-['Space_Grotesk'] text-2xl font-bold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdminDataTable
            title="Top Hubs"
            description="Most active delivery hubs based on recorded shipments."
            rows={topHubs}
            searchPlaceholder="Search hubs..."
            emptyMessage="No hub delivery records found yet."
            pageSize={5}
            columns={[
              { id: "hub", header: "Hub", accessor: (row) => row.hub },
              { id: "deliveries", header: "Deliveries", accessor: (row) => row.deliveries_count },
              { id: "load", header: "Load", accessor: (row) => row.progress, render: (row) => `${row.progress}%` },
            ]}
          />
        </div>

        <AdminDataTable
          title="Recent Deliveries"
          description="Latest shipment movement with rider, customer, vendor, and ETA details."
          rows={recentDeliveries}
          searchPlaceholder="Search deliveries, riders, hubs..."
          emptyMessage="No recent deliveries found in this admin scope."
          pageSize={8}
          columns={[
            {
              id: "delivery",
              header: "Delivery",
              accessor: (row) => row.tracking_code ?? row.order.order_number ?? `Delivery ${row.id}`,
              render: (row) => (
                <div>
                  <p className="font-semibold text-[#1b1c1c]">{row.tracking_code ?? row.order.order_number ?? `Delivery ${row.id}`}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.hub}</p>
                </div>
              ),
            },
            {
              id: "vendor_customer",
              header: "Vendor / Customer",
              accessor: (row) => `${row.order.shop_name} ${row.order.customer_name}`,
              render: (row) => (
                <div>
                  <p>{row.order.shop_name}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.order.customer_name}</p>
                </div>
              ),
            },
            { id: "rider", header: "Rider", accessor: (row) => row.agent.name },
            {
              id: "status",
              header: "Status",
              accessor: (row) => row.status,
              render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>{row.status}</span>,
            },
            {
              id: "eta",
              header: "ETA",
              accessor: (row) => row.eta_minutes ?? 0,
              render: (row) => (row.eta_minutes ? `${row.eta_minutes}m` : "No ETA"),
            },
            {
              id: "updated",
              header: "Updated",
              accessor: (row) => row.updated_at ?? "",
              render: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleString("en-NG") : "Recently"),
            },
          ]}
        />
      </div>
    </AdminConsoleShell>
  );
}
