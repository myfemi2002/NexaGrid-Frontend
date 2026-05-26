"use client";

import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/marketplace") {
    return <>{children}</>;
  }

  return <SiteShell>{children}</SiteShell>;
}
