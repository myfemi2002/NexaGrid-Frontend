"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TenantAdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/admin");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16 text-center text-[#404941]">
      Redirecting to the admin console...
    </div>
  );
}
