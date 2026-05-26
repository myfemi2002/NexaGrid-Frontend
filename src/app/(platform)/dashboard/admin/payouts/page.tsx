"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { getApiErrorMessage } from "@/services/auth";
import {
  fetchAdminVendorPayouts,
  reviewAdminVendorPayout,
  type AdminVendorPayoutsData,
} from "@/services/admin-vendor-payouts";

function naira(value?: number | null) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClassName(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "pending") {
    return "bg-amber-100 text-amber-950";
  }

  if (normalized === "approved") {
    return "bg-emerald-100 text-emerald-950";
  }

  return "bg-rose-100 text-rose-950";
}

export default function AdminVendorPayoutsPage() {
  const [data, setData] = useState<AdminVendorPayoutsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const loadData = async (page = 1) => {
    const response = await fetchAdminVendorPayouts(page);
    setData(response);
  };

  useEffect(() => {
    let active = true;

    loadData()
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load vendor payouts right now."));
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

  const handleReview = async (id: number, decision: "approved" | "rejected") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setReviewingId(id);

    try {
      await reviewAdminVendorPayout(id, { decision });
      await loadData(data?.pagination.current_page ?? 1);
      setSuccessMessage(`Payout request ${decision}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to review this payout request right now."));
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <AdminConsoleShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald">Finance Ops</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Vendor Payout Reviews</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review vendor payout requests and release or reject held wallet balances safely.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-emerald-950"
          >
            Back to Admin
          </Link>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="mt-3 font-heading text-3xl font-semibold">{data?.metrics.pending_count ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="mt-3 font-heading text-3xl font-semibold">{naira(data?.metrics.pending_amount)}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="mt-3 font-heading text-3xl font-semibold">{data?.metrics.approved_count ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="mt-3 font-heading text-3xl font-semibold">{data?.metrics.rejected_count ?? 0}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-heading text-2xl font-semibold">Review Queue</h2>
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : data?.items.length ? (
            <div className="divide-y divide-border">
              {data.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-medium">{item.reference}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.vendor.name} {item.vendor.email ? ` • ${item.vendor.email}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Requested: {item.requested_at ? new Date(item.requested_at).toLocaleString("en-NG") : "Recently"}
                    </p>
                    {item.note ? <p className="mt-3 text-sm">{item.note}</p> : null}
                    {item.review_note ? <p className="mt-2 text-sm text-muted-foreground">Review note: {item.review_note}</p> : null}
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <p className="font-heading text-3xl font-semibold">{naira(item.amount)}</p>
                    {item.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleReview(item.id, "approved")}
                          disabled={reviewingId === item.id}
                          className="rounded-full bg-emerald px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleReview(item.id, "rejected")}
                          disabled={reviewingId === item.id}
                          className="rounded-full border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {item.reviewed_at ? `Reviewed ${new Date(item.reviewed_at).toLocaleString("en-NG")}` : "Reviewed"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-muted-foreground">
              No vendor payout requests in the queue yet.
            </div>
          )}
        </div>
      </div>
    </AdminConsoleShell>
  );
}
