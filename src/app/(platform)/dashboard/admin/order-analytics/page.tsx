"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Clock3, PackageCheck, Truck, Wallet } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { getApiErrorMessage } from "@/services/auth";
import { fetchAdminOrderAnalytics, type AdminOrderAnalyticsData } from "@/services/admin-order-analytics";

function naira(value?: number | null) {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function statusClassName(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "delivered") return "bg-emerald-100 text-emerald-950";
  if (normalized === "processing" || normalized === "shipped") return "bg-amber-100 text-amber-950";
  if (normalized === "cancelled") return "bg-rose-100 text-rose-950";
  return "bg-slate-100 text-slate-800";
}

export default function AdminOrderAnalyticsPage() {
  const [data, setData] = useState<AdminOrderAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAdminOrderAnalytics()
      .then((response) => {
        if (active) setData(response);
      })
      .catch((error) => {
        if (active) setErrorMessage(getApiErrorMessage(error, "Unable to load order analytics right now."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const weeklySeries = data?.weekly_series ?? [];
  const maxRevenue = useMemo(() => Math.max(...weeklySeries.map((item) => item.revenue), 1), [weeklySeries]);
  const topVendors = useMemo(() => data?.top_vendors ?? [], [data]);
  const recentOrders = useMemo(() => data?.recent_orders ?? [], [data]);

  return (
    <AdminConsoleShell tenantLabel={data?.tenant?.name ?? "Lagos Hub (Main)"}>
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">Order Analytics</h3>
          <p className="text-[1.05rem] text-[#404941]">
            Track order throughput, revenue movement, status distribution, and top marketplace vendors.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-sm text-[#93000a]">{errorMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: <BarChart3 className="h-6 w-6" />, label: "Total Orders", value: data?.metrics.total_orders ?? 0 },
            { icon: <Wallet className="h-6 w-6" />, label: "Gross Revenue", value: naira(data?.metrics.gross_revenue) },
            { icon: <Clock3 className="h-6 w-6" />, label: "Average Order Value", value: naira(data?.metrics.average_order_value) },
            { icon: <Truck className="h-6 w-6" />, label: "Delivery Revenue", value: naira(data?.metrics.delivery_revenue) },
            { icon: <Clock3 className="h-6 w-6" />, label: "Processing Orders", value: data?.metrics.processing_orders ?? 0 },
            { icon: <PackageCheck className="h-6 w-6" />, label: "Delivered Orders", value: data?.metrics.delivered_orders ?? 0 },
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

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Weekly Revenue Trend</h4>
              <p className="mt-2 text-sm text-[#404941]">Revenue movement across the current week in the active tenant scope.</p>
            </div>
            {loading ? (
              <div className="h-[360px] animate-pulse rounded-2xl bg-[#f0eded]" />
            ) : (
              <div className="h-[360px]">
                <svg className="h-full w-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="orderRevenueFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#14532d" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {weeklySeries.length ? (
                    <>
                      <path
                        d={`${weeklySeries.map((item, index) => {
                          const x = 40 + index * 116;
                          const y = 270 - (item.revenue / maxRevenue) * 200;
                          return `${index === 0 ? "M" : "L"}${x} ${y}`;
                        }).join(" ")} L740 270 L40 270 Z`}
                        fill="url(#orderRevenueFill)"
                      />
                      <path
                        d={weeklySeries.map((item, index) => {
                          const x = 40 + index * 116;
                          const y = 270 - (item.revenue / maxRevenue) * 200;
                          return `${index === 0 ? "M" : "L"}${x} ${y}`;
                        }).join(" ")}
                        fill="none"
                        stroke="#003b1b"
                        strokeWidth="3.5"
                      />
                    </>
                  ) : null}
                </svg>
                <div className="mt-4 grid grid-cols-7 px-4 text-center text-sm font-bold text-[#1b1c1c]">
                  {(weeklySeries.length ? weeklySeries.map((item) => item.day) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Status Breakdown</h4>
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
              title="Top Vendors"
              rows={topVendors}
              searchPlaceholder="Search vendors..."
              emptyMessage="No vendor order records found yet."
              pageSize={5}
              columns={[
                { id: "shop_name", header: "Vendor", accessor: (row) => row.shop_name },
                { id: "orders_count", header: "Orders", accessor: (row) => row.orders_count },
                { id: "revenue_total", header: "Revenue", accessor: (row) => row.revenue_total, render: (row) => naira(row.revenue_total) },
              ]}
            />
          </div>
        </div>

        <AdminDataTable
          title="Recent Orders"
          description="Latest marketplace orders with customer, vendor, amount, and fulfillment context."
          rows={recentOrders}
          searchPlaceholder="Search orders, vendors, customers..."
          emptyMessage="No recent orders found in this admin scope."
          pageSize={8}
          columns={[
            {
              id: "order_number",
              header: "Order",
              accessor: (row) => row.order_number,
              render: (row) => (
                <div>
                  <p className="font-semibold text-[#1b1c1c]">{row.order_number}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.fulfillment_mode}</p>
                </div>
              ),
            },
            {
              id: "vendor_customer",
              header: "Vendor / Customer",
              accessor: (row) => `${row.shop.name} ${row.customer.name}`,
              render: (row) => (
                <div>
                  <p>{row.shop.name}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.customer.name}</p>
                </div>
              ),
            },
            {
              id: "status",
              header: "Status",
              accessor: (row) => row.status,
              render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>{row.status}</span>,
            },
            {
              id: "amount",
              header: "Amount",
              accessor: (row) => row.grand_total,
              render: (row) => (
                <div>
                  <p className="font-semibold">{naira(row.grand_total)}</p>
                  <p className="mt-1 text-xs text-[#404941]">Delivery fee {naira(row.delivery_fee)}</p>
                </div>
              ),
            },
            {
              id: "created_at",
              header: "Created",
              accessor: (row) => row.created_at ?? "",
              render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString("en-NG") : "Recently"),
            },
          ]}
        />

        <div className="flex justify-end">
          <Link href="/dashboard/admin/vendor-approvals" className="text-sm font-bold text-[#003b1b] underline">
            Manage Vendor Queue
          </Link>
        </div>
      </div>
    </AdminConsoleShell>
  );
}
