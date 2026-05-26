"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { clearPendingAuthState, createFormStartedAt, fetchAuthStatus, getApiErrorMessage, getPendingAuthState, resetPassword, roleToDashboard } from "@/services/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
          Sign In
        </Link>
      </div>
      <h1 className="font-heading text-3xl font-bold text-emerald sm:text-4xl">Reset password</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setErrorMessage(null);
          setLoading(true);

          try {
            const pending = getPendingAuthState();

            if (!pending?.resetEmail || !pending.resetToken) {
              throw new Error("Your reset session expired. Please request a new OTP.");
            }

            await resetPassword({
              email: pending.resetEmail,
              token: pending.resetToken,
              password,
              passwordConfirmation,
              formStartedAt,
            });

            clearPendingAuthState();
            router.push("/auth/login?reset=success");
          } catch (error) {
            setErrorMessage(getApiErrorMessage(error, error instanceof Error ? error.message : "We could not reset your password."));
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Input type="password" placeholder="Confirm password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
        {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        <Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? "Saving..." : "Save New Password"}</Button>
      </form>
    </div>
  );
}
