"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearPendingAuthState, createFormStartedAt, fetchAuthStatus, getApiErrorMessage, getPendingAuthState, registerUser, requestOtp, roleToDashboard, savePendingAuthState, verifyOtp } from "@/services/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<string | null>(null);
  const [identity, setIdentity] = useState("");
  const [channel, setChannel] = useState<"email">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpPreview, setOtpPreview] = useState<string | undefined>();
  const [formStartedAt] = useState(() => createFormStartedAt());
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);

    fetchAuthStatus()
      .then((status) => {
        if (!active) {
          return;
        }

        const currentFlow = params.get("flow");

        if (status.user && currentFlow !== "signup" && currentFlow !== "reset") {
          router.replace(roleToDashboard(status.user.role));
          return;
        }

        setFlow(currentFlow);
        setIdentity(params.get("identity") ?? "");

        if (params.get("channel") === "email") {
          setChannel("email");
        }

        const pending = getPendingAuthState();
        setOtpPreview(pending?.otpPreview);
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

  const joinedCode = useMemo(() => code.join(""), [code]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
  };

  const handleVerify = async () => {
    if (!flow) {
      setErrorMessage("Verification flow is missing.");
      return;
    }

    if (joinedCode.length !== 6) {
      setErrorMessage("Enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const verification = await verifyOtp({
        flow: flow as "login" | "signup" | "reset",
        identity,
        code: joinedCode,
      });

      if (flow === "login") {
        clearPendingAuthState();
        router.push(roleToDashboard(verification.user?.role));
        return;
      }

      if (flow === "reset") {
        savePendingAuthState({
          ...(getPendingAuthState() ?? {}),
          flow: "reset",
          resetEmail: verification.email,
          resetToken: verification.reset_token,
        });
        router.push("/auth/reset-password");
        return;
      }

      const pending = getPendingAuthState();

      if (!pending?.email || !pending.password || !pending.name || !pending.phone || !pending.role) {
        throw new Error("Your signup session expired. Please start again.");
      }

      savePendingAuthState({
        ...pending,
        verificationKey: verification.verification_key,
      });

      await registerUser({
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        role: pending.role,
        password: pending.password,
        verificationKey: verification.verification_key,
        formStartedAt,
      });

      router.push("/auth/complete-profile");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Invalid or expired OTP code."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!flow || !identity) {
      return;
    }

    setResendLoading(true);
    setErrorMessage(null);

    try {
      const otp = await requestOtp({
        flow: flow as "login" | "signup" | "reset",
        identity,
        formStartedAt,
      });

      const pending = getPendingAuthState();
      savePendingAuthState({
        ...(pending ?? { flow: flow as "login" | "signup" | "reset" }),
        channel: "email",
        recipient: otp.recipient,
        email: identity,
        otpPreview: otp.otp_preview,
      });
      setOtpPreview(otp.otp_preview);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Too many OTP attempts. Please wait before trying again."));
    } finally {
      setResendLoading(false);
    }
  };

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
          Back
        </Link>
      </div>
      <h1 className="font-heading text-3xl font-bold text-emerald sm:text-4xl">Verify OTP</h1>
      <p className="mt-2 text-base text-warm-gray">Please check your email for the OTP code.</p>
      {identity ? <p className="mt-2 text-sm font-medium text-charcoal">{identity}</p> : null}
      {otpPreview ? <p className="mt-2 rounded-2xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-sm text-emerald">Dev OTP preview: {otpPreview}</p> : null}
      <div className="mt-6 flex gap-2 sm:gap-3">
        {code.map((value, index) => (
          <input
            key={index}
            value={value}
            onChange={(event) => handleChange(index, event.target.value)}
            maxLength={1}
            className="h-14 w-12 rounded-2xl border border-line bg-white text-center text-xl outline-none focus:border-emerald sm:h-16 sm:w-14 sm:text-2xl"
          />
        ))}
      </div>
      {errorMessage ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
      <Button className="mt-6 h-12 w-full" onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify and Continue"}
      </Button>
      <p className="mt-4 text-sm text-warm-gray">
        Didn&apos;t get the code?{" "}
        <button type="button" className="font-semibold text-emerald" onClick={handleResend} disabled={resendLoading}>
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </p>
    </div>
  );
}
