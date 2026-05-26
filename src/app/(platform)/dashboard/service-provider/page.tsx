"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  ChevronRight,
  CircleHelp,
  Headset,
  LayoutDashboard,
  MapPinned,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchServiceProviderDashboard, type ServiceProviderDashboardData } from "@/services/service-provider-dashboard";
import { fetchProviderOnboarding } from "@/services/provider-onboarding-service";

type MetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
  badge?: string;
};

type QuickActionProps = {
  label: string;
  icon: React.ReactNode;
};

const WEEKLY_GOAL_BARS = ["40%", "58%", "82%", "95%", "48%", "68%", "30%"];

function naira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PR"
  );
}

function formatBookingDate(value?: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMaybeNaira(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return naira(value);
}

function formatMaybeNumber(value?: number | null, suffix = "") {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value}${suffix}`;
}

function formatProviderStatus(status?: string | null) {
  if (!status) {
    return "Complete your profile";
  }

  return status
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-[#d9e4f4] bg-white p-7 shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
            <div className="mb-5 flex items-start justify-between">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#eef4ff]" />
              <div className="h-7 w-14 animate-pulse rounded-full bg-[#eef4ff]" />
            </div>
            <div className="h-4 w-28 animate-pulse rounded bg-[#eef4ff]" />
            <div className="mt-4 h-10 w-40 animate-pulse rounded bg-[#eef4ff]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
            <div className="flex items-center justify-between border-b border-[#dbe5f5] px-8 py-6">
              <div className="h-8 w-32 animate-pulse rounded bg-[#eef4ff]" />
              <div className="h-10 w-28 animate-pulse rounded-full bg-[#eef4ff]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-6 p-8">
                <div className="rounded-2xl border border-[#cfdcf0] bg-[#eff4ff] p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/80" />
                  <div className="mt-4 h-8 w-48 animate-pulse rounded bg-white/80" />
                  <div className="mt-4 h-6 w-40 animate-pulse rounded bg-white/80" />
                  <div className="mt-6 flex gap-3">
                    <div className="h-12 flex-1 animate-pulse rounded-xl bg-white/80" />
                    <div className="h-12 flex-1 animate-pulse rounded-xl bg-white/80" />
                  </div>
                </div>
                <div className="flex items-center gap-4 px-2">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-[#eef4ff]" />
                  <div className="space-y-2">
                    <div className="h-5 w-40 animate-pulse rounded bg-[#eef4ff]" />
                    <div className="h-4 w-28 animate-pulse rounded bg-[#eef4ff]" />
                  </div>
                </div>
              </div>
              <div className="min-h-[320px] animate-pulse bg-[#eef4ff]" />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
            <div className="flex items-center justify-between px-8 py-6">
              <div className="h-8 w-40 animate-pulse rounded bg-[#eef4ff]" />
              <div className="h-5 w-16 animate-pulse rounded bg-[#eef4ff]" />
            </div>
            <div className="space-y-px bg-[#dbe5f5]">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 bg-white px-8 py-5">
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <div key={cellIndex} className="h-5 animate-pulse rounded bg-[#eef4ff]" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-[#d9e4f4] bg-white p-8 shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
              <div className="h-8 w-36 animate-pulse rounded bg-[#eef4ff]" />
              <div className="mt-6 space-y-4">
                <div className="h-14 animate-pulse rounded-2xl bg-[#eef4ff]" />
                <div className="h-14 animate-pulse rounded-2xl bg-[#eef4ff]" />
                <div className="h-14 animate-pulse rounded-2xl bg-[#eef4ff]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, accent = "bg-[#caead6] text-[#003b1b]", badge }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-[#d9e4f4] bg-white p-7 shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
      <div className="mb-5 flex items-start justify-between">
        <span className={cn("inline-flex rounded-2xl p-3", accent)}>{icon}</span>
        {badge ? (
          <span className="rounded-full bg-[#b1f2be] px-3 py-1 text-xs font-bold text-[#12512c]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="text-sm font-semibold text-[#5a6575]">{title}</p>
      <h3 className="mt-2 text-[2.25rem] font-bold tracking-[-0.03em] text-[#003b1b]">{value}</h3>
    </div>
  );
}

function QuickAction({ label, icon }: QuickActionProps) {
  return (
    <button
      className="group flex w-full items-center justify-between rounded-2xl bg-[#eef4ff] px-5 py-5 text-left transition hover:bg-[#e5eeff]"
      type="button"
    >
      <span className="flex items-center gap-4">
        <span className="text-[#003b1b]">{icon}</span>
        <span className="text-lg font-bold text-[#0b1c30]">{label}</span>
      </span>
      <ChevronRight className="size-5 text-[#6a7281] transition group-hover:translate-x-1" />
    </button>
  );
}

export default function ServiceProviderDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<ServiceProviderDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchProviderOnboarding(),
      fetchServiceProviderDashboard(),
    ])
      .then(([onboarding, data]) => {
        if (active && !onboarding.completed_at) {
          router.replace("/dashboard/service-provider/onboarding");
          return;
        }

        if (active) {
          setDashboard(data);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const provider = dashboard?.provider;
  const metrics = dashboard?.metrics;
  const requests = dashboard?.requests ?? [];
  const calendar = dashboard?.calendar ?? [];

  const providerName = provider?.name?.trim() || "Provider";
  const providerInitials = useMemo(() => initials(providerName), [providerName]);
  const currentJob = requests.find((item) => item.status === "active") ?? requests[0] ?? null;
  const recentBookings = requests.length
    ? requests.slice(0, 3).map((item) => ({
        client: item.customer_name ?? "Client",
        service: item.title,
        date: formatBookingDate(calendar.find((entry) => entry.id === item.id)?.scheduled_for),
        amount: naira(item.amount),
        status: item.status_label,
      }))
    : [];

  const completedJobs = metrics?.completed_jobs ?? null;
  const pendingBookings = metrics ? metrics.new_requests + metrics.active_requests : null;
  const totalEarnings = metrics?.monthly_earnings ?? null;
  const availableBalance = provider?.wallet_balance ?? null;
  const rating = metrics?.average_rating ?? null;
  const activeNow = metrics?.active_requests ?? 0;
  const weeklyTarget = 500000;
  const weeklyAchievement = totalEarnings !== null ? Math.min(100, Math.round((totalEarnings / weeklyTarget) * 100)) : null;

  return (
    <section
      className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#003b1b] py-8 shadow-xl lg:flex">
        <div className="px-8">
          <h1 className="text-[3rem] font-bold tracking-[-0.04em] text-white">Provider Hub</h1>
          {loading ? (
            <div className="mt-3 h-4 w-28 animate-pulse rounded bg-white/15" />
          ) : (
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#afceba]">
              {formatProviderStatus(provider?.kyc_status)}
            </p>
          )}
        </div>

        <nav className="mt-12 flex-1 space-y-2 px-4">
          <Link
            href="/dashboard/service-provider"
            className="mx-1 flex items-center gap-4 rounded-2xl bg-[#14532d] px-5 py-4 text-[#87c695] transition"
          >
            <LayoutDashboard className="size-5" />
            <span className="text-base font-medium">Dashboard</span>
          </Link>
          <button className="mx-1 flex w-full items-center gap-4 px-5 py-4 text-left text-[#c7e5d2] transition hover:rounded-2xl hover:bg-[#12512c]" type="button">
            <CalendarDays className="size-5" />
            <span className="text-base font-medium">Bookings</span>
          </button>
          <button className="mx-1 flex w-full items-center gap-4 px-5 py-4 text-left text-[#c7e5d2] transition hover:rounded-2xl hover:bg-[#12512c]" type="button">
            <Wrench className="size-5" />
            <span className="text-base font-medium">Services</span>
          </button>
          <button className="mx-1 flex w-full items-center gap-4 px-5 py-4 text-left text-[#c7e5d2] transition hover:rounded-2xl hover:bg-[#12512c]" type="button">
            <Wallet className="size-5" />
            <span className="text-base font-medium">Wallet</span>
          </button>
          <button className="mx-1 flex w-full items-center gap-4 px-5 py-4 text-left text-[#c7e5d2] transition hover:rounded-2xl hover:bg-[#12512c]" type="button">
            <MessageSquareText className="size-5" />
            <span className="text-base font-medium">Chat</span>
          </button>
          <button className="mx-1 flex w-full items-center gap-4 px-5 py-4 text-left text-[#c7e5d2] transition hover:rounded-2xl hover:bg-[#12512c]" type="button">
            <Settings className="size-5" />
            <span className="text-base font-medium">Settings</span>
          </button>
        </nav>

        <div className="mt-auto px-4">
          <button
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-3xl bg-[#caead6] py-4 text-base font-bold text-[#042014] transition hover:opacity-90"
            type="button"
          >
            <Plus className="size-5" />
            New Service
          </button>
          <button className="flex w-full items-center gap-4 px-5 py-4 text-left text-[#c7e5d2] transition hover:rounded-2xl hover:bg-[#12512c]" type="button">
            <CircleHelp className="size-5" />
            <span className="text-base font-medium">Support</span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#dbe5f5] bg-[#f8f9ff] px-5 shadow-sm sm:px-8 xl:px-10">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#717970]" />
              <input
                className="h-14 w-full rounded-full border-none bg-[#eff4ff] pl-12 pr-5 text-base text-[#0b1c30] outline-none ring-2 ring-transparent transition focus:ring-[#2e6a41]"
                placeholder="Search bookings or services..."
                type="text"
              />
            </div>
          </div>

          <div className="ml-6 flex items-center gap-5 sm:gap-6">
            <button className="relative rounded-full p-2 text-[#003b1b] transition hover:bg-[#eff4ff]" type="button">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fda417]" />
            </button>
            <button className="rounded-full p-2 text-[#003b1b] transition hover:bg-[#eff4ff]" type="button">
              <CircleHelp className="size-5" />
            </button>
            <div className="hidden h-10 w-px bg-[#dbe5f5] sm:block" />
            <div className="hidden items-center gap-3 xl:flex">
              {loading ? (
                <>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-28 animate-pulse rounded bg-[#dbe5f5]" />
                    <div className="ml-auto h-3 w-20 animate-pulse rounded bg-[#dbe5f5]" />
                  </div>
                  <div className="h-11 w-11 animate-pulse rounded-full bg-[#dbe5f5]" />
                </>
              ) : (
                <>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#0b1c30]">{providerName}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#717970]">
                      {formatProviderStatus(provider?.availability_status)}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#b1f2be] bg-[#003b1b] text-sm font-bold text-white">
                    {providerInitials}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="px-5 py-8 sm:px-8 xl:px-10">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  title="Total Earnings"
                  value={formatMaybeNaira(totalEarnings)}
                  icon={<Wallet className="size-6" />}
                  badge={metrics?.growth_percent !== null && metrics?.growth_percent !== undefined ? `${metrics.growth_percent > 0 ? "+" : ""}${metrics.growth_percent}%` : undefined}
                />
                <MetricCard
                  title="Completed Jobs"
                  value={formatMaybeNumber(completedJobs)}
                  icon={<ChartNoAxesColumn className="size-6" />}
                  accent="bg-[#ffddb8] text-[#674000]"
                />
                <MetricCard
                  title="Pending Bookings"
                  value={formatMaybeNumber(pendingBookings)}
                  icon={<CalendarDays className="size-6" />}
                  accent="bg-[#ffdad6] text-[#93000a]"
                />
                <MetricCard
                  title="Rating"
                  value={rating !== null ? `${rating.toFixed(1)}/5` : "—"}
                  icon={<Star className="size-6" />}
                  accent="bg-[#caead6] text-[#314d3e]"
                />
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                  <section className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
                    <div className="flex items-center justify-between border-b border-[#dbe5f5] px-8 py-6">
                      <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-[#003b1b]">Live Jobs</h2>
                      <span className="flex items-center gap-2 rounded-full bg-[#ffddb8] px-4 py-2 text-sm font-semibold text-[#653e00]">
                        <span className="h-2 w-2 rounded-full bg-[#674000] animate-pulse" />
                        {activeNow} Active Now
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="space-y-6 p-8">
                        <div className="rounded-2xl border border-[#cfdcf0] bg-[#eff4ff] p-6">
                          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#003b1b]">Current Job</p>
                          <h4 className="mt-3 text-[1.2rem] font-bold text-[#0b1c30]">
                            {currentJob?.title ?? "No live job yet"}
                          </h4>
                          <div className="mt-4 flex items-center gap-2 text-[#404941]">
                            <MapPinned className="size-4" />
                            <span className="text-lg">{currentJob?.location ?? "Awaiting job assignment"}</span>
                          </div>
                          <div className="mt-6 flex gap-3">
                            <button className="flex-1 rounded-xl bg-[#003b1b] py-3 text-base font-semibold text-white transition hover:opacity-90" type="button">
                              Navigate
                            </button>
                            <button className="flex-1 rounded-xl border border-[#003b1b] py-3 text-base font-semibold text-[#003b1b] transition hover:bg-[#f3f8f4]" type="button">
                              Call Client
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 px-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#caead6] text-[#003b1b]">
                            <BriefcaseBusiness className="size-5" />
                          </div>
                          <div>
                            <p className="text-[1.05rem] font-bold text-[#0b1c30]">
                              {currentJob?.customer_name ?? "Client details will appear here"}
                            </p>
                            <p className="text-base text-[#5a6575]">
                              {provider?.coverage_area?.trim() || "Complete your profile"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative min-h-[320px]">
                        <img
                          alt="Lagos service map"
                          className="h-full w-full object-cover"
                          src="/images/logistics-map.svg"
                        />
                        <div className="absolute inset-0 bg-[#003b1b]/5" />
                      </div>
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
                    <div className="flex items-center justify-between px-8 py-6">
                      <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-[#003b1b]">Recent Bookings</h2>
                      <button className="text-sm font-semibold text-[#003b1b] hover:underline" type="button">
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-left">
                        <thead className="bg-[#eff4ff] text-sm font-semibold text-[#5a6575]">
                          <tr>
                            <th className="px-8 py-4">CLIENT</th>
                            <th className="px-8 py-4">SERVICE</th>
                            <th className="px-8 py-4">DATE</th>
                            <th className="px-8 py-4">AMOUNT</th>
                            <th className="px-8 py-4">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dbe5f5]">
                          {recentBookings.length ? (
                            recentBookings.map((booking) => (
                              <tr key={`${booking.client}-${booking.service}`} className="transition hover:bg-[#f8fbff]">
                                <td className="px-8 py-5 text-lg text-[#0b1c30]">{booking.client}</td>
                                <td className="px-8 py-5 text-lg text-[#0b1c30]">{booking.service}</td>
                                <td className="px-8 py-5 text-lg text-[#0b1c30]">{booking.date}</td>
                                <td className="px-8 py-5 text-lg font-bold text-[#0b1c30]">{booking.amount}</td>
                                <td className="px-8 py-5">
                                  <span
                                    className={cn(
                                      "rounded-full px-4 py-2 text-sm font-bold",
                                      booking.status.toLowerCase().includes("pending")
                                        ? "bg-[#ffddb8] text-[#653e00]"
                                        : "bg-[#caead6] text-[#314d3e]"
                                    )}
                                  >
                                    {booking.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="px-8 py-8 text-base text-[#5a6575]" colSpan={5}>
                                No bookings yet. Your recent bookings will appear here after customers place requests.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="relative overflow-hidden rounded-3xl bg-[#003b1b] p-8 text-white shadow-lg">
                    <div className="relative z-10">
                      <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#afceba]">Available Balance</p>
                        <Wallet className="size-5 text-white/70" />
                      </div>
                      <h2 className="text-[3.3rem] font-bold tracking-[-0.05em]">{formatMaybeNaira(availableBalance)}</h2>
                      <div className="mt-8 flex gap-4">
                        <button className="flex-1 rounded-2xl bg-[#caead6] py-4 text-lg font-bold text-[#042014]" type="button">
                          Withdraw
                        </button>
                        <button className="flex-1 rounded-2xl bg-white/10 py-4 text-lg font-bold text-white backdrop-blur transition hover:bg-white/20" type="button">
                          History
                        </button>
                      </div>
                    </div>
                    <div className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
                  </section>

                  <section className="rounded-3xl border border-[#d9e4f4] bg-white p-8 shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
                    <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-[#003b1b]">Quick Actions</h2>
                    <div className="mt-6 space-y-4">
                      <QuickAction label="Add New Service" icon={<Plus className="size-6" />} />
                      <QuickAction label="Set Availability" icon={<CalendarDays className="size-6" />} />
                      <QuickAction label="Promote Business" icon={<MessageSquareText className="size-6" />} />
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[#d9e4f4] bg-white p-8 shadow-[0_4px_20px_rgba(20,83,45,0.05)]">
                    <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-[#003b1b]">Weekly Goal</h2>
                    <div className="mb-5 mt-6 flex h-28 items-end gap-3">
                      {WEEKLY_GOAL_BARS.map((height, index) => (
                        <div
                          key={`${height}-${index}`}
                          className={cn(
                            "w-full rounded-t-md",
                            weeklyAchievement !== null && index === 3 ? "bg-[#003b1b]" : "bg-[#b1f2be]/45"
                          )}
                          style={{ height }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-base">
                      <p className="text-[#5a6575]">Target: {naira(weeklyTarget)}</p>
                      <p className="font-bold text-[#003b1b]">
                        {weeklyAchievement !== null ? `${weeklyAchievement}% Achieved` : "Set target"}
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="mt-14 border-t border-[#dbe5f5] bg-[#eff4ff] px-5 py-8 sm:px-8 xl:px-10">
          <div className="flex flex-col gap-6 text-[#404941] xl:flex-row xl:items-center xl:justify-between">
            <p className="max-w-2xl text-base">
              © 2024 NexaGrid Service Provider Network. Empowering Nigerian Commerce.
            </p>
            <div className="flex flex-wrap gap-8 text-sm font-medium">
              <Link href="#" className="hover:text-[#003b1b] hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#003b1b] hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-[#003b1b] hover:underline">
                Merchant Support
              </Link>
            </div>
          </div>
        </footer>
      </main>

      <button
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#003b1b] text-white shadow-lg transition hover:scale-110 active:scale-95"
        type="button"
      >
        <Headset className="size-6" />
      </button>
    </section>
  );
}
