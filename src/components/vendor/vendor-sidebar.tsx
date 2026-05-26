"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  Package2,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { getApiErrorMessage, logoutUser } from "@/services/auth";
import { ToastMessage } from "@/components/ui/toast-message";

type VendorSidebarTab = "dashboard" | "orders" | "inventory" | "earnings" | "profile";

type VendorSidebarProps = {
  active: VendorSidebarTab;
  businessName?: string | null;
  verified?: boolean;
  avatarText?: string;
  avatarUrl?: string | null;
};

function SidebarLink({
  label,
  href,
  active,
  icon,
}: {
  label: string;
  href: string;
  active?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-all ${
        active
          ? "bg-[#003b1b] text-white shadow-[0_8px_20px_-12px_rgba(0,59,27,0.55)]"
          : "text-[#404941] hover:bg-[#e4e2e1]"
      }`}
      href={href}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function VendorSidebar({
  active,
  businessName,
  verified,
  avatarText = "NV",
  avatarUrl,
}: VendorSidebarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const vendorLabel = useMemo(() => {
    const trimmed = businessName?.trim();
    return trimmed || "Vendor";
  }, [businessName]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logoutUser();
      setToast({ message: "Logged out successfully.", variant: "success" });
      window.setTimeout(() => {
        router.push("/auth/login");
        router.refresh();
      }, 550);
    } catch (error) {
      setToast({
        message: getApiErrorMessage(error, "Unable to log out right now."),
        variant: "error",
      });
      setLoggingOut(false);
    }
  };

  return (
    <>
      {toast ? (
        <ToastMessage
          message={toast.message}
          onClose={() => setToast(null)}
          variant={toast.variant}
        />
      ) : null}

      <aside className="hidden h-screen w-72 flex-col border-r border-[#c0c9be] bg-[#fcf9f8] px-4 py-3 md:fixed md:left-0 md:top-0 md:flex">
        <div className="px-4 pb-10 pt-3">
          <div className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
            NexaGrid
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_top,#35546b,#172635)] text-lg font-bold text-white">
              {avatarUrl ? (
                <img alt={vendorLabel} className="h-full w-full object-cover" src={avatarUrl} />
              ) : (
                avatarText
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1b1c1c]">Welcome back</p>
              <p className="text-[1.35rem] leading-7 font-medium text-[#1b1c1c]">
                {verified ? "Verified Merchant" : "Merchant Profile"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3 px-2">
          <SidebarLink active={active === "dashboard"} href="/dashboard/vendor" icon={<LayoutGrid className="h-6 w-6" />} label="Dashboard" />
          <SidebarLink active={active === "orders"} href="/dashboard/vendor/orders" icon={<ShoppingBag className="h-6 w-6" />} label="Orders" />
          <SidebarLink active={active === "inventory"} href="/dashboard/inventory" icon={<Package2 className="h-6 w-6" />} label="Inventory" />
          <SidebarLink active={active === "earnings"} href="/dashboard/vendor/earnings" icon={<CircleDollarSign className="h-6 w-6" />} label="Earnings" />
          <SidebarLink active={active === "profile"} href="/dashboard/vendor/profile" icon={<UserRound className="h-6 w-6" />} label="Profile" />
        </nav>

        <div className="space-y-3 px-2 pb-3">
          <Link
            className="flex h-14 items-center justify-center rounded-2xl border border-[#003b1b] text-base font-semibold text-[#003b1b] transition hover:bg-[#b1f2be]/40"
            href="/dashboard"
          >
            Switch Role
          </Link>
          <button
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#003b1b] text-base font-semibold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loggingOut}
            onClick={() => void handleLogout()}
            type="button"
          >
            {loggingOut ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
