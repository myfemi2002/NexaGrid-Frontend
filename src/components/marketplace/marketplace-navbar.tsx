"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, Menu, Search, ShoppingCart } from "lucide-react";
import { fetchAuthStatus } from "@/services/auth";

type MarketplaceNavbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  cartCount?: number;
  wishlistCount?: number;
};

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

export function MarketplaceNavbar({
  search,
  onSearchChange,
  onSearchSubmit,
  cartCount = 0,
  wishlistCount = 0,
}: MarketplaceNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; membership: string } | null>(null);

  useEffect(() => {
    let active = true;

    fetchAuthStatus()
      .then((status) => {
        if (!active) {
          return;
        }

        if (!status.user) {
          setUser({
            name: "Guest Shopper",
            membership: "Explore Marketplace",
          });
          return;
        }

        setUser({
          name: status.user.name,
          membership: "Gold Member",
        });
      })
      .catch(() => {
        if (active) {
          setUser({
            name: "Guest Shopper",
            membership: "Explore Marketplace",
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const navItems = useMemo(
    () => [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Brands", href: "#trusted-merchants" },
      { label: "Flash Deals", href: "#flash-sales" },
      { label: "Track Order", href: "/marketplace/orders" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8e0ec] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1420px] items-center gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <Link href="/" className="font-['Space_Grotesk',sans-serif] text-[1.9rem] font-bold text-[#003b1b]">
            NexaGrid
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm transition ${
                  index === 0
                    ? "font-semibold text-[#1b1c1c]"
                    : "font-medium text-[#5f6978] hover:text-[#003b1b]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto hidden min-w-0 items-center gap-4 md:flex">
          <form
            className="relative w-[280px] lg:w-[360px]"
            onSubmit={(event) => {
              event.preventDefault();
              onSearchSubmit();
            }}
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#607087]" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products, brands..."
              className="h-12 w-full rounded-xl border border-[#cfdae8] bg-[#f4f7fd] pl-11 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#003b1b] focus:bg-white"
            />
          </form>

          <Link
            href="/marketplace/wishlist"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#d5deeb] bg-white text-[#1b1c1c] transition hover:border-[#003b1b] hover:text-[#003b1b]"
          >
            <Heart className="size-4" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#214972] px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/marketplace/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#d5deeb] bg-white text-[#1b1c1c] transition hover:border-[#003b1b] hover:text-[#003b1b]"
          >
            <ShoppingCart className="size-4" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d62f2f] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center gap-3 rounded-full border border-[#d5deeb] bg-white px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3f0e6] text-sm font-bold text-[#003b1b]">
              {initials(user?.name ?? "NexaGrid")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1b1c1c]">{user?.name ?? "Guest Shopper"}</p>
              <p className="truncate text-[11px] text-[#8a948f]">{user?.membership ?? "Explore Marketplace"}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#d5deeb] bg-white text-[#1b1c1c] md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#e2e8f0] bg-white px-4 py-4 md:hidden">
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              onSearchSubmit();
              setMobileOpen(false);
            }}
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#607087]" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products, brands..."
              className="h-11 w-full rounded-xl border border-[#cfdae8] bg-[#f4f7fd] pl-11 pr-4 text-sm text-[#1b1c1c] outline-none"
            />
          </form>
          <nav className="mt-4 grid gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#465363]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
