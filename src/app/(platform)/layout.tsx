"use client";

import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";

const shellFreePrefixes = [
  "/dashboard/service-provider",
  "/dashboard/vendor",
  "/dashboard/inventory",
  "/dashboard/admin",
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useShell = !shellFreePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!useShell) {
    return <>{children}</>;
  }

  return <SiteShell>{children}</SiteShell>;
}
