"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CircleDollarSign,
  LoaderCircle,
  Package2,
  Plus,
  RefreshCcw,
  ShoppingCart,
  Truck,
  X,
  ImagePlus,
} from "lucide-react";
import { getApiErrorMessage } from "@/services/auth";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import {
  createVendorProduct,
  fetchVendorDashboard,
  requestVendorPayout,
  type VendorDashboardData,
  updateVendorInventory,
} from "@/services/vendor-dashboard";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  badgeClassName?: string;
  iconClassName?: string;
};

type ProductFormState = {
  product_category_id: string;
  name: string;
  description: string;
  price: string;
  compare_price: string;
  quantity: string;
  low_stock_threshold: string;
  status: "draft" | "published";
};

type PayoutFormState = {
  amount: string;
  note: string;
};

function naira(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function initials(value?: string | null) {
  const base = (value ?? "Vendor")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return base || "NV";
}

function formatVendorStatus(isVerified: boolean) {
  return isVerified ? "Verified Merchant" : "Merchant Profile";
}

function formatOrderStatus(status: string) {
  return status
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusClassName(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "processing" || normalized === "pending") {
    return "bg-[#b1f2be] text-[#12512c]";
  }

  if (normalized === "shipped") {
    return "bg-[#ffddb3] text-[#633f00]";
  }

  return "bg-[#e4e2e1] text-[#404941]";
}

function StatCard({
  icon,
  label,
  value,
  badge,
  badgeClassName = "bg-[#b1f2be] text-[#12512c]",
  iconClassName = "text-[#003b1b]",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#c0c9be]/50 bg-[#f6f3f2] p-6 shadow-[0_10px_30px_-18px_rgba(20,83,45,0.18)]">
      <div className="mb-4 flex items-start justify-between">
        <div className={iconClassName}>{icon}</div>
        {badge ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}>
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mb-1 text-sm font-medium text-[#404941]">{label}</p>
      <p className="font-['Space_Grotesk'] text-[2rem] font-bold tracking-[-0.02em] text-[#1b1c1c]">
        {value}
      </p>
    </div>
  );
}

function VendorDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-72 flex-col border-r border-[#c0c9be] bg-[#fcf9f8] px-4 py-3 md:fixed md:left-0 md:top-0 md:flex">
          <div className="px-4 pb-10 pt-3">
            <div className="h-12 w-48 animate-pulse rounded bg-[#e4e2e1]" />
            <div className="mt-10 flex items-center gap-4">
              <div className="h-14 w-14 animate-pulse rounded-full bg-[#e4e2e1]" />
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-[#e4e2e1]" />
                <div className="h-6 w-40 animate-pulse rounded bg-[#e4e2e1]" />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-3 px-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-2xl bg-[#e4e2e1]" />
            ))}
          </div>
          <div className="px-2 pb-3">
            <div className="h-14 animate-pulse rounded-2xl bg-[#e4e2e1]" />
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <div className="mb-10 flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-12 w-72 animate-pulse rounded bg-[#e4e2e1]" />
                <div className="h-5 w-96 animate-pulse rounded bg-[#e4e2e1]" />
              </div>
              <div className="h-16 w-48 animate-pulse rounded-2xl bg-[#e4e2e1]" />
            </div>

            <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.05fr]">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-2xl bg-[#e4e2e1]" />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,2.15fr)_360px]">
              <div className="space-y-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="h-10 w-52 animate-pulse rounded bg-[#e4e2e1]" />
                  <div className="h-6 w-20 animate-pulse rounded bg-[#e4e2e1]" />
                </div>
                <div className="h-[420px] animate-pulse rounded-[1.6rem] bg-[#e4e2e1]" />
              </div>
              <div className="space-y-10">
                <div className="h-72 animate-pulse rounded-[1.6rem] bg-[#e4e2e1]" />
                <div className="h-48 animate-pulse rounded-[1.6rem] bg-[#e4e2e1]" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showPayoutPanel, setShowPayoutPanel] = useState(false);
  const [showInventoryPanel, setShowInventoryPanel] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingPayout, setSubmittingPayout] = useState(false);
  const [savingInventoryId, setSavingInventoryId] = useState<number | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>({
    product_category_id: "",
    name: "",
    description: "",
    price: "",
    compare_price: "",
    quantity: "",
    low_stock_threshold: "10",
    status: "published",
  });
  const [payoutForm, setPayoutForm] = useState<PayoutFormState>({
    amount: "",
    note: "",
  });
  const [inventoryDrafts, setInventoryDrafts] = useState<Record<number, { quantity: string; low_stock_threshold: string }>>({});

  const loadDashboard = async () => {
    const data = await fetchVendorDashboard();
    setDashboard(data);
    setInventoryDrafts(
      Object.fromEntries(
        (data.low_stock ?? []).map((item) => [
          item.id,
          {
            quantity: String(item.quantity),
            low_stock_threshold: String(item.low_stock_threshold || 10),
          },
        ])
      )
    );
  };

  useEffect(() => {
    let active = true;

    loadDashboard()
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load the vendor dashboard right now."));
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
  }, []);

  const vendor = dashboard?.vendor;
  const metrics = dashboard?.metrics;
  const payouts = dashboard?.payouts;
  const recentOrders = dashboard?.recent_orders ?? [];
  const lowStockItems = dashboard?.low_stock ?? [];
  const logistics = dashboard?.logistics;
  const categories = dashboard?.catalog.categories ?? [];
  const businessName = vendor?.business_name?.trim() || vendor?.shop_name?.trim() || "Vendor";
  const vendorInitials = useMemo(() => initials(businessName), [businessName]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCreateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setSubmittingProduct(true);

    try {
      await createVendorProduct({
        product_category_id: Number(productForm.product_category_id),
        name: productForm.name.trim(),
        description: productForm.description.trim() || undefined,
        price: Number(productForm.price),
        compare_price: productForm.compare_price ? Number(productForm.compare_price) : null,
        quantity: Number(productForm.quantity),
        low_stock_threshold: Number(productForm.low_stock_threshold || "10"),
        status: productForm.status,
        image: productImageFile,
      });

      await loadDashboard();
      setSuccessMessage("Product added successfully.");
      setShowAddProduct(false);
      setProductForm({
        product_category_id: "",
        name: "",
        description: "",
        price: "",
        compare_price: "",
        quantity: "",
        low_stock_threshold: "10",
        status: "published",
      });
      setProductImageFile(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to add this product right now."));
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleRequestPayout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setSubmittingPayout(true);

    try {
      await requestVendorPayout({
        amount: Number(payoutForm.amount),
        note: payoutForm.note.trim() || undefined,
      });

      await loadDashboard();
      setSuccessMessage("Payout request submitted successfully.");
      setShowPayoutPanel(false);
      setPayoutForm({
        amount: "",
        note: "",
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to submit this payout request right now."));
    } finally {
      setSubmittingPayout(false);
    }
  };

  const handleUpdateInventory = async (productId: number) => {
    resetMessages();
    setSavingInventoryId(productId);

    try {
      const draft = inventoryDrafts[productId];
      await updateVendorInventory(productId, {
        quantity: Number(draft?.quantity ?? 0),
        low_stock_threshold: Number(draft?.low_stock_threshold ?? 10),
      });

      await loadDashboard();
      setSuccessMessage("Inventory updated successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to update inventory right now."));
    } finally {
      setSavingInventoryId(null);
    }
  };

  if (loading) {
    return <VendorDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <VendorSidebar
          active="dashboard"
          avatarText={vendorInitials}
          avatarUrl={vendor?.logo_url}
          businessName={businessName}
          verified={Boolean(vendor?.verified)}
        />

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
                  Shop Overview
                </h1>
                <p className="mt-2 max-w-2xl text-[1.05rem] text-[#404941]">
                  Here is what is happening with your business today.
                </p>
                <p className="mt-3 text-sm font-medium text-[#65645f]">
                  {businessName}
                  {vendor?.location ? ` • ${vendor.location}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="inline-flex h-[64px] items-center justify-center gap-3 rounded-2xl border border-[#003b1b] bg-white px-7 text-lg font-semibold text-[#003b1b] transition hover:bg-[#eff8f1]"
                  onClick={() => {
                    resetMessages();
                    setShowPayoutPanel(true);
                  }}
                  type="button"
                >
                  <CircleDollarSign className="h-6 w-6" />
                  <span>Request Payout</span>
                </button>
                <button
                  className="inline-flex h-[64px] items-center justify-center gap-3 rounded-2xl bg-[#003b1b] px-7 text-lg font-semibold text-white shadow-[0_16px_28px_-18px_rgba(0,59,27,0.6)] transition hover:bg-[#14532d]"
                  onClick={() => {
                    resetMessages();
                    setShowAddProduct(true);
                  }}
                  type="button"
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Product</span>
                </button>
              </div>
            </header>

            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-[#f3c8c3] bg-[#fff1ef] px-5 py-4 text-sm text-[#ba1a1a]">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-6 rounded-2xl border border-[#cfe7d4] bg-[#eff8f1] px-5 py-4 text-sm text-[#14532d]">
                {successMessage}
              </div>
            ) : null}

            {showAddProduct ? (
              <section className="mb-8 rounded-[1.75rem] border border-[#c0c9be] bg-white p-8 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#003b1b]">
                      Add Product
                    </h2>
                    <p className="mt-2 text-sm text-[#65645f]">
                      Create a new marketplace listing for your shop.
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-[#c0c9be] p-2 text-[#404941] transition hover:bg-[#f6f3f2]"
                    onClick={() => setShowAddProduct(false)}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleCreateProduct}>
                  <div className="rounded-2xl bg-[#f6f3f2] p-4 lg:col-span-2">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[#e4e2e1]">
                        {productImageFile ? (
                          <img
                            alt="Selected product preview"
                            className="h-full w-full object-cover"
                            src={URL.createObjectURL(productImageFile)}
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1b1c1c]">Product image</p>
                        <p className="mt-1 text-sm text-[#65645f]">
                          Upload a JPG, PNG, or WEBP image up to 5MB. This helps your product look complete immediately in the marketplace.
                        </p>
                        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#003b1b] px-4 py-2 text-sm font-semibold text-[#003b1b] transition hover:bg-[#eff8f1]">
                          <ImagePlus className="h-4 w-4" />
                          {productImageFile ? "Replace Image" : "Upload Image"}
                          <input
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              setProductImageFile(file);
                            }}
                            type="file"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Product Name</span>
                    <input
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.name}
                      onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Premium Kitchen Blender"
                      required
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Category</span>
                    <select
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.product_category_id}
                      onChange={(event) =>
                        setProductForm((current) => ({ ...current, product_category_id: event.target.value }))
                      }
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Description</span>
                    <textarea
                      className="min-h-[120px] w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 py-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.description}
                      onChange={(event) =>
                        setProductForm((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Tell customers what makes this product worth buying."
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Price (₦)</span>
                    <input
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.price}
                      onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
                      placeholder="25000"
                      type="number"
                      min="0"
                      required
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Compare Price (optional)</span>
                    <input
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.compare_price}
                      onChange={(event) =>
                        setProductForm((current) => ({ ...current, compare_price: event.target.value }))
                      }
                      placeholder="30000"
                      type="number"
                      min="0"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Opening Quantity</span>
                    <input
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.quantity}
                      onChange={(event) =>
                        setProductForm((current) => ({ ...current, quantity: event.target.value }))
                      }
                      placeholder="25"
                      type="number"
                      min="0"
                      required
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Low Stock Threshold</span>
                    <input
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.low_stock_threshold}
                      onChange={(event) =>
                        setProductForm((current) => ({ ...current, low_stock_threshold: event.target.value }))
                      }
                      placeholder="10"
                      type="number"
                      min="0"
                    />
                  </label>

                  <div className="flex gap-3 lg:col-span-2">
                    <button
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#003b1b] px-6 text-base font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                      disabled={submittingProduct}
                      type="submit"
                    >
                      {submittingProduct ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                      {submittingProduct ? "Saving..." : "Save Product"}
                    </button>
                    <button
                      className="h-14 rounded-xl border border-[#c0c9be] px-6 text-base font-semibold text-[#404941] transition hover:bg-[#f6f3f2]"
                      onClick={() => setShowAddProduct(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            ) : null}

            {showPayoutPanel ? (
              <section className="mb-8 rounded-[1.75rem] border border-[#c0c9be] bg-white p-8 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#003b1b]">
                      Request Payout
                    </h2>
                    <p className="mt-2 text-sm text-[#65645f]">
                      Submit a withdrawal request from your available vendor wallet balance.
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-[#c0c9be] p-2 text-[#404941] transition hover:bg-[#f6f3f2]"
                    onClick={() => setShowPayoutPanel(false)}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-5 rounded-2xl bg-[#f6f3f2] p-5 text-sm text-[#404941]">
                  <p>
                    Available balance:{" "}
                    <span className="font-semibold text-[#003b1b]">{naira(metrics?.wallet_balance)}</span>
                  </p>
                  <p className="mt-2">
                    Pending payout requests:{" "}
                    <span className="font-semibold text-[#003b1b]">
                      {payouts?.pending_count ?? 0} totaling {naira(payouts?.pending_amount)}
                    </span>
                  </p>
                  {payouts?.latest_request ? (
                    <p className="mt-2">
                      Latest request:{" "}
                      <span className="font-semibold text-[#003b1b]">
                        {payouts.latest_request.reference} • {naira(payouts.latest_request.amount)}
                      </span>
                    </p>
                  ) : null}
                </div>

                <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleRequestPayout}>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Amount (₦)</span>
                    <input
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={payoutForm.amount}
                      onChange={(event) => setPayoutForm((current) => ({ ...current, amount: event.target.value }))}
                      placeholder="50000"
                      type="number"
                      min="1000"
                      step="0.01"
                      max={metrics?.wallet_balance ?? undefined}
                      required
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Listing Status</span>
                    <select
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={productForm.status}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          status: event.target.value as "draft" | "published",
                        }))
                      }
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </label>

                  <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Note (optional)</span>
                    <textarea
                      className="min-h-[120px] w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 py-4 text-base outline-none ring-0 transition focus:border-[#14532d]"
                      value={payoutForm.note}
                      onChange={(event) => setPayoutForm((current) => ({ ...current, note: event.target.value }))}
                      placeholder="Add any settlement note for admin review."
                    />
                  </label>

                  <div className="flex gap-3 lg:col-span-2">
                    <button
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#003b1b] px-6 text-base font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                      disabled={submittingPayout}
                      type="submit"
                    >
                      {submittingPayout ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CircleDollarSign className="h-5 w-5" />}
                      {submittingPayout ? "Submitting..." : "Submit Payout Request"}
                    </button>
                    <button
                      className="h-14 rounded-xl border border-[#c0c9be] px-6 text-base font-semibold text-[#404941] transition hover:bg-[#f6f3f2]"
                      onClick={() => setShowPayoutPanel(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            ) : null}

            <section className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.05fr]">
              <StatCard
                badge={`${metrics && metrics.growth_percent > 0 ? "+" : ""}${metrics?.growth_percent ?? 0}%`}
                icon={<ArrowUpRight className="h-7 w-7" />}
                label="Total Sales"
                value={naira(metrics?.total_sales)}
              />
              <StatCard
                badge={`${metrics?.new_orders ?? 0} New`}
                badgeClassName="bg-[#ffddb3] text-[#633f00]"
                icon={<ShoppingCart className="h-7 w-7" />}
                iconClassName="text-[#472c00]"
                label="New Orders"
                value={`${metrics?.new_orders ?? 0}`}
              />
              <StatCard
                icon={<Package2 className="h-7 w-7" />}
                iconClassName="text-[#5f5e59]"
                label="Active Products"
                value={`${metrics?.active_products ?? 0}`}
              />

              <div className="relative overflow-hidden rounded-2xl border border-[#14532d] bg-[#14532d] p-6 text-white shadow-[0_18px_34px_-18px_rgba(20,83,45,0.65)]">
                <p className="mb-2 text-sm font-semibold text-[#87c695]">Wallet Balance</p>
                <p className="mb-3 font-['Space_Grotesk'] text-[2.2rem] font-bold tracking-[-0.03em]">
                  {naira(metrics?.wallet_balance)}
                </p>
                <p className="mb-6 text-sm text-[#b1f2be]">
                  {payouts?.pending_count
                    ? `${payouts.pending_count} payout request(s) pending`
                    : "No pending payout requests"}
                </p>
                <button
                  className="relative z-10 w-full rounded-2xl bg-[#fdba57] px-4 py-4 text-lg font-bold text-[#003b1b] transition hover:bg-[#ffddb3]"
                  onClick={() => {
                    resetMessages();
                    setShowPayoutPanel(true);
                  }}
                  type="button"
                >
                  Request Payout
                </button>
                <CircleDollarSign className="absolute bottom-4 right-4 h-24 w-24 text-[#2e6a41]/30" />
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,2.15fr)_360px]">
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-['Space_Grotesk'] text-4xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                    Recent Orders
                  </h2>
                  <Link className="text-lg font-semibold text-[#003b1b] hover:underline" href="/dashboard/vendor/orders">
                    View All
                  </Link>
                </div>

                <div className="overflow-hidden rounded-[1.6rem] border border-[#c0c9be] bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="border-b border-[#c0c9be] bg-[#fcf9f8]">
                        <tr>
                          <th className="px-8 py-5 text-xl font-medium tracking-[0.01em] text-[#1b1c1c]">
                            Order ID
                          </th>
                          <th className="px-8 py-5 text-xl font-medium tracking-[0.01em] text-[#1b1c1c]">
                            Customer
                          </th>
                          <th className="px-8 py-5 text-xl font-medium tracking-[0.01em] text-[#1b1c1c]">
                            Amount
                          </th>
                          <th className="px-8 py-5 text-xl font-medium tracking-[0.01em] text-[#1b1c1c]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c0c9be]">
                        {recentOrders.length ? (
                          recentOrders.map((order) => (
                            <tr key={order.id} className="bg-white transition-colors hover:bg-[#fcf9f8]">
                              <td className="px-8 py-9 text-[1.1rem] font-medium text-[#003b1b]">
                                {order.order_number}
                              </td>
                              <td className="px-8 py-9 text-[1.1rem] text-[#1b1c1c]">
                                {order.customer_name}
                              </td>
                              <td className="px-8 py-9 text-[1.1rem] text-[#1b1c1c]">
                                {naira(order.amount)}
                              </td>
                              <td className="px-8 py-9">
                                <span
                                  className={`inline-flex rounded-full px-4 py-2 text-base font-medium ${statusClassName(order.status)}`}
                                >
                                  {formatOrderStatus(order.status)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-8 py-10 text-[1.05rem] text-[#65645f]" colSpan={4}>
                              No orders yet. Your recent marketplace orders will appear here once customers start buying.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <aside className="space-y-10">
                <section>
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <h2 className="font-['Space_Grotesk'] text-4xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                      Low Stock
                    </h2>
                    {lowStockItems.length ? (
                      <button
                        className="rounded-xl bg-[#b1f2be]/40 px-4 py-2 text-sm font-semibold text-[#003b1b] transition hover:bg-[#b1f2be]/70"
                        onClick={() => {
                          resetMessages();
                          setShowInventoryPanel((value) => !value);
                        }}
                        type="button"
                      >
                        {showInventoryPanel ? "Close" : "Update Inventory"}
                      </button>
                    ) : null}
                  </div>

                  <div className="rounded-[1.6rem] border border-[#c0c9be] bg-white p-8">
                    {lowStockItems.length ? (
                      <>
                        <div className="space-y-8">
                          {lowStockItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-5">
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#e4e2e1]">
                                <img
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  src={item.image_url || "/images/product-rice.png"}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[1.1rem] font-medium text-[#1b1c1c]">{item.name}</p>
                                <p className="text-[1.05rem] font-semibold text-[#ba1a1a]">
                                  {item.quantity} units left
                                </p>
                              </div>
                              <button
                                className="text-[#003b1b] transition hover:text-[#14532d]"
                                onClick={() => setShowInventoryPanel(true)}
                                type="button"
                              >
                                <RefreshCcw className="h-8 w-8" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {showInventoryPanel ? (
                          <div className="mt-8 space-y-4 border-t border-[#e4e2e1] pt-6">
                            {lowStockItems.map((item) => {
                              const draft = inventoryDrafts[item.id] ?? {
                                quantity: String(item.quantity),
                                low_stock_threshold: String(item.low_stock_threshold || 10),
                              };

                              return (
                                <div key={item.id} className="rounded-2xl bg-[#f6f3f2] p-4">
                                  <p className="text-sm font-semibold text-[#1b1c1c]">{item.name}</p>
                                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <label className="space-y-2">
                                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#65645f]">
                                        Quantity
                                      </span>
                                      <input
                                        className="h-12 w-full rounded-xl border border-[#c0c9be] bg-white px-4 text-sm outline-none transition focus:border-[#14532d]"
                                        type="number"
                                        min="0"
                                        value={draft.quantity}
                                        onChange={(event) =>
                                          setInventoryDrafts((current) => ({
                                            ...current,
                                            [item.id]: {
                                              ...draft,
                                              quantity: event.target.value,
                                            },
                                          }))
                                        }
                                      />
                                    </label>
                                    <label className="space-y-2">
                                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#65645f]">
                                        Low stock threshold
                                      </span>
                                      <input
                                        className="h-12 w-full rounded-xl border border-[#c0c9be] bg-white px-4 text-sm outline-none transition focus:border-[#14532d]"
                                        type="number"
                                        min="0"
                                        value={draft.low_stock_threshold}
                                        onChange={(event) =>
                                          setInventoryDrafts((current) => ({
                                            ...current,
                                            [item.id]: {
                                              ...draft,
                                              low_stock_threshold: event.target.value,
                                            },
                                          }))
                                        }
                                      />
                                    </label>
                                  </div>
                                  <button
                                    className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#003b1b] px-4 text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                                    disabled={savingInventoryId === item.id}
                                    onClick={() => void handleUpdateInventory(item.id)}
                                    type="button"
                                  >
                                    {savingInventoryId === item.id ? (
                                      <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : null}
                                    Save Inventory
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-[1.05rem] leading-8 text-[#65645f]">
                        All products are currently above their low-stock threshold. Inventory alerts will appear here when quantities drop.
                      </p>
                    )}
                  </div>
                </section>

                <section className="rounded-[1.6rem] border border-[#fdba57]/70 bg-[#ffddb3]/20 p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <Truck className="h-8 w-8 text-[#472c00]" />
                    <h3 className="text-[1.85rem] font-semibold text-[#1b1c1c]">Logistics Update</h3>
                  </div>
                  <p className="text-[1.05rem] leading-8 text-[#472c00]">
                    {logistics?.message ?? "No active logistics updates yet."}
                  </p>
                </section>
              </aside>
            </div>
          </main>

          <footer className="border-t border-[#c0c9be] bg-[#eae7e7]/70 px-5 py-12 md:px-12">
            <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
                  NexaGrid
                </div>
                <p className="mt-5 max-w-md text-[1.15rem] leading-9 text-[#404941]">
                  Empowering Nigerian commerce with modern tools and secure logistics. Built for scale, designed for trust.
                </p>
                <p className="mt-8 text-[1.05rem] text-[#404941]">
                  © 2024 NexaGrid. Built for Nigerian Commerce.
                </p>
              </div>

              <div>
                <h4 className="text-[1.35rem] font-semibold text-[#1b1c1c]">Support</h4>
                <ul className="mt-5 space-y-4 text-[1.05rem] text-[#404941]">
                  <li>
                    <Link className="transition hover:text-[#003b1b]" href="#">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#003b1b]" href="#">
                      Trust &amp; Safety
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#003b1b]" href="#">
                      Merchant Terms
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[1.35rem] font-semibold text-[#1b1c1c]">Community</h4>
                <ul className="mt-5 space-y-4 text-[1.05rem] text-[#404941]">
                  <li>
                    <Link className="transition hover:text-[#003b1b]" href="#">
                      Local Delivery Hubs
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#003b1b]" href="#">
                      Community Stories
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
