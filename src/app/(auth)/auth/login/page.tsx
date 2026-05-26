"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFormStartedAt,
  fetchAuthStatus,
  getApiErrorMessage,
  loginWithPassword,
  logoutUser,
  requestOtp,
  roleToDashboard,
  savePendingAuthState,
} from "@/services/auth";

const schema = z.object({
  identity: z.string().min(3, "Enter your email or phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Values = z.infer<typeof schema>;

function MerchantAvatars() {
  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="flex -space-x-3">
        {["A", "T", "M"].map((letter, index) => (
          <div
            key={letter}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#14532d] text-xs font-bold text-white ${
              index === 0 ? "bg-[#2b7a4b]" : index === 1 ? "bg-[#174d32]" : "bg-[#487a57]"
            }`}
          >
            {letter}
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-white">Joined by 50k+ Merchants</p>
    </div>
  );
}

function ActiveSessionPanel({
  activeUser,
  switchingAccount,
  onSwitchAccount,
}: {
  activeUser: { name: string; role: string };
  switchingAccount: boolean;
  onSwitchAccount: () => Promise<void>;
}) {
  const router = useRouter();

  return (
    <section className="flex min-h-dvh w-full overflow-hidden bg-[#fcf9f8] lg:h-dvh lg:min-h-0">
      <div className="flex w-full flex-col justify-center px-5 py-8 sm:px-8 lg:w-1/2 lg:px-10 lg:py-10 xl:px-12">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="mb-10">
            <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#003b1b]">NexaGrid</h1>
          </div>

          <div className="mb-8">
            <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-semibold text-[#1b1c1c]">
              Active session already running
            </h2>
            <p className="mt-3 text-base leading-7 text-[#5f5e59]">
              An active session is already running for{" "}
              <span className="font-semibold text-[#1b1c1c]">{activeUser.name}</span>. Please logout first to switch account.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[#d7ddd6] bg-white px-5 py-5 shadow-[0_12px_28px_-20px_rgba(0,59,27,0.16)]">
            <p className="text-sm text-[#65645f]">Signed in as</p>
            <p className="mt-1 text-xl font-semibold text-[#1b1c1c]">{activeUser.name}</p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#14532d] px-5 text-sm font-semibold text-white transition hover:bg-[#0f4726]"
            >
              Continue as {activeUser.name}
              <ArrowRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => router.push(roleToDashboard(activeUser.role))}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#003b1b] bg-white px-5 text-sm font-semibold text-[#003b1b] transition hover:bg-[#f2f7f3]"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              disabled={switchingAccount}
              onClick={onSwitchAccount}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#d5dad2] bg-[#fcf9f8] px-5 text-sm font-semibold text-[#1b1c1c] transition hover:bg-[#f5f2ed] disabled:opacity-60"
            >
              {switchingAccount ? <LoaderCircle className="size-5 animate-spin" /> : <LogOut className="size-5" />}
              {switchingAccount ? "Logging out..." : "Logout and Switch Account"}
            </button>
          </div>

          <footer className="mt-10 border-t border-[#d8ddd5] pt-5 text-sm text-[#65645f]">
            © 2024 NexaGrid. Built for Nigerian Commerce.
          </footer>
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-[#14532d] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55 mix-blend-overlay"
          style={{ backgroundImage: "url('/images/hero-smart-city.svg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,59,27,0.28)_0%,rgba(0,59,27,0.76)_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-end p-10">
          <div className="w-20 border-t-4 border-[#fdba57]" />
          <h3 className="mt-8 font-['Space_Grotesk',sans-serif] text-[3.2rem] font-bold leading-[1.05] text-white">
            Empowering Local Commerce with Global Tech.
          </h3>
          <p className="mt-5 max-w-md text-xl leading-8 text-[#d7e8da]">
            Secure, transparent, and built for the modern Nigerian merchant.
          </p>
          <MerchantAvatars />
        </div>
        <div className="absolute right-10 top-10 h-28 w-28 rounded-full border-[12px] border-[#96d5a3]/20" />
      </div>
    </section>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [formStartedAt] = useState(() => createFormStartedAt());
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState<{ name: string; role: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [switchingAccount, setSwitchingAccount] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { identity: "", password: "" },
  });

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);

    setResetSuccess(params.get("reset") === "success");

    fetchAuthStatus()
      .then((status) => {
        if (!active) {
          return;
        }

        if (status.user) {
          setActiveUser({ name: status.user.name, role: status.user.role });
        } else {
          const sessionReason = params.get("session");
          const reasonMessage = params.get("reason");

          if (sessionReason && reasonMessage) {
            setErrorMessage(reasonMessage);
          } else if (sessionReason === "session_expired") {
            setErrorMessage("Your session has expired. Please sign in again.");
          } else if (sessionReason === "session_revoked") {
            setErrorMessage("Your session is no longer active. Please sign in again.");
          } else if (sessionReason === "session_hijacking_detected") {
            setErrorMessage("We noticed unusual activity. Please sign in again.");
          }
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
  }, []);

  const submit = form.handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      const result = await loginWithPassword({ ...values, formStartedAt });
      router.push(roleToDashboard(result.user.role));
    } catch (error) {
      const message = getApiErrorMessage(error, "Invalid login details.");

      if (message.toLowerCase().includes("temporarily locked")) {
        router.push("/auth/locked");
        return;
      }

      setErrorMessage(message);
    }
  });

  const handleOtpLogin = async () => {
    const identity = form.getValues("identity");

    if (!identity) {
      form.setError("identity", { message: "Enter your email address first." });
      return;
    }

    setOtpLoading(true);
    setErrorMessage(null);

    try {
      const otp = await requestOtp({ flow: "login", identity, formStartedAt });
      savePendingAuthState({
        flow: "login",
        channel: "email",
        recipient: otp.recipient,
        email: identity,
        otpPreview: otp.otp_preview,
      });
      router.push(`/auth/verify-otp?flow=login&identity=${encodeURIComponent(identity)}&channel=email`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "This request could not be processed at the moment."));
    } finally {
      setOtpLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="rounded-3xl border border-[#d9ddd6] bg-white px-8 py-6 text-center text-[#5f5e59] shadow-[0_18px_42px_-26px_rgba(0,59,27,0.16)]">
          Checking active session...
        </div>
      </div>
    );
  }

  if (activeUser) {
    return (
      <ActiveSessionPanel
        activeUser={activeUser}
        switchingAccount={switchingAccount}
        onSwitchAccount={async () => {
          setSwitchingAccount(true);

          try {
            await logoutUser();
            setActiveUser(null);
            setErrorMessage(null);
          } finally {
            setSwitchingAccount(false);
          }
        }}
      />
    );
  }

  return (
    <section className="flex min-h-dvh w-full overflow-hidden bg-[#fcf9f8] lg:h-dvh lg:min-h-0">
      <div className="flex w-full flex-col justify-center px-5 py-8 sm:px-8 lg:w-1/2 lg:px-10 lg:py-10 xl:px-12">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="mb-10">
            <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#003b1b]">NexaGrid</h1>
          </div>

          <div className="mb-8">
            <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-semibold text-[#1b1c1c]">
              Welcome back to NexaGrid
            </h2>
            <p className="mt-2 text-lg text-[#5f5e59]">Your Community Commerce Hub</p>
          </div>

          {resetSuccess ? (
            <p className="mb-4 rounded-xl border border-[#cfe7d4] bg-[#eff8f1] px-4 py-3 text-sm text-[#14532d]">
              Password updated successfully. Please sign in with your new password.
            </p>
          ) : null}

          <form className="space-y-6" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1b1c1c]" htmlFor="identity">
                Email or Phone Number
              </label>
              <input
                id="identity"
                type="text"
                placeholder="Enter your email or 080..."
                {...form.register("identity")}
                className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-5 text-base text-[#1b1c1c] transition"
              />
              {form.formState.errors.identity ? (
                <p className="text-sm text-[#ba1a1a]">{form.formState.errors.identity.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1b1c1c]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-5 pr-14 text-base text-[#1b1c1c] transition"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#404941] transition hover:text-[#003b1b]"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="text-sm text-[#ba1a1a]">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            {errorMessage ? (
              <p className="rounded-xl border border-[#f3c8c3] bg-[#fff1ef] px-4 py-3 text-sm text-[#ba1a1a]">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#404941]">
                <input type="checkbox" className="h-5 w-5 rounded border-[#717970]" />
                Remember Me
              </label>
              <Link href="/auth/forgot-password" className="font-semibold text-[#003b1b] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#14532d] px-5 text-base font-semibold text-white shadow-[0_14px_36px_-18px_rgba(20,83,45,0.35)] transition hover:bg-[#0f4726] disabled:opacity-70"
            >
              {form.formState.isSubmitting ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="size-5" />
                </>
              )}
            </button>

            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-[#c0c9be]" />
              <span className="text-sm font-semibold text-[#1b1c1c]">OR</span>
              <div className="h-px flex-1 bg-[#c0c9be]" />
            </div>

            <button
              type="button"
              onClick={handleOtpLogin}
              disabled={otpLoading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#003b1b] bg-white px-5 text-base font-semibold text-[#003b1b] transition hover:bg-[#eff8f1] disabled:opacity-70"
            >
              {otpLoading ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <>
                  <Lock className="size-5" />
                  Login with OTP
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-[#5f5e59]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-bold text-[#003b1b] hover:underline">
                Create a Business Profile
              </Link>
            </p>
          </div>

          <footer className="mt-10 border-t border-[#d8ddd5] pt-5 text-sm text-[#65645f]">
            © 2024 NexaGrid. Built for Nigerian Commerce.
          </footer>
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-[#14532d] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55 mix-blend-overlay"
          style={{ backgroundImage: "url('/images/hero-smart-city.svg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,59,27,0.28)_0%,rgba(0,59,27,0.76)_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-end p-10">
          <div className="w-20 border-t-4 border-[#fdba57]" />
          <h3 className="mt-8 font-['Space_Grotesk',sans-serif] text-[3.2rem] font-bold leading-[1.05] text-white">
            Empowering Local Commerce with Global Tech.
          </h3>
          <p className="mt-5 max-w-md text-xl leading-8 text-[#d7e8da]">
            Secure, transparent, and built for the modern Nigerian merchant.
          </p>
          <MerchantAvatars />
        </div>
        <div className="absolute right-10 top-10 h-28 w-28 rounded-full border-[12px] border-[#96d5a3]/20" />
      </div>
    </section>
  );
}
