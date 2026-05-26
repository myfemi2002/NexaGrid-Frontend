"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createFormStartedAt, getApiErrorMessage, submitUnlockRequest } from "@/services/auth";

export default function UnlockRequestPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formStartedAt] = useState(() => createFormStartedAt());

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <Link href="/" className="font-heading text-3xl font-bold text-emerald">NexaGrid</Link>
        <Link href="/auth/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
          Back
        </Link>
      </div>

      <div className="rounded-[2rem] border border-line bg-white p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-bold text-charcoal">Unlock Request</h1>
        <p className="mt-2 text-base text-warm-gray">
          Your unlock request will be submitted for review.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setErrorMessage(null);
            setMessage(null);
            setLoading(true);

            try {
              const response = await submitUnlockRequest({ email, reason, formStartedAt });
              setMessage(response.message ?? "Your unlock request has been submitted.");
            } catch (error) {
              setErrorMessage(getApiErrorMessage(error, "This request could not be processed at the moment."));
            } finally {
              setLoading(false);
            }
          }}
        >
          <Input placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Textarea
            placeholder="Tell us what happened and why the account should be reviewed."
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          {message ? <p className="rounded-2xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-sm text-emerald">{message}</p> : null}
          {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
          <Button type="submit" className="h-12 w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Unlock Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
