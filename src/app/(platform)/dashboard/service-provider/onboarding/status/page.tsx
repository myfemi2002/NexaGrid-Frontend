"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, FileCheck2, PencilLine, ShieldCheck } from "lucide-react";
import { ProviderOnboardingShell } from "@/components/provider-onboarding/onboarding-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProviderOnboardingStatus, type ProviderOnboardingStatus } from "@/services/provider-onboarding-service";

function StatusSkeleton() {
  return (
    <ProviderOnboardingShell currentStep={5} completedSteps={[1, 2, 3, 4, 5]}>
      <div className="rounded-[2.2rem] bg-white px-8 py-10 shadow-[0_24px_45px_rgba(20,83,45,0.08)] md:px-14 md:py-14">
        <div className="space-y-4">
          <Skeleton className="h-10 w-80 bg-[#dfe9fb]" />
          <Skeleton className="h-6 w-full max-w-2xl bg-[#dfe9fb]" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-[1.8rem] bg-[#eef4ff]" />
          ))}
        </div>
      </div>
    </ProviderOnboardingShell>
  );
}

export default function ServiceProviderOnboardingStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ProviderOnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchProviderOnboardingStatus()
      .then((response) => {
        if (active) {
          setStatus(response);
        }
      })
      .catch((error) => {
        if (active) {
          setError(error instanceof Error ? error.message : "We could not load your verification status.");
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

  if (loading) {
    return <StatusSkeleton />;
  }

  if (error || !status) {
    return (
      <ProviderOnboardingShell currentStep={5} completedSteps={[1, 2, 3, 4, 5]}>
        <div className="rounded-[2.2rem] bg-white px-8 py-12 shadow-[0_24px_45px_rgba(20,83,45,0.08)]">
          <p className="text-lg text-red-700">{error ?? "We could not load your verification status."}</p>
        </div>
      </ProviderOnboardingShell>
    );
  }

  return (
    <ProviderOnboardingShell
      currentStep={5}
      completedSteps={[1, 2, 3, 4, 5]}
      tipTitle="Submission Received"
      tipBody="Your documents have been queued for secure review. We will notify you as soon as a decision is made."
      supportTitle="Need an Update?"
      supportBody="Our merchant success team can explain what happens next."
    >
      <section className="rounded-[2.2rem] bg-white px-8 py-10 shadow-[0_24px_45px_rgba(20,83,45,0.08)] md:px-14 md:py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c8efd1] text-[#003b1b]">
            <ShieldCheck className="size-8" />
          </div>
          <div>
            <h2 className="text-[2.6rem] font-bold tracking-[-0.05em] text-[#003b1b]">Pending Verification</h2>
            <p className="mt-2 max-w-3xl text-xl leading-9 text-[#304236]">
              Your service provider onboarding has been submitted successfully. Our review team is checking your identity and supporting documents.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.75rem] bg-[#eef4ff] px-6 py-6">
            <Clock3 className="size-8 text-[#003b1b]" />
            <p className="mt-5 text-sm uppercase tracking-[0.16em] text-[#567061]">Expected Review</p>
            <h3 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] text-[#0b1c30]">{status.expected_review_time}</h3>
          </div>
          <div className="rounded-[1.75rem] bg-[#eef4ff] px-6 py-6">
            <FileCheck2 className="size-8 text-[#003b1b]" />
            <p className="mt-5 text-sm uppercase tracking-[0.16em] text-[#567061]">Documents Submitted</p>
            <h3 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] text-[#0b1c30]">{status.documents.length + (status.identity?.has_document ? 1 : 0)}</h3>
          </div>
          <div className="rounded-[1.75rem] bg-[#eef4ff] px-6 py-6">
            <ShieldCheck className="size-8 text-[#003b1b]" />
            <p className="mt-5 text-sm uppercase tracking-[0.16em] text-[#567061]">Current Status</p>
            <h3 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] capitalize text-[#0b1c30]">{status.verification_status}</h3>
          </div>
        </div>

        <div className="mt-10 rounded-[1.9rem] border border-[#d7e3d7] bg-[#fbfdfb] px-7 py-8">
          <h3 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#003b1b]">Submitted Documents</h3>
          <div className="mt-6 space-y-4">
            {status.identity?.has_document ? (
              <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                <div>
                  <p className="text-lg font-medium text-[#0b1c30]">Identity Document</p>
                  <p className="text-base text-[#56695c]">{status.identity.document_name ?? "Uploaded document"}</p>
                </div>
                <span className="rounded-full bg-[#fff3dd] px-4 py-2 text-sm font-semibold capitalize text-[#8a5b00]">
                  {status.identity.status}
                </span>
              </div>
            ) : null}

            {status.documents.length ? (
              status.documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                  <div>
                    <p className="text-lg font-medium text-[#0b1c30]">
                      {document.document_type === "business_document" ? "Business Document" : "Proof of Address"}
                    </p>
                    <p className="text-base text-[#56695c]">{document.original_name}</p>
                  </div>
                  <span className="rounded-full bg-[#fff3dd] px-4 py-2 text-sm font-semibold capitalize text-[#8a5b00]">
                    {document.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-base text-[#56695c]">No additional business documents uploaded yet.</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <Link href="/dashboard/service-provider" className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#003b1b] px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(0,59,27,0.18)] transition hover:bg-[#064b2b]">
            Go to Dashboard
          </Link>
          <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#003b1b] px-8 text-lg font-semibold text-[#003b1b] transition hover:bg-[#f3f8f4]" onClick={() => router.push("/dashboard/service-provider/onboarding?edit=1")} type="button">
            <PencilLine className="size-5" />
            Edit Submission
          </button>
        </div>
      </section>
    </ProviderOnboardingShell>
  );
}
