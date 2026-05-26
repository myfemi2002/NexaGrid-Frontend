"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Truck } from "lucide-react";
import { getApiErrorMessage } from "@/services/auth";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import {
  fetchVendorDashboard,
  fetchVendorOrders,
  type VendorDashboardData,
  type VendorOrder,
  type VendorOrdersData,
  updateVendorOrderStatus,
} from "@/services/vendor-dashboard";

function naira(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function initials(value?: string | null) {
  const base = (value ?? "Vendor")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return base || "NV";
}

function formatOrderStatus(status: string) {
  return status
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusClassName(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "processing" || normalized === "pending") {
    return "bg-[#b1f2be] text-[#12512c]";
  }

  if (normalized === "shipped") {
    return "bg-[#ffddb3] text-[#633f00]";
  }

  if (normalized === "delivered") {
    return "bg-[#e4e2e1] text-[#404941]";
  }

  return "bg-[#ffdad6] text-[#93000a]";
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-[#c0c9be]/50 bg-[#f6f3f2] p-6 shadow-[0_10px_30px_-18px_rgba(20,83,45,0.18)]">
      <p className="mb-2 text-sm font-medium text-[#404941]">{label}</p>
      <p className={`font-['Space_Grotesk'] text-[2rem] font-bold tracking-[-0.02em] ${accent ?? "text-[#1b1c1c]"}`}>
        {value}
      </p>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-72 flex-col border-r border-[#c0c9be] bg-[#fcf9f8] px-4 py-3 md:fixed md:left-0 md:top-0 md:flex">
          <div className="px-4 pb-10 pt-3">
            <div className="h-12 w-48 animate-pulse rounded bg-[#e4e2e1]" />
            <div className="mt-10 flex items-center gap-4">
              <div className="h-14 w-14 animate-pulse rounded-full bg-[#e4e2e1]" />
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-[#e4e2e1]" />
                <div className="h-6 w-40 animate-pulse rounded bg-[#e4e2e1]" />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-3 px-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-2xl bg-[#e4e2e1]" />
            ))}
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <div className="space-y-3">
              <div className="h-12 w-80 animate-pulse rounded bg-[#e4e2e1]" />
              <div className="h-5 w-96 animate-pulse rounded bg-[#e4e2e1]" />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl bg-[#e4e2e1]" />
              ))}
            </div>
            <div className="mt-8 h-[540px] animate-pulse rounded-[1.8rem] bg-[#e4e2e1]" />
          </main>
        </div>
      </div>
    </div>
  );
}

function nextStatus(order: VendorOrder) {
  const normalized = order.status.toLowerCase();

  if (normalized === "pending") {
    return { status: "processing" as const, label: "Start Processing" };
  }

  if (normalized === "processing") {
    return { status: "shipped" as const, label: "Mark Shipped" };
  }

  if (normalized === "shipped") {
    return { status: "delivered" as const, label: "Mark Delivered" };
  }

  return null;
}

export default function VendorOrdersPage() {
  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [ordersData, setOrdersData] = useState<VendorOrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const loadData = async (page = 1) => {
    const [dashboardData, vendorOrders] = await Promise.all([
      fetchVendorDashboard(),
      fetchVendorOrders(page),
    ]);

    setDashboard(dashboardData);
    setOrdersData(vendorOrders);
  };

  useEffect(() => {
    let active = true;

    loadData()
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load vendor orders right now."));
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

  const vendor = dashboard?.vendor;
  const metrics = ordersData?.metrics;
  const orders = ordersData?.orders ?? [];
  const businessName = vendor?.business_name?.trim() || vendor?.shop_name?.trim() || "Vendor";
  const vendorInitials = useMemo(() => initials(businessName), [businessName]);

  const handleStatusUpdate = async (order: VendorOrder) => {
    const action = nextStatus(order);
    if (!action) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setUpdatingOrderId(order.id);

    try {
      await updateVendorOrderStatus(order.id, action.status);
      await loadData(ordersData?.pagination.current_page ?? 1);
      setSuccessMessage(`Order ${order.order_number} updated to ${formatOrderStatus(action.status)}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to update this order right now."));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <VendorSidebar
          active="orders"
          avatarText={vendorInitials}
          avatarUrl={vendor?.logo_url}
          businessName={businessName}
          verified={Boolean(vendor?.verified)}
        />

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <header className="mb-8">
              <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
                Vendor Orders
              </h1>
              <p className="mt-2 max-w-3xl text-[1.05rem] text-[#404941]">
                Track incoming purchases, update fulfillment status, and keep customers informed from one workspace.
              </p>
              <p className="mt-3 text-sm font-medium text-[#65645f]">{businessName}</p>
            </header>

            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-[#f3c8c3] bg-[#fff1ef] px-5 py-4 text-sm text-[#ba1a1a]">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-6 rounded-2xl border border-[#cfe7d4] bg-[#eff8f1] px-5 py-4 text-sm text-[#14532d]">
                {successMessage}
              </div>
            ) : null}

            <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Total Orders" value={`${metrics?.total_orders ?? 0}`} accent="text-[#003b1b]" />
              <MetricCard label="Pending / Processing" value={`${metrics?.pending_orders ?? 0}`} accent="text-[#12512c]" />
              <MetricCard label="Shipped" value={`${metrics?.shipped_orders ?? 0}`} accent="text-[#633f00]" />
              <MetricCard label="Delivered" value={`${metrics?.delivered_orders ?? 0}`} />
            </section>

            <section className="overflow-hidden rounded-[1.8rem] border border-[#c0c9be] bg-white shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
              <div className="border-b border-[#e4e2e1] px-6 py-5 md:px-8">
                <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                  Recent Order Activity
                </h2>
                <p className="mt-2 text-sm text-[#65645f]">
                  {ordersData?.pagination.total ?? 0} orders across your current store.
                </p>
              </div>

              {orders.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-[#fcf9f8]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#65645f] md:px-8">
                          Order
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#65645f] md:px-8">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#65645f] md:px-8">
                          Items
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#65645f] md:px-8">
                          Total
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#65645f] md:px-8">
                          Status
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#65645f] md:px-8">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e2e1]">
                      {orders.map((order) => {
                        const action = nextStatus(order);
                        const isUpdating = updatingOrderId === order.id;

                        return (
                          <tr key={order.id} className="transition-colors hover:bg-[#fcf9f8]">
                            <td className="px-6 py-5 md:px-8">
                              <div className="font-medium text-[#003b1b]">{order.order_number}</div>
                              <div className="mt-1 text-sm text-[#65645f]">
                                {order.fulfillment_mode ? formatOrderStatus(order.fulfillment_mode) : "Order"}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-[1rem] text-[#1b1c1c] md:px-8">
                              {order.customer_name}
                            </td>
                            <td className="px-6 py-5 text-[1rem] text-[#1b1c1c] md:px-8">
                              {order.item_count}
                            </td>
                            <td className="px-6 py-5 text-[1rem] font-medium text-[#1b1c1c] md:px-8">
                              {naira(order.totals.grand_total)}
                            </td>
                            <td className="px-6 py-5 md:px-8">
                              <span className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${statusClassName(order.status)}`}>
                                {formatOrderStatus(order.status)}
                              </span>
                            </td>
                            <td className="px-6 py-5 md:px-8">
                              {action ? (
                                <button
                                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#003b1b] px-4 text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                                  disabled={isUpdating}
                                  onClick={() => void handleStatusUpdate(order)}
                                  type="button"
                                >
                                  {isUpdating ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Truck className="h-4 w-4" />
                                  )}
                                  {action.label}
                                </button>
                              ) : (
                                <span className="text-sm text-[#65645f]">No action needed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-[#65645f] md:px-8">
                  No vendor orders yet. New customer purchases will appear here as soon as they come in.
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
