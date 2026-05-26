"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LockedAccountPage() {
  return (
    <div className="mx-auto w-full max-w-[520px] text-center">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <Link href="/" className="font-heading text-3xl font-bold text-emerald">NexaGrid</Link>
        <Link href="/auth/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
          Back
        </Link>
      </div>

      <div className="rounded-[2rem] border border-line bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-bold text-charcoal">Your account is temporarily locked</h1>
        <p className="mt-3 text-base text-warm-gray">
          We noticed unusual activity and paused access for security reasons. You can wait for the lock to expire or submit an unlock request for review.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/auth/unlock-request" className={cn(buttonVariants({ size: "lg" }))}>
            Submit Unlock Request
          </Link>
          <Link href="/auth/login" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
