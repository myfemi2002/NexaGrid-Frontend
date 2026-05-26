"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createFormStartedAt, fetchAuthStatus, forgotPassword, getApiErrorMessage, requestOtp, roleToDashboard, savePendingAuthState } from "@/services/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formStartedAt] = useState(() => createFormStartedAt());
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    fetchAuthStatus()
      .then((status) => {
        if (active && status.user) {
          router.replace(roleToDashboard(status.user.role));
        }
      })
      .finally(() => {
        if (active) {
          setCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div className="mx-auto w-full max-w-[460px]">
        <div className="rounded-3xl border border-line bg-white p-8 text-center text-warm-gray">
          Checking active session...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <Link href="/" className="font-heading text-3xl font-bold text-emerald">NexaGrid</Link>
        <Link href="/auth/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
          Back to Login
        </Link>
      </div>
      <h1 className="font-heading text-3xl font-bold text-emerald sm:text-4xl">Forgot password?</h1>
      <p className="mt-2 text-base text-warm-gray">Enter your email address and we&apos;ll send a reset code.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setErrorMessage(null);
          setLoading(true);

          try {
            await forgotPassword({ email: identity, formStartedAt });
            const otp = await requestOtp({ flow: "reset", identity, formStartedAt });
            savePendingAuthState({
              flow: "reset",
              channel: otp.channel,
              recipient: otp.recipient,
              email: identity,
              otpPreview: otp.otp_preview,
            });
            router.push(`/auth/verify-otp?flow=reset&identity=${encodeURIComponent(identity)}&channel=${otp.channel}`);
          } catch (error) {
            setErrorMessage(getApiErrorMessage(error, "We could not send your reset OTP."));
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input placeholder="Email address" value={identity} onChange={(event) => setIdentity(event.target.value)} />
        {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        <Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Code"}</Button>
      </form>
      <div className="mt-6 text-sm text-warm-gray">
        Need a fresh account?{" "}
        <Link href="/auth/register" className="font-semibold text-emerald">
          Create one here
        </Link>
      </div>
    </div>
  );
}
