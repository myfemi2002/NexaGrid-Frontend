"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { getApiErrorMessage } from "@/services/auth";
import {
  fetchAdminVendorApprovals,
  reviewAdminVendorApproval,
  type AdminVendorApprovalsData,
} from "@/services/admin-vendor-approvals";

function statusClassName(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return "bg-emerald-100 text-emerald-950";
  }
  if (normalized === "rejected") {
    return "bg-rose-100 text-rose-950";
  }
  return "bg-amber-100 text-amber-950";
}

export default function AdminVendorApprovalsPage() {
  const [data, setData] = useState<AdminVendorApprovalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const loadData = async (page = 1) => {
    const response = await fetchAdminVendorApprovals(page);
    setData(response);
  };

  useEffect(() => {
    let active = true;
    loadData()
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load vendor approvals right now."));
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

  const handleReview = async (shopId: number, decision: "approved" | "rejected") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setReviewingId(shopId);

    try {
      await reviewAdminVendorApproval(shopId, { decision });
      await loadData(data?.pagination.current_page ?? 1);
      setSuccessMessage(`Vendor ${decision}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to review this vendor right now."));
    } finally {
      setReviewingId(null);
    }
  };

  const rows = useMemo(() => data?.items ?? [], [data]);

  return (
    <AdminConsoleShell pendingApprovalsCount={data?.metrics.pending_count ?? 0}>
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">Vendor Approvals</h3>
          <p className="text-[1.05rem] text-[#404941]">
            Review merchant onboarding requests and approve verified shops into the marketplace.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-sm text-[#93000a]">{errorMessage}</div>
        ) : null}
        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">{successMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: "Pending", value: data?.metrics.pending_count ?? 0 },
            { label: "Approved", value: data?.metrics.approved_count ?? 0 },
            { label: "Rejected", value: data?.metrics.rejected_count ?? 0 },
          ].map((card) => (
            <div key={card.label} className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#404941]">{card.label}</p>
              <p className="mt-3 font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">{card.value}</p>
            </div>
          ))}
        </div>

        <AdminDataTable
          title="Approval Queue"
          description="Pending vendors awaiting review from the tenant admin console."
          rows={rows}
          searchPlaceholder="Search vendors, categories, emails..."
          emptyMessage="No vendor approval requests are waiting right now."
          pageSize={8}
          columns={[
            {
              id: "vendor",
              header: "Vendor",
              accessor: (row) => row.name,
              render: (row) => (
                <div>
                  <p className="font-semibold text-[#1b1c1c]">{row.name}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.owner.name}{row.owner.email ? ` | ${row.owner.email}` : ""}</p>
                </div>
              ),
            },
            {
              id: "category",
              header: "Category",
              accessor: (row) => `${row.category} ${row.location}`,
              render: (row) => (
                <div>
                  <p>{row.category}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.location}</p>
                </div>
              ),
            },
            {
              id: "status",
              header: "Status",
              accessor: (row) => `${row.status} ${row.owner.kyc_status ?? "pending"}`,
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>{row.status}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
                    KYC {row.owner.kyc_status ?? "pending"}
                  </span>
                </div>
              ),
            },
            {
              id: "reviewed",
              header: "Reviewed",
              accessor: (row) => row.reviewed_at ?? "",
              render: (row) => (row.reviewed_at ? new Date(row.reviewed_at).toLocaleString("en-NG") : "Awaiting review"),
            },
            {
              id: "actions",
              header: "Actions",
              searchable: false,
              sortable: false,
              render: (row) => (
                <div className="flex flex-wrap items-center gap-2">
                  {row.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void handleReview(row.id, "approved")}
                        disabled={reviewingId === row.id}
                        className="flex items-center gap-2 rounded-full bg-[#003b1b] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleReview(row.id, "rejected")}
                        disabled={reviewingId === row.id}
                        className="flex items-center gap-2 rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-700 disabled:opacity-60"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-[#404941]">Completed</span>
                  )}
                </div>
              ),
            },
          ]}
        />

        <div className="flex justify-end">
          <Link href="/dashboard/admin" className="rounded-full border border-[#c0c9be] px-4 py-2 text-sm font-medium text-[#003b1b]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AdminConsoleShell>
  );
}
