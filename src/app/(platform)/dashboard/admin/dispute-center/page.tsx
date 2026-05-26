"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye, ShieldAlert, TimerReset } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminConsoleShell } from "@/components/admin/admin-console-shell";
import { ToastMessage } from "@/components/ui/toast-message";
import { getApiErrorMessage } from "@/services/auth";
import { fetchAdminDisputeCenter, reviewAdminDispute, type AdminDisputeCenterData } from "@/services/admin-dispute-center";

function statusClassName(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "resolved") {
    return "bg-emerald-100 text-emerald-950";
  }
  if (normalized === "in_review") {
    return "bg-amber-100 text-amber-950";
  }
  if (normalized === "open") {
    return "bg-rose-100 text-rose-950";
  }

  return "bg-slate-100 text-slate-800";
}

function priorityClassName(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "urgent") {
    return "bg-[#ba1a1a] text-white";
  }
  if (normalized === "high") {
    return "bg-[#654100] text-white";
  }

  return "bg-slate-100 text-slate-800";
}

export default function AdminDisputeCenterPage() {
  const [data, setData] = useState<AdminDisputeCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const loadData = async () => {
    const response = await fetchAdminDisputeCenter();
    setData(response);
  };

  useEffect(() => {
    let active = true;

    loadData()
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load dispute center right now."));
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

  const rows = useMemo(() => data?.items ?? [], [data]);

  const handleReview = async (disputeId: number, status: "in_review" | "resolved") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setReviewingId(disputeId);

    try {
      await reviewAdminDispute(disputeId, {
        status,
        note: status === "resolved" ? "Resolved by admin after review." : "Escalated to in-review by admin.",
      });
      await loadData();
      setSuccessMessage(status === "resolved" ? "Dispute marked as resolved." : "Dispute moved to in review.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to update this dispute right now."));
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <AdminConsoleShell
      disputeCount={data?.metrics.urgent_disputes ?? 0}
      tenantLabel={data?.tenant?.name ?? "Lagos Hub (Main)"}
    >
      {successMessage ? <ToastMessage message={successMessage} variant="success" onClose={() => setSuccessMessage(null)} /> : null}
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.03em]">Dispute Center</h3>
          <p className="text-[1.05rem] text-[#404941]">
            Monitor escalations, review open issues, and keep buyer-seller trust intact across the tenant.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-sm text-[#93000a]">{errorMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          {[
            { icon: <ShieldAlert className="h-6 w-6" />, label: "Total Disputes", value: data?.metrics.total_disputes ?? 0 },
            { icon: <AlertTriangle className="h-6 w-6" />, label: "Open", value: data?.metrics.open_disputes ?? 0 },
            { icon: <Eye className="h-6 w-6" />, label: "In Review", value: data?.metrics.in_review_disputes ?? 0 },
            { icon: <CheckCircle2 className="h-6 w-6" />, label: "Resolved", value: data?.metrics.resolved_disputes ?? 0 },
            { icon: <TimerReset className="h-6 w-6" />, label: "Urgent", value: data?.metrics.urgent_disputes ?? 0 },
          ].map((card) => (
            <div key={card.label} className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#ffdad6] p-3 text-[#93000a]">{card.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#404941]">{card.label}</p>
                  <p className="mt-2 font-['Space_Grotesk'] text-4xl font-bold tracking-[-0.03em]">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AdminDataTable
          title="Dispute Cases"
          description="Use this queue to review growing issue volume without the page becoming difficult to manage."
          rows={rows}
          searchPlaceholder="Search disputes, users, reference types..."
          emptyMessage={loading ? "Loading dispute cases..." : "No disputes found in this admin scope."}
          pageSize={10}
          columns={[
            {
              id: "reference",
              header: "Case",
              accessor: (row) => `${row.reference} ${row.summary}`,
              render: (row) => (
                <div>
                  <p className="font-semibold text-[#1b1c1c]">{row.reference}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.summary}</p>
                </div>
              ),
            },
            {
              id: "user",
              header: "User",
              accessor: (row) => `${row.user.name} ${row.user.email ?? ""}`,
              render: (row) => (
                <div>
                  <p>{row.user.name}</p>
                  <p className="mt-1 text-xs text-[#404941]">{row.user.email ?? "No email"}</p>
                </div>
              ),
            },
            {
              id: "reference_type",
              header: "Reference",
              accessor: (row) => `${row.reference_type} ${row.reference_id ?? ""}`,
              render: (row) => (
                <div>
                  <p className="capitalize">{row.reference_type.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-xs text-[#404941]">
                    {row.reference_id ? `ID ${row.reference_id}` : "No linked record"}
                  </p>
                </div>
              ),
            },
            {
              id: "status",
              header: "Status",
              accessor: (row) => `${row.status} ${row.priority}`,
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>{row.status}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${priorityClassName(row.priority)}`}>{row.priority}</span>
                </div>
              ),
            },
            {
              id: "evidence",
              header: "Evidence",
              accessor: (row) => row.evidence_count,
              render: (row) => `${row.evidence_count} file${row.evidence_count === 1 ? "" : "s"}`,
            },
            {
              id: "created",
              header: "Opened",
              accessor: (row) => row.created_at ?? "",
              render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString("en-NG") : "Recently"),
            },
            {
              id: "actions",
              header: "Actions",
              searchable: false,
              sortable: false,
              render: (row) => (
                <div className="flex flex-wrap items-center gap-2">
                  {row.status === "open" ? (
                    <button
                      type="button"
                      onClick={() => void handleReview(row.id, "in_review")}
                      disabled={reviewingId === row.id}
                      className="rounded-full bg-[#654100] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Mark In Review
                    </button>
                  ) : null}
                  {row.status !== "resolved" ? (
                    <button
                      type="button"
                      onClick={() => void handleReview(row.id, "resolved")}
                      disabled={reviewingId === row.id}
                      className="rounded-full bg-[#003b1b] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs text-[#404941]">Completed</span>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </AdminConsoleShell>
  );
}
