"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Home, MapPin, Menu, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { marketingNav } from "@/constants/navigation";
import { useTenant } from "@/hooks/use-tenant";
import { fetchAuthStatus, logoutUser, roleToDashboard } from "@/services/auth";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "NG"
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { tenant } = useTenant();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = useMemo(
    () => [{ label: "Home", href: "/" }, ...marketingNav.filter((item) => item.href !== "/")],
    []
  );

  useEffect(() => {
    let active = true;

    setLoadingUser(true);

    fetchAuthStatus()
      .then((status) => {
        if (active) {
          setUser(
            status.user
              ? { name: status.user.name, role: status.user.role }
              : null
          );
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingUser(false);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8ddd7]/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8 xl:gap-12">
          <Link
            href="/"
            className="font-heading text-xl font-extrabold tracking-tight text-[#003b1b] sm:text-2xl"
          >
            NexaGrid
          </Link>
          <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-[11px] font-semibold transition-colors xl:text-sm ${
                  pathname === item.href
                    ? "text-[#003b1b]"
                    : "text-[#5f5e59] hover:text-[#003b1b]"
                }`}
              >
                {item.href === "/" ? <Home className="size-4 md:hidden xl:block" /> : null}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[#d8ddd7] bg-[#f6f3f2] px-3 py-2 lg:flex">
            <MapPin className="size-4 text-[#717970]" />
            <span className="text-xs font-semibold text-[#404941]">{tenant}</span>
          </div>
          <div className="hidden items-center gap-3 rounded-full border border-[#d8ddd7] bg-[#f6f3f2] px-4 py-2 md:flex xl:hidden">
            <Search className="size-4 text-[#717970]" />
            <span className="text-xs font-semibold text-[#717970]">Search</span>
          </div>

          {loadingUser ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#f0eded]" />
          ) : user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={roleToDashboard(user.role)}
                className="hidden rounded-full bg-[#003b1b] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#003b1b]/10 transition hover:bg-[#14532d] sm:inline-flex"
              >
                Dashboard
              </Link>

              <div className="hidden items-center gap-3 rounded-full border border-[#d8ddd7] bg-white px-3 py-2 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003b1b] text-xs font-bold text-white">
                  {initials(user.name)}
                </div>
                <div className="max-w-[140px] truncate text-sm font-medium text-[#1b1c1c]">
                  {user.name}
                </div>
                <ChevronDown className="hidden size-4 text-[#717970] lg:block" />
              </div>

              <button
                type="button"
                className="rounded-full border border-[#d8ddd7] bg-white px-4 py-2 text-xs font-semibold text-[#1b1c1c] transition hover:bg-[#f6f3f2]"
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true);

                  try {
                    await logoutUser();
                    setUser(null);
                    router.refresh();
                    router.push("/");
                  } finally {
                    setLoggingOut(false);
                  }
                }}
              >
                {loggingOut ? "..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-full border border-[#d8ddd7] bg-white px-4 py-2 text-xs font-semibold text-[#1b1c1c] transition hover:bg-[#f6f3f2]"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-[#003b1b] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#003b1b]/10 transition hover:bg-[#14532d]"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Menu className="size-5 text-[#1b1c1c] md:hidden" />
        </div>
      </div>
    </header>
  );
}
