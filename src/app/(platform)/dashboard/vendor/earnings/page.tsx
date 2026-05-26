"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import { getApiErrorMessage } from "@/services/auth";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import {
  fetchVendorDashboard,
  fetchVendorEarnings,
  type VendorDashboardData,
  type VendorEarningsData,
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

function formatStatus(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function EarningsSkeleton() {
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
        </aside>
        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <div className="h-12 w-72 animate-pulse rounded bg-[#e4e2e1]" />
            <div className="mt-3 h-5 w-96 animate-pulse rounded bg-[#e4e2e1]" />
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl bg-[#e4e2e1]" />
              ))}
            </div>
            <div className="mt-8 h-[520px] animate-pulse rounded-[1.8rem] bg-[#e4e2e1]" />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function VendorEarningsPage() {
  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [earnings, setEarnings] = useState<VendorEarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([fetchVendorDashboard(), fetchVendorEarnings()])
      .then(([dashboardData, earningsData]) => {
        if (!active) {
          return;
        }

        setDashboard(dashboardData);
        setEarnings(earningsData);
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load vendor earnings right now."));
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
  const businessName = vendor?.business_name?.trim() || vendor?.shop_name?.trim() || "Vendor";
  const vendorInitials = useMemo(() => initials(businessName), [businessName]);

  if (loading) {
    return <EarningsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <VendorSidebar
          active="earnings"
          avatarText={vendorInitials}
          avatarUrl={vendor?.logo_url}
          businessName={businessName}
          verified={Boolean(vendor?.verified)}
        />

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <header className="mb-8">
              <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
                Earnings & Payouts
              </h1>
              <p className="mt-2 max-w-3xl text-[1.05rem] text-[#404941]">
                Review your wallet balances, track payout requests, and monitor revenue activity from your vendor storefront.
              </p>
            </header>

            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-[#f3c8c3] bg-[#fff1ef] px-5 py-4 text-sm text-[#ba1a1a]">
                {errorMessage}
              </div>
            ) : null}

            <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-[#c0c9be]/50 bg-[#f6f3f2] p-6">
                <div className="mb-3 text-[#003b1b]"><Wallet className="h-7 w-7" /></div>
                <p className="text-sm font-medium text-[#404941]">Available Balance</p>
                <p className="mt-2 font-['Space_Grotesk'] text-[2rem] font-bold text-[#1b1c1c]">
                  {naira(earnings?.wallet.available_balance)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#c0c9be]/50 bg-[#f6f3f2] p-6">
                <div className="mb-3 text-[#472c00]"><CircleDollarSign className="h-7 w-7" /></div>
                <p className="text-sm font-medium text-[#404941]">Held for Payout</p>
                <p className="mt-2 font-['Space_Grotesk'] text-[2rem] font-bold text-[#1b1c1c]">
                  {naira(earnings?.wallet.held_balance)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#c0c9be]/50 bg-[#f6f3f2] p-6">
                <div className="mb-3 text-[#003b1b]"><TrendingUp className="h-7 w-7" /></div>
                <p className="text-sm font-medium text-[#404941]">Monthly Revenue</p>
                <p className="mt-2 font-['Space_Grotesk'] text-[2rem] font-bold text-[#1b1c1c]">
                  {naira(earnings?.metrics.monthly_revenue)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#c0c9be]/50 bg-[#f6f3f2] p-6">
                <div className="mb-3 text-[#003b1b]"><ShoppingBag className="h-7 w-7" /></div>
                <p className="text-sm font-medium text-[#404941]">Total Orders</p>
                <p className="mt-2 font-['Space_Grotesk'] text-[2rem] font-bold text-[#1b1c1c]">
                  {earnings?.metrics.orders_count ?? 0}
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.55fr)_420px]">
              <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                      Recent Transactions
                    </h2>
                    <p className="mt-2 text-sm text-[#65645f]">Combined revenue and payout activity for your store.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {earnings?.transactions.length ? (
                    earnings.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#e4e2e1] bg-[#fcf9f8] p-4">
                        <div>
                          <p className="font-medium text-[#1b1c1c]">{transaction.title}</p>
                          <p className="mt-1 text-sm text-[#65645f]">
                            {transaction.category} • {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString("en-NG") : "Just now"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-['Space_Grotesk'] text-2xl font-semibold ${transaction.direction === "credit" ? "text-[#003b1b]" : "text-[#633f00]"}`}>
                            {transaction.direction === "credit" ? "+" : "-"}{naira(transaction.amount)}
                          </p>
                          <p className="text-xs uppercase tracking-[0.14em] text-[#65645f]">{formatStatus(transaction.status)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#c0c9be] bg-[#fcf9f8] px-6 py-10 text-center text-[#65645f]">
                      No earnings activity yet. Revenue and payout entries will appear here as orders and payouts come in.
                    </div>
                  )}
                </div>
              </section>

              <aside className="space-y-8">
                <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                  <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                    Payout Requests
                  </h2>
                  <p className="mt-2 text-sm text-[#65645f]">
                    {earnings?.metrics.pending_payouts ?? 0} pending payout request(s)
                  </p>

                  <div className="mt-5 space-y-3">
                    {earnings?.payouts.length ? (
                      earnings.payouts.map((payout) => (
                        <div key={payout.id} className="rounded-2xl bg-[#f6f3f2] p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-[#1b1c1c]">{payout.reference}</p>
                              <p className="mt-1 text-sm text-[#65645f]">
                                {payout.created_at ? new Date(payout.created_at).toLocaleString("en-NG") : "Recently"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-['Space_Grotesk'] text-xl font-bold text-[#1b1c1c]">{naira(payout.amount)}</p>
                              <p className="text-xs uppercase tracking-[0.14em] text-[#65645f]">{formatStatus(payout.status)}</p>
                            </div>
                          </div>
                          {payout.note ? (
                            <p className="mt-3 text-sm leading-6 text-[#404941]">{payout.note}</p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#c0c9be] bg-[#fcf9f8] px-5 py-8 text-center text-sm text-[#65645f]">
                        No payout requests submitted yet.
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-[1.8rem] border border-[#fdba57]/70 bg-[#ffddb3]/20 p-6">
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1b1c1c]">Revenue Snapshot</h3>
                  <p className="mt-4 text-sm leading-7 text-[#472c00]">
                    Gross lifetime revenue: <span className="font-semibold">{naira(earnings?.metrics.gross_revenue)}</span>
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#472c00]">
                    Current month revenue: <span className="font-semibold">{naira(earnings?.metrics.monthly_revenue)}</span>
                  </p>
                </section>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
