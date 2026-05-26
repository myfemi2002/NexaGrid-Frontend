"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Download,
  Gavel,
  Grid2X2,
  BarChart3,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { ToastMessage } from "@/components/ui/toast-message";
import { getApiErrorMessage } from "@/services/auth";
import { downloadAdminMonthlyReport } from "@/services/admin-reports";

type AdminConsoleShellProps = {
  children: React.ReactNode;
  pendingApprovalsCount?: number;
  disputeCount?: number;
  tenantLabel?: string;
};

const navigationItems = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    icon: Grid2X2,
    active: (pathname: string) => pathname === "/dashboard/admin",
  },
  {
    href: "/dashboard/admin/vendor-approvals",
    label: "Vendor Approvals",
    icon: ShieldCheck,
    active: (pathname: string) => pathname.startsWith("/dashboard/admin/vendor-approvals"),
  },
  {
    href: "/dashboard/admin/users-tenants",
    label: "Users & Tenants",
    icon: Users,
    active: (pathname: string) => pathname.startsWith("/dashboard/admin/users-tenants"),
  },
  {
    href: "/dashboard/admin/order-analytics",
    label: "Order Analytics",
    icon: BarChart3,
    active: (pathname: string) => pathname.startsWith("/dashboard/admin/order-analytics"),
  },
  {
    href: "/dashboard/admin/delivery-hub",
    label: "Delivery Hub",
    icon: Truck,
    active: (pathname: string) => pathname.startsWith("/dashboard/admin/delivery-hub"),
  },
  {
    href: "/dashboard/admin/dispute-center",
    label: "Dispute Center",
    icon: Gavel,
    active: (pathname: string) => pathname.startsWith("/dashboard/admin/dispute-center"),
  },
];

export function AdminConsoleShell({
  children,
  pendingApprovalsCount = 0,
  disputeCount = 0,
  tenantLabel = "Lagos Hub (Main)",
}: AdminConsoleShellProps) {
  const pathname = usePathname();
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const handleExport = useCallback(async () => {
    setExporting(true);

    try {
      const { blob, filename } = await downloadAdminMonthlyReport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setToast({ message: "Monthly report exported successfully.", variant: "success" });
    } catch (error) {
      setToast({ message: getApiErrorMessage(error, "Unable to export the monthly report right now."), variant: "error" });
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#fcf9f8] text-[#1b1c1c]">
      {toast ? <ToastMessage message={toast.message} variant={toast.variant} onClose={() => setToast(null)} /> : null}
      <aside className="hidden w-72 flex-col border-r border-[#c0c9be] bg-[#fcf9f8] lg:flex">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003b1b] text-white">
                <Grid2X2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-['Space_Grotesk'] text-lg font-bold text-[#1b1c1c]">
                  NexaGrid Admin
                </h1>
                <p className="text-xs text-[#404941]">Community Management</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.active(pathname);
                const badge =
                  item.label === "Vendor Approvals"
                    ? pendingApprovalsCount
                    : item.label === "Dispute Center"
                      ? disputeCount
                      : null;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                      isActive ? "bg-[#14532d] text-[#87c695]" : "hover:bg-[#f0eded]"
                    } ${item.label === "Dispute Center" && !isActive ? "text-[#472c00]" : ""}`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-[#87c695]" : "text-current"}`} />
                    <p className={`text-sm font-medium ${isActive ? "text-white" : "text-current"}`}>
                      {item.label}
                    </p>
                    {badge !== null ? (
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.label === "Dispute Center"
                            ? "bg-[#654100] text-white"
                            : "bg-[#ba1a1a] text-white"
                        }`}
                      >
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={exporting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#003b1b] text-sm font-bold text-white shadow-lg shadow-[#003b1b]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              <span>{exporting ? "Exporting..." : "Export Monthly Report"}</span>
            </button>
            <div className="flex items-center gap-3 rounded-xl border border-[#c0c9be]/30 bg-[#f6f3f2] p-2">
              <img
                alt="Admin Profile"
                className="h-10 w-10 rounded-full object-cover"
                src="/images/test-raster.png"
              />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-[#1b1c1c]">Nexa Tenant Admin</p>
                <p className="text-xs text-[#404941]">Tenant Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#fcf9f8]">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[#c0c9be] bg-[#fcf9f8]/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#003b1b] md:text-[2rem]">
              NexaGrid Console
            </h2>
            <div className="relative hidden w-96 lg:block">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717970]" />
              <input
                className="h-11 w-full rounded-xl border-none bg-[#f0eded] pl-10 pr-4 text-sm placeholder:text-[#717970] focus:outline-none focus:ring-2 focus:ring-[#003b1b]/20"
                placeholder="Search orders, vendors or disputes..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0eded] text-[#404941]">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-[#fcf9f8] bg-[#ba1a1a]" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0eded] text-[#404941]">
              <Settings className="h-5 w-5" />
            </button>
            <div className="mx-2 hidden h-8 w-px bg-[#c0c9be] md:block" />
            <div className="hidden items-center gap-3 md:flex">
              <p className="text-sm font-semibold">{tenantLabel}</p>
              <ChevronDown className="h-4 w-4 text-[#404941]" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  );
}
