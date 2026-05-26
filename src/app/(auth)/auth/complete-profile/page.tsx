"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearPendingAuthState, getApiErrorMessage, getPendingAuthState, roleToDashboard, updateProfile } from "@/services/auth";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [tenantDistrict, setTenantDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pending = getPendingAuthState();
    setPhone(pending?.phone ?? "");
    setTenantDistrict(pending?.community ?? "");
    setBusinessName("");
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <Link href="/" className="font-heading text-3xl font-bold text-emerald">NexaGrid</Link>
        <Link href="/auth/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
          Sign In
        </Link>
      </div>
      <h1 className="font-heading text-3xl font-semibold text-emerald sm:text-4xl">Complete profile</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setErrorMessage(null);
          setLoading(true);

          try {
            const pending = getPendingAuthState();
            const result = await updateProfile({
              phone,
              community: tenantDistrict,
              businessName,
            });

            clearPendingAuthState();
            router.push(roleToDashboard(result.user.role ?? pending?.role));
          } catch (error) {
            setErrorMessage(getApiErrorMessage(error, "We could not complete your profile."));
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input placeholder="Tenant / district" value={tenantDistrict} onChange={(event) => setTenantDistrict(event.target.value)} />
        <Input placeholder="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <Input placeholder="Business or property name" value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
        {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        <Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? "Saving..." : "Finalize Onboarding"}</Button>
      </form>
    </div>
  );
}
