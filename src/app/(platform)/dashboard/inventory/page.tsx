"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleDollarSign,
  ImagePlus,
  LoaderCircle,
  Package2,
  Pencil,
  Search,
} from "lucide-react";
import { getApiErrorMessage } from "@/services/auth";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  fetchVendorDashboard,
  fetchVendorProductsWithFilters,
  type VendorDashboardData,
  type VendorInventoryProduct,
  updateVendorInventory,
  updateVendorProductImage,
  updateVendorProduct,
} from "@/services/vendor-dashboard";

type EditFormState = {
  product_category_id: string;
  name: string;
  description: string;
  price: string;
  compare_price: string;
  status: "draft" | "published";
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

function InventorySkeleton() {
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
        </aside>

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <div className="space-y-3">
              <div className="h-12 w-80 animate-pulse rounded bg-[#e4e2e1]" />
              <div className="h-5 w-96 animate-pulse rounded bg-[#e4e2e1]" />
            </div>
            <div className="mt-10 h-[620px] animate-pulse rounded-[1.8rem] bg-[#e4e2e1]" />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function InventoryDashboardPage() {
  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [products, setProducts] = useState<VendorInventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "draft" | "published">("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savingInventoryId, setSavingInventoryId] = useState<number | null>(null);
  const [savingProductId, setSavingProductId] = useState<number | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [inventoryDrafts, setInventoryDrafts] = useState<Record<number, { quantity: string; low_stock_threshold: string }>>({});
  const [editForm, setEditForm] = useState<EditFormState>({
    product_category_id: "",
    name: "",
    description: "",
    price: "",
    compare_price: "",
    status: "published",
  });

  const mergeInventoryDrafts = useCallback((items: VendorInventoryProduct[]) => {
    setInventoryDrafts((current) => ({
      ...current,
      ...Object.fromEntries(
        items.map((product) => [
          product.id,
          current[product.id] ?? {
            quantity: String(product.inventory.quantity),
            low_stock_threshold: String(product.inventory.low_stock_threshold || 10),
          },
        ])
      ),
    }));
  }, []);

  const mergeProducts = useCallback((current: VendorInventoryProduct[], incoming: VendorInventoryProduct[]) => {
    const seen = new Set(current.map((item) => item.id));
    const merged = [...current];
    incoming.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    });
    return merged;
  }, []);

  const loadProducts = useCallback(async (pageToLoad: number, replace = false) => {
    if (!replace) {
      setLoadingMore(true);
    }

    try {
      const productData = await fetchVendorProductsWithFilters({
        page: pageToLoad,
        q: query.trim() || undefined,
        status: statusFilter || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      });

      setProducts((current) => (replace ? productData.products : mergeProducts(current, productData.products)));
      mergeInventoryDrafts(productData.products);
      setCurrentPage(productData.pagination.current_page);
      setHasMore(productData.pagination.has_more);
    } finally {
      if (!replace) {
        setLoadingMore(false);
      }
    }
  }, [categoryFilter, mergeInventoryDrafts, mergeProducts, query, statusFilter]);

  useEffect(() => {
    let active = true;

    fetchVendorDashboard()
      .then((dashboardData) => {
        if (!active) {
          return;
        }
        setDashboard(dashboardData);
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load your inventory right now."));
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

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(false);
    setLoading(true);
    setErrorMessage(null);

    loadProducts(1, true)
      .catch((error) => setErrorMessage(getApiErrorMessage(error, "Unable to refresh your product catalog right now.")))
      .finally(() => setLoading(false));
  }, [categoryFilter, query, statusFilter, loadProducts]);

  const sentinelRef = useInfiniteScroll({
    enabled: !loading,
    hasMore,
    isLoading: loadingMore,
    onLoadMore: () => {
      void loadProducts(currentPage + 1);
    },
  });

  const vendor = dashboard?.vendor;
  const categories = dashboard?.catalog.categories ?? [];
  const businessName = vendor?.business_name?.trim() || vendor?.shop_name?.trim() || "Vendor";
  const vendorInitials = useMemo(() => initials(businessName), [businessName]);
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    if (selectedProductId !== null && !products.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(products[0]?.id ?? null);
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setEditForm({
      product_category_id: String(selectedProduct.category.id ?? ""),
      name: selectedProduct.name,
      description: selectedProduct.description ?? "",
      price: String(selectedProduct.price),
      compare_price: selectedProduct.compare_price ? String(selectedProduct.compare_price) : "",
      status: selectedProduct.status === "draft" ? "draft" : "published",
    });
  }, [selectedProduct]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
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
      await loadProducts(1, true);
      setSuccessMessage("Inventory updated successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to update inventory right now."));
    } finally {
      setSavingInventoryId(null);
    }
  };

  const handleUpdateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) {
      return;
    }

    resetMessages();
    setSavingProductId(selectedProduct.id);

    try {
      await updateVendorProduct(selectedProduct.id, {
        product_category_id: Number(editForm.product_category_id),
        name: editForm.name.trim(),
        description: editForm.description.trim() || undefined,
        price: Number(editForm.price),
        compare_price: editForm.compare_price ? Number(editForm.compare_price) : null,
        status: editForm.status,
      });
      await loadProducts(1, true);
      setSuccessMessage("Product details updated successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to update this product right now."));
    } finally {
      setSavingProductId(null);
    }
  };

  const handleUploadImage = async (file: File, productId: number) => {
    resetMessages();
    setUploadingImageId(productId);

    try {
      await updateVendorProductImage(productId, file);
      await loadProducts(1, true);
      setSuccessMessage("Product image updated successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to upload the product image right now."));
    } finally {
      setUploadingImageId(null);
    }
  };

  if (loading) {
    return <InventorySkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <VendorSidebar
          active="inventory"
          avatarText={vendorInitials}
          avatarUrl={vendor?.logo_url}
          businessName={businessName}
          verified={Boolean(vendor?.verified)}
        />

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <header className="mb-10">
              <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
                Inventory Management
              </h1>
              <p className="mt-2 max-w-3xl text-[1.05rem] text-[#404941]">
                Review your live product catalog, edit product details, and update stock without leaving the vendor workspace.
              </p>
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

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.6fr)_420px]">
              <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                      Product Catalog
                    </h2>
                    <p className="mt-2 text-sm text-[#65645f]">
                      {products.length} products in your current vendor catalog
                    </p>
                  </div>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_220px]">
                  <label className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717970]" />
                    <input
                      className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] pl-11 pr-4 text-sm outline-none transition focus:border-[#14532d]"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search products, description, or SKU..."
                      value={query}
                    />
                  </label>

                  <select
                    className="h-12 rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                    onChange={(event) => setStatusFilter(event.target.value as "" | "draft" | "published")}
                    value={statusFilter}
                  >
                    <option value="">All statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>

                  <select
                    className="h-12 rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    value={categoryFilter}
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {products.length ? (
                    products.map((product) => (
                      <button
                        key={product.id}
                        className={`grid w-full grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-2xl border p-4 text-left transition ${
                          selectedProductId === product.id
                            ? "border-[#14532d] bg-[#f3f8f4]"
                            : "border-[#e4e2e1] bg-[#fcf9f8] hover:border-[#c0c9be]"
                        }`}
                        onClick={() => setSelectedProductId(product.id)}
                        type="button"
                      >
                        <div className="h-24 w-22 overflow-hidden rounded-2xl bg-[#e4e2e1]">
                          <img
                            alt={product.name}
                            className="h-full w-full object-cover"
                            src={product.image_url || "/images/product-rice.png"}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="truncate text-xl font-semibold text-[#1b1c1c]">{product.name}</h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                product.status === "published"
                                  ? "bg-[#b1f2be] text-[#12512c]"
                                  : "bg-[#e4e2e1] text-[#404941]"
                              }`}
                            >
                              {product.status === "published" ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#65645f]">
                            {product.category.name || "Uncategorized"} • {naira(product.price)}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#404941]">
                            <span>Stock: {product.inventory.quantity}</span>
                            <span>Low stock at: {product.inventory.low_stock_threshold}</span>
                            <span>Reserved: {product.inventory.reserved_quantity}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#c0c9be] bg-[#fcf9f8] px-6 py-10 text-center text-[#65645f]">
                      No products yet. Add products from your vendor dashboard to start managing stock here.
                    </div>
                  )}
                </div>

                {products.length ? (
                  <div className="mt-6 rounded-2xl border border-[#e4e2e1] bg-[#fcf9f8] px-5 py-4 text-center text-sm text-[#65645f]">
                    <div ref={sentinelRef} className="h-1 w-full" />
                    {loadingMore ? (
                      <span className="font-medium">Loading more records...</span>
                    ) : hasMore ? (
                      <span>Scroll down to load more products automatically.</span>
                    ) : (
                      <span>No more records to load.</span>
                    )}
                  </div>
                ) : null}
              </section>

              <aside className="space-y-8">
                <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                  <div className="mb-5 flex items-center gap-3">
                    <Pencil className="h-6 w-6 text-[#003b1b]" />
                    <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                      Edit Product
                    </h2>
                  </div>

                  {selectedProduct ? (
                    <form className="space-y-4" onSubmit={handleUpdateProduct}>
                      <div className="rounded-2xl bg-[#f6f3f2] p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[#e4e2e1]">
                            <img
                              alt={selectedProduct.name}
                              className="h-full w-full object-cover"
                              src={selectedProduct.image_url || "/images/product-rice.png"}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#1b1c1c]">Product Image</p>
                            <p className="mt-1 text-sm leading-6 text-[#65645f]">
                              Upload a JPG, PNG, or WEBP image up to 5MB. The image will be optimized automatically.
                            </p>
                            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#003b1b] px-4 py-2 text-sm font-semibold text-[#003b1b] transition hover:bg-[#eff8f1]">
                              {uploadingImageId === selectedProduct.id ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                              ) : (
                                <ImagePlus className="h-4 w-4" />
                              )}
                              Replace Image
                              <input
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                                disabled={uploadingImageId === selectedProduct.id}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) {
                                    void handleUploadImage(file, selectedProduct.id);
                                    event.currentTarget.value = "";
                                  }
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
                          className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                          value={editForm.name}
                          onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
                          required
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-[#1b1c1c]">Category</span>
                        <select
                          className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                          value={editForm.product_category_id}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, product_category_id: event.target.value }))
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

                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-[#1b1c1c]">Description</span>
                        <textarea
                          className="min-h-[104px] w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 py-3 text-sm outline-none transition focus:border-[#14532d]"
                          value={editForm.description}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, description: event.target.value }))
                          }
                        />
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-[#1b1c1c]">Price (₦)</span>
                          <input
                            className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                            type="number"
                            min="0"
                            value={editForm.price}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, price: event.target.value }))
                            }
                            required
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-[#1b1c1c]">Compare Price</span>
                          <input
                            className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                            type="number"
                            min="0"
                            value={editForm.compare_price}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, compare_price: event.target.value }))
                            }
                          />
                        </label>
                      </div>

                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-[#1b1c1c]">Status</span>
                        <select
                          className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                          value={editForm.status}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              status: event.target.value as "draft" | "published",
                            }))
                          }
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </label>

                      <button
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#003b1b] px-5 text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                        disabled={savingProductId === selectedProduct.id}
                        type="submit"
                      >
                        {savingProductId === selectedProduct.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                        Save Product
                      </button>
                    </form>
                  ) : (
                    <p className="rounded-2xl bg-[#fcf9f8] px-4 py-6 text-sm text-[#65645f]">
                      Select a product from the catalog to edit its details or change its publish status.
                    </p>
                  )}
                </section>

                <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                  <div className="mb-5 flex items-center gap-3">
                    <Package2 className="h-6 w-6 text-[#003b1b]" />
                    <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                      Stock Control
                    </h2>
                  </div>

                  {selectedProduct ? (
                    <div className="space-y-4">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-[#1b1c1c]">Available Quantity</span>
                        <input
                          className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                          type="number"
                          min="0"
                          value={inventoryDrafts[selectedProduct.id]?.quantity ?? String(selectedProduct.inventory.quantity)}
                          onChange={(event) =>
                            setInventoryDrafts((current) => ({
                              ...current,
                              [selectedProduct.id]: {
                                quantity: event.target.value,
                                low_stock_threshold:
                                  current[selectedProduct.id]?.low_stock_threshold ??
                                  String(selectedProduct.inventory.low_stock_threshold),
                              },
                            }))
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-[#1b1c1c]">Low Stock Threshold</span>
                        <input
                          className="h-12 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-sm outline-none transition focus:border-[#14532d]"
                          type="number"
                          min="0"
                          value={
                            inventoryDrafts[selectedProduct.id]?.low_stock_threshold ??
                            String(selectedProduct.inventory.low_stock_threshold)
                          }
                          onChange={(event) =>
                            setInventoryDrafts((current) => ({
                              ...current,
                              [selectedProduct.id]: {
                                quantity: current[selectedProduct.id]?.quantity ?? String(selectedProduct.inventory.quantity),
                                low_stock_threshold: event.target.value,
                              },
                            }))
                          }
                        />
                      </label>

                      <button
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#003b1b] px-5 text-sm font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                        disabled={savingInventoryId === selectedProduct.id}
                        onClick={() => void handleUpdateInventory(selectedProduct.id)}
                        type="button"
                      >
                        {savingInventoryId === selectedProduct.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Package2 className="h-4 w-4" />
                        )}
                        Save Inventory
                      </button>
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-[#fcf9f8] px-4 py-6 text-sm text-[#65645f]">
                      Select a product to update available quantity and low-stock settings.
                    </p>
                  )}
                </section>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
