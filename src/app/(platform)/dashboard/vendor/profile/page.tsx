"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CircleDollarSign,
  ImagePlus,
  LoaderCircle,
  Store,
  Upload,
} from "lucide-react";
import { getApiErrorMessage } from "@/services/auth";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import {
  fetchVendorProfile,
  type VendorProfileData,
  updateVendorBanner,
  updateVendorLogo,
  updateVendorProfile,
} from "@/services/vendor-dashboard";

type ProfileFormState = {
  business_name: string;
  shop_name: string;
  category: string;
  location: string;
  about: string;
  status: "draft" | "active" | "inactive";
};

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

function ProfileSkeleton() {
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
        </aside>
        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <div className="h-12 w-72 animate-pulse rounded bg-[#e4e2e1]" />
            <div className="mt-3 h-5 w-96 animate-pulse rounded bg-[#e4e2e1]" />
            <div className="mt-10 h-[640px] animate-pulse rounded-[1.8rem] bg-[#e4e2e1]" />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    business_name: "",
    shop_name: "",
    category: "",
    location: "",
    about: "",
    status: "active",
  });

  const loadProfile = async () => {
    const data = await fetchVendorProfile();
    setProfile(data);
    setForm({
      business_name: data.business_name ?? "",
      shop_name: data.shop_name ?? "",
      category: data.category ?? "",
      location: data.location ?? "",
      about: data.about ?? "",
      status: data.status === "draft" || data.status === "inactive" ? data.status : "active",
    });
  };

  useEffect(() => {
    let active = true;

    loadProfile()
      .catch((error) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, "Unable to load vendor profile right now."));
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

  const avatarInitials = useMemo(
    () => initials(profile?.business_name || profile?.shop_name || profile?.vendor_name),
    [profile]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const updated = await updateVendorProfile(form);
      setProfile(updated);
      setSuccessMessage("Vendor profile updated successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to save vendor profile right now."));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File, type: "logo" | "banner") => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (type === "logo") {
      setUploadingLogo(true);
    } else {
      setUploadingBanner(true);
    }

    try {
      const updated = type === "logo" ? await updateVendorLogo(file) : await updateVendorBanner(file);
      setProfile(updated);
      setSuccessMessage(`${type === "logo" ? "Logo" : "Banner"} updated successfully.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, `Unable to upload vendor ${type} right now.`));
    } finally {
      if (type === "logo") {
        setUploadingLogo(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="flex min-h-screen">
        <VendorSidebar
          active="profile"
          avatarText={avatarInitials}
          avatarUrl={profile?.logo_url}
          businessName={profile?.business_name || profile?.shop_name || profile?.vendor_name}
          verified={profile?.verified}
        />

        <div className="flex min-h-screen flex-1 flex-col md:ml-72">
          <main className="flex-1 px-5 py-6 md:px-12 md:py-10">
            <header className="mb-8">
              <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-[-0.04em] text-[#003b1b]">
                Store Branding & Profile
              </h1>
              <p className="mt-2 max-w-3xl text-[1.05rem] text-[#404941]">
                Update your vendor identity, upload a logo and banner, and keep your public storefront polished for customers.
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

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.4fr)_380px]">
              <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-8 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-[#1b1c1c]">Business Name</span>
                      <input
                        className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none transition focus:border-[#14532d]"
                        value={form.business_name}
                        onChange={(event) => setForm((current) => ({ ...current, business_name: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-[#1b1c1c]">Shop Name</span>
                      <input
                        className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none transition focus:border-[#14532d]"
                        value={form.shop_name}
                        onChange={(event) => setForm((current) => ({ ...current, shop_name: event.target.value }))}
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-[#1b1c1c]">Category</span>
                      <input
                        className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none transition focus:border-[#14532d]"
                        value={form.category}
                        onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                        placeholder="Electronics"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-[#1b1c1c]">Location</span>
                      <input
                        className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none transition focus:border-[#14532d]"
                        value={form.location}
                        onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                        placeholder="Redemption City"
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">Store Status</span>
                    <select
                      className="h-14 w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 text-base outline-none transition focus:border-[#14532d]"
                      value={form.status}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          status: event.target.value as "draft" | "active" | "inactive",
                        }))
                      }
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#1b1c1c]">About Your Store</span>
                    <textarea
                      className="min-h-[170px] w-full rounded-xl border border-[#c0c9be] bg-[#f6f3f2] px-4 py-4 text-base outline-none transition focus:border-[#14532d]"
                      value={form.about}
                      onChange={(event) => setForm((current) => ({ ...current, about: event.target.value }))}
                      placeholder="Tell customers what makes your store trustworthy, special, and worth shopping from."
                    />
                  </label>

                  <button
                    className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#003b1b] px-6 text-base font-semibold text-white transition hover:bg-[#14532d] disabled:opacity-70"
                    disabled={saving}
                    type="submit"
                  >
                    {saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Store className="h-5 w-5" />}
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </section>

              <aside className="space-y-8">
                <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                  <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                    Store Banner
                  </h2>
                  <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#d7ddd5] bg-[#f6f3f2]">
                    {profile?.banner_url ? (
                      <img alt={`${profile.shop_name} banner`} className="aspect-[16/9] w-full object-cover" src={profile.banner_url} />
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,#14532d_0%,#003b1b_100%)] text-white">
                        <Upload className="h-10 w-10 opacity-80" />
                      </div>
                    )}
                  </div>
                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#003b1b] px-4 py-3 text-sm font-semibold text-[#003b1b] transition hover:bg-[#eff8f1]">
                    {uploadingBanner ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    Replace Banner
                    <input
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      disabled={uploadingBanner}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void handleUpload(file, "banner");
                          event.currentTarget.value = "";
                        }
                      }}
                      type="file"
                    />
                  </label>
                </section>

                <section className="rounded-[1.8rem] border border-[#c0c9be] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(0,59,27,0.2)]">
                  <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                    Store Logo
                  </h2>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_top,#35546b,#172635)] text-2xl font-bold text-white">
                      {profile?.logo_url ? <img alt={`${profile.shop_name} logo`} className="h-full w-full object-cover" src={profile.logo_url} /> : avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm text-[#65645f]">Upload a square logo for your public storefront and vendor dashboard.</p>
                      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#003b1b] px-4 py-3 text-sm font-semibold text-[#003b1b] transition hover:bg-[#eff8f1]">
                        {uploadingLogo ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        Replace Logo
                        <input
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          disabled={uploadingLogo}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              void handleUpload(file, "logo");
                              event.currentTarget.value = "";
                            }
                          }}
                          type="file"
                        />
                      </label>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
