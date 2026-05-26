/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Gavel,
  MoreHorizontal,
  Store,
  UserRoundPlus,
  Wallet,
} from "lucide-react";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { getApiErrorMessage } from "@/services/auth";
import { fetchAdminOverview, type AdminOverviewData } from "@/services/admin-overview";

function nairaCompact(value?: number | null) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchAdminOverview()
      .then((data) => {
        if (active) {
          setOverview(data);
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load admin overview right now."));
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

  const salesSeries = overview?.sales_performance.series ?? [];
  const maxSalesPoint = useMemo(
    () => Math.max(...salesSeries.map((item) => item.amount), 1),
    [salesSeries]
  );
  const approvalQueue = overview?.approval_queue ?? [];
  const topHubs = overview?.delivery_performance.top_hubs ?? [];
  const disputes = overview?.dispute_center.items ?? [];

  return (
    <AdminConsoleShell
      pendingApprovalsCount={overview?.metrics.pending_vendor_approvals ?? 0}
      disputeCount={overview?.dispute_center.high_priority_count ?? 0}
      tenantLabel={overview?.tenant?.name ?? "Lagos Hub (Main)"}
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">
            Community Overview
          </h3>
          <p className="text-[1.05rem] text-[#404941]">
            Real-time performance monitoring across all Lagos sectors.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-sm text-[#93000a]">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: <Store className="h-6 w-6" />,
              badge: "+12%",
              label: "Active Vendors",
              value: `${overview?.metrics.active_vendors ?? 0}`,
              iconBg: "bg-[#b1f2be] text-[#00210d]",
              badgeBg: "bg-[#b1f2be] text-[#12512c]",
            },
            {
              icon: <Wallet className="h-6 w-6" />,
              badge: "+8.4%",
              label: "Monthly Revenue",
              value: nairaCompact(overview?.metrics.monthly_gmv),
              iconBg: "bg-[#ffddb3] text-[#291800]",
              badgeBg: "bg-[#b1f2be] text-[#12512c]",
            },
            {
              icon: <UserRoundPlus className="h-6 w-6" />,
              badge: "+42",
              label: "New Tenants",
              value: `${overview?.metrics.users ?? 0}`,
              iconBg: "bg-[#e5e2db] text-[#474742]",
              badgeBg: "bg-[#b1f2be] text-[#12512c]",
            },
            {
              icon: <AlertTriangle className="h-6 w-6" />,
              badge: "-5%",
              label: "Open Disputes",
              value: `${overview?.metrics.open_disputes ?? 0}`,
              iconBg: "bg-[#ffdad6] text-[#93000a]",
              badgeBg: "bg-[#ffdad6] text-[#ba1a1a]",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className={`rounded-2xl p-3 ${card.iconBg}`}>{card.icon}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${card.badgeBg}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#404941]">{card.label}</p>
                <p className="mt-2 font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Sales Performance (NGN)</h4>
              <div className="flex gap-2 text-sm">
                <button className="rounded-xl border border-[#c0c9be] bg-[#f0eded] px-4 py-2 font-bold">
                  Daily
                </button>
                <button className="rounded-xl bg-[#003b1b] px-4 py-2 font-bold text-white">
                  Weekly
                </button>
                <button className="rounded-xl border border-[#c0c9be] bg-[#f0eded] px-4 py-2 font-bold">
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-[420px] w-full">
              <svg className="h-full w-full" viewBox="0 0 800 360" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="adminSalesFill" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#14532d" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {salesSeries.length ? (
                  <>
                    <path
                      d={`${salesSeries
                        .map((item, index) => {
                          const x = 30 + index * 123;
                          const y = 320 - (item.amount / maxSalesPoint) * 230;
                          return `${index === 0 ? "M" : "L"}${x} ${y}`;
                        })
                        .join(" ")} L770 320 L30 320 Z`}
                      fill="url(#adminSalesFill)"
                    />
                    <path
                      d={salesSeries
                        .map((item, index) => {
                          const x = 30 + index * 123;
                          const y = 320 - (item.amount / maxSalesPoint) * 230;
                          return `${index === 0 ? "M" : "L"}${x} ${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#003b1b"
                      strokeWidth="3.5"
                    />
                  </>
                ) : null}
                <line x1="210" x2="210" y1="120" y2="300" stroke="#c0c9be" strokeDasharray="4 6" />
                <line x1="390" x2="390" y1="100" y2="300" stroke="#c0c9be" strokeDasharray="4 6" />
                <line x1="570" x2="570" y1="80" y2="300" stroke="#c0c9be" strokeDasharray="4 6" />
              </svg>
              <div className="mt-4 grid grid-cols-7 px-4 text-center text-sm font-bold text-[#1b1c1c]">
                {(salesSeries.length
                  ? salesSeries.map((item) => item.day)
                  : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                ).map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Approval Queue</h4>
              <Link className="text-sm font-bold text-[#003b1b] underline" href="/dashboard/admin/vendor-approvals">
                View All
              </Link>
            </div>
            <div className="space-y-5">
              {(approvalQueue.length
                ? approvalQueue
                : [
                    {
                      id: 0,
                      initials: "NG",
                      name: "No queue items yet",
                      category: "Approvals",
                      location: "Redemption City",
                      status: "idle",
                    },
                  ]
              ).map((item) => (
                <div
                  key={item.id || item.name}
                  className="flex items-center gap-4 rounded-xl border border-transparent p-3 transition hover:border-[#c0c9be] hover:bg-[#f0eded]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eded] text-lg font-bold text-[#14532d]">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[1.05rem] font-bold">{item.name}</p>
                    <p className="text-sm text-[#404941]">
                      {item.category} • {item.location}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b1f2be] text-[#12512c]">
                    <Store className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-[#c0c9be] pt-6">
              <div className="rounded-2xl bg-[#f0eded] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase text-[#404941]">Weekly Target</p>
                  <p className="text-xs font-bold text-[#003b1b]">{loading ? "..." : "85%"}</p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#c0c9be]">
                  <div className="h-full w-[85%] bg-[#003b1b]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Delivery Performance</h4>
              <div className="flex items-center gap-1 text-sm font-bold text-[#003b1b]">
                <span>{(overview?.delivery_performance.success_rate ?? 98.2).toFixed(1)}% Success</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#c0c9be] bg-[#f6f3f2] p-4">
                <p className="text-xs font-medium text-[#404941]">Active Riders</p>
                <p className="mt-2 font-['Space_Grotesk'] text-5xl font-bold">
                  {overview?.delivery_performance.active_riders ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-[#c0c9be] bg-[#f6f3f2] p-4">
                <p className="text-xs font-medium text-[#404941]">Avg. Delivery Time</p>
                <p className="mt-2 font-['Space_Grotesk'] text-5xl font-bold">
                  {overview?.delivery_performance.average_delivery_minutes ?? 28}m
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#404941]">Top Hubs</p>
              {(topHubs.length ? topHubs : [{ hub: "General Hub", deliveries_count: 0, progress: 10 }]).map((hub) => (
                <div key={hub.hub} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{hub.hub}</span>
                    <span className="font-bold">
                      {hub.deliveries_count.toLocaleString("en-NG")} Deliveries
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#c0c9be]">
                    <div className="h-full bg-[#003b1b]" style={{ width: `${hub.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">Dispute Center</h4>
                <span className="rounded-full bg-[#654100] px-3 py-1 text-[10px] font-black text-[#ffddb3]">
                  HIGH PRIORITY
                </span>
              </div>
              <MoreHorizontal className="h-5 w-5 text-[#404941]" />
            </div>

            <div className="space-y-4">
              {(disputes.length
                ? disputes
                : [
                    {
                      id: 0,
                      reference: "No active disputes",
                      summary: "Your current admin environment has no recent dispute cases.",
                      status: "closed",
                      escalation: "in_review" as const,
                    },
                  ]
              ).map((item, index) => (
                <div
                  key={item.id || item.reference}
                  className={`flex flex-col gap-3 rounded-2xl p-4 ${
                    item.escalation === "urgent"
                      ? "border border-[#ba1a1a]/20 bg-[#fff6f5]"
                      : "border border-[#c0c9be] bg-[#f6f3f2]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[1.1rem] font-bold">{item.reference}</p>
                      <p className="text-sm text-[#404941]">{item.summary}</p>
                    </div>
                    <span
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        item.escalation === "urgent"
                          ? "bg-[#ba1a1a] text-white"
                          : "bg-[#e5e2db] text-[#474742]"
                      }`}
                    >
                      {item.escalation === "urgent" ? "URGENT" : "IN REVIEW"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {index === 0 ? (
                      <>
                        <button className="flex-1 rounded-xl bg-[#003b1b] py-3 text-sm font-bold text-white">
                          Resolve (Buyer)
                        </button>
                        <button className="flex-1 rounded-xl border border-[#717970] py-3 text-sm font-bold text-[#1b1c1c]">
                          Mediate
                        </button>
                      </>
                    ) : (
                      <button className="rounded-xl border border-[#717970] py-3 text-sm font-bold text-[#1b1c1c]">
                        View Evidence
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full rounded-2xl border border-[#c0c9be] bg-[#f0eded] py-3 text-sm font-bold text-[#404941] transition hover:bg-[#eae7e7]">
              View All Escrow Cases
            </button>
          </div>
        </div>
      </div>
    </AdminConsoleShell>
  );
}
