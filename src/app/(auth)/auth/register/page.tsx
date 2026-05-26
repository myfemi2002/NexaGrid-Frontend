"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Bike, BriefcaseBusiness, LoaderCircle, ShoppingBag, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createFormStartedAt, fetchAuthStatus, getApiErrorMessage, requestOtp, roleToDashboard, savePendingAuthState } from "@/services/auth";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  community: z.string().min(2, "Select your community"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Values = z.infer<typeof schema>;

const roles = [
  { label: "Customer", value: "customer", icon: ShoppingBag, copy: "Shop local goods, book nearby services, and find premium apartments.", featured: true },
  { label: "Vendor", value: "vendor", icon: Store, copy: "Sell products and manage your local inventory with ease." },
  { label: "Delivery Rider", value: "delivery-rider", icon: Bike, copy: "Earn by delivering packages within your local hub." },
  { label: "Service Provider", value: "service-provider", icon: BriefcaseBusiness, copy: "Offer trusted domestic or trade services nearby." },
  { label: "Apartment Host", value: "apartment-host", icon: Building2, copy: "List short-stay apartments or long-term rentals." },
];

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("customer");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formStartedAt] = useState(() => createFormStartedAt());
  const [checkingSession, setCheckingSession] = useState(true);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", community: "", password: "" },
  });

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");

    if (role && roles.some((item) => item.value === role)) {
      setSelectedRole(role);
    }

    fetchAuthStatus()
      .then((status) => {
        if (!active) {
          return;
        }

        if (status.user) {
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

  const submit = form.handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      const otp = await requestOtp({ flow: "signup", identity: values.email, formStartedAt });
      savePendingAuthState({
        flow: "signup",
        role: selectedRole,
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        community: values.community,
        channel: "email",
        recipient: otp.recipient,
        otpPreview: otp.otp_preview,
        verificationKey: undefined,
      });
      router.push(`/auth/verify-otp?flow=signup&identity=${encodeURIComponent(values.email)}&channel=email&role=${selectedRole}`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "We could not start your signup verification."));
    }
  });

  if (checkingSession) {
    return (
      <div className="mx-auto flex w-full max-w-[460px] flex-col justify-center">
        <div className="rounded-3xl border border-line bg-white p-8 text-center text-warm-gray">
          Checking active session...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl lg:flex lg:min-h-[calc(100dvh-3rem)] lg:flex-col lg:justify-center">
      <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
        <Link href="/" className="font-heading text-2xl font-bold text-emerald sm:text-3xl">
          NexaGrid
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-warm-gray md:inline">Already have an account?</span>
          <Link href="/auth/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
            Sign In
          </Link>
        </div>
      </div>

      <div className="mx-auto mb-5 flex max-w-xl items-center justify-between">
        {["Role", "Details", "Confirm"].map((step, index) => (
          <div key={step} className="flex flex-1 items-center">
            <div className="text-center">
              <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-emerald text-white" : "bg-[#e4e4e4] text-warm-gray"}`}>
                {index + 1}
              </div>
              <p className="mt-1.5 text-xs text-charcoal sm:text-sm">{step}</p>
            </div>
            {index < 2 ? <div className="mx-4 h-px flex-1 bg-line" /> : null}
          </div>
        ))}
      </div>

      <div className="mb-5 text-center">
        <h1 className="font-heading text-3xl font-bold text-emerald sm:text-4xl xl:text-5xl">How will you use NexaGrid?</h1>
        <p className="mt-2 text-sm text-warm-gray sm:text-base xl:text-lg">Choose your primary role. You can always expand your services later.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const active = selectedRole === role.value;

            return (
              <button
                key={role.label}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={cn("text-left transition-transform duration-200 hover:-translate-y-0.5", role.featured ? "sm:col-span-2 xl:col-span-2" : "")}
              >
                <Card className={cn("h-full p-4", active ? "border-emerald shadow-[0_18px_45px_-28px_rgba(20,83,45,0.45)]" : "hover:border-emerald/50")}>
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", active ? "bg-[#b1f2be]" : "bg-muted")}>
                    <Icon className={cn("size-5", active ? "text-emerald" : "text-warm-gray")} />
                  </div>
                  <h2 className="mt-3 font-heading text-lg sm:text-xl">{role.label}</h2>
                  <p className="mt-2 text-sm leading-5 text-warm-gray">{role.copy}</p>
                </Card>
              </button>
            );
          })}
        </div>

        <Card className="p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald">Your Details</p>
            <h3 className="mt-1 font-heading text-2xl sm:text-3xl">Finish your registration</h3>
          </div>
          <form className="space-y-3" onSubmit={submit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Full Name</label>
                <Input placeholder="Enter your full name" {...form.register("name")} />
                {form.formState.errors.name ? <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Email Address</label>
                <Input placeholder="example@nexagrid.com" {...form.register("email")} />
                {form.formState.errors.email ? <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Phone Number (Nigeria)</label>
                <div className="flex overflow-hidden rounded-2xl border border-line">
                  <div className="flex items-center bg-muted px-4 text-charcoal">+234</div>
                  <input className="h-12 flex-1 bg-white px-4 text-sm outline-none" placeholder="801 234 5678" {...form.register("phone")} />
                </div>
                {form.formState.errors.phone ? <p className="mt-1 text-sm text-red-600">{form.formState.errors.phone.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Community</label>
                <select className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-charcoal outline-none" {...form.register("community")}>
                  <option value="">Select your community</option>
                  <option value="Redemption City">Redemption City</option>
                  <option value="Lekki Phase 1">Lekki Phase 1</option>
                  <option value="Ikeja GRA">Ikeja GRA</option>
                  <option value="Camp Area">Camp Area</option>
                </select>
                {form.formState.errors.community ? <p className="mt-1 text-sm text-red-600">{form.formState.errors.community.message}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Create Password</label>
              <Input type="password" placeholder="Minimum 8 characters" {...form.register("password")} />
              {form.formState.errors.password ? <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p> : null}
            </div>

            {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

            <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-2.5 text-sm text-warm-gray">
              <span>Selected role</span>
              <span className="font-semibold text-charcoal">{roles.find((role) => role.value === selectedRole)?.label}</span>
            </div>

            <Button type="submit" className="h-12 w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <LoaderCircle className="size-5 animate-spin" /> : <>Continue Registration <ArrowRight className="size-5" /></>}
            </Button>
            <p className="text-center text-xs text-warm-gray sm:text-sm">
              By continuing, you agree to NexaGrid onboarding and verification checks.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
