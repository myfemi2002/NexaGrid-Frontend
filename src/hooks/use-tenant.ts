"use client";

import { useAppStore } from "@/store/use-app-store";

export function useTenant() {
  const tenant = useAppStore((state) => state.tenant);
  const setTenant = useAppStore((state) => state.setTenant);

  return { tenant, setTenant };
}
