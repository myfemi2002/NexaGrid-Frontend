"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Fingerprint, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { ProviderOnboardingShell } from "@/components/provider-onboarding/onboarding-shell";
import { FileDropzone } from "@/components/provider-onboarding/file-dropzone";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/services/auth";
import { useProviderOnboarding, useSaveOnboardingStep, useUploadProviderDocument } from "@/hooks/use-provider-onboarding";

const categories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "AC Repair",
  "Carpentry",
  "Laundry",
  "Tutoring",
  "Internet Installation",
  "Mechanics",
  "Dispatch",
  "Event Services",
] as const;

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const accountSchema = z
  .object({
    full_name: z.string().min(2, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    phone_number: z.string().min(10, "Enter a valid phone number."),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.password && value.password.length < 8) {
      context.addIssue({ code: "custom", path: ["password"], message: "Password must be at least 8 characters." });
    }

    if (value.password && value.password !== value.password_confirmation) {
      context.addIssue({ code: "custom", path: ["password_confirmation"], message: "Passwords do not match." });
    }
  });

const identitySchema = z.object({
  identification_type: z.enum(["nin", "voters_card"]),
  identification_number: z.string().min(5, "Identification number is required."),
});

const businessSchema = z.object({
  business_name: z.string().min(2, "Business name is required."),
  business_type: z.string().min(2, "Business type is required."),
  cac_registration_number: z.string().optional(),
  business_address: z.string().min(8, "Business address is required."),
});

const serviceSchema = z.object({
  service_category: z.string().min(1, "Service category is required."),
  service_subcategory: z.string().min(2, "Service subcategory is required."),
  years_of_experience: z.string().min(1, "Years of experience is required."),
  price_range_min: z.string().min(1, "Minimum price is required."),
  price_range_max: z.string().min(1, "Maximum price is required."),
  service_description: z.string().min(20, "Describe your service in a little more detail."),
  emergency_service_available: z.boolean(),
}).superRefine((value, context) => {
  if (Number.isNaN(Number(value.years_of_experience))) {
    context.addIssue({ code: "custom", path: ["years_of_experience"], message: "Years of experience must be a number." });
  }

  if (Number.isNaN(Number(value.price_range_min))) {
    context.addIssue({ code: "custom", path: ["price_range_min"], message: "Minimum price must be a number." });
  }

  if (Number.isNaN(Number(value.price_range_max))) {
    context.addIssue({ code: "custom", path: ["price_range_max"], message: "Maximum price must be a number." });
  }

  if (Number(value.price_range_max) < Number(value.price_range_min)) {
    context.addIssue({ code: "custom", path: ["price_range_max"], message: "Maximum price must be greater than minimum price." });
  }
});

const coverageSchema = z.object({
  state: z.string().min(2, "State is required."),
  city: z.string().min(2, "City or LGA is required."),
  service_radius: z.string().min(1, "Service radius is required."),
  available_days: z.array(z.string()).min(1, "Select at least one available day."),
  working_hours: z.object({
    start: z.string().min(1, "Start time is required."),
    end: z.string().min(1, "End time is required."),
  }),
  instant_booking: z.boolean(),
});

type ErrorMap = Record<string, string>;

function stepTitle(step: number) {
  switch (step) {
    case 1:
      return "Create Account";
    case 2:
      return "Identity Verification";
    case 3:
      return "Business Documentation";
    case 4:
      return "Service Selection";
    case 5:
      return "Coverage Area";
    default:
      return "Service Provider Onboarding";
  }
}

function stepDescription(step: number) {
  switch (step) {
    case 1:
      return "Create or confirm your provider account details before submitting verification documents.";
    case 2:
      return "We need to confirm your identity to keep the NexaGrid community secure.";
    case 3:
      return "Tell us about your business and upload the supporting documents we need for review.";
    case 4:
      return "Select your service focus, experience level, and pricing so residents know what you offer.";
    case 5:
      return "Define where you work, when you are available, and whether customers can book instantly.";
    default:
      return "";
  }
}

function ProviderOnboardingSkeleton() {
  return (
    <ProviderOnboardingShell currentStep={2}>
      <div className="rounded-[2.2rem] bg-white px-8 py-10 shadow-[0_24px_45px_rgba(20,83,45,0.08)] md:px-14 md:py-14">
        <div className="flex items-start gap-5">
          <Skeleton className="h-16 w-16 rounded-2xl bg-[#dfe9fb]" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-72 bg-[#dfe9fb]" />
            <Skeleton className="h-6 w-full max-w-xl bg-[#dfe9fb]" />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <Skeleton className="h-14 w-full bg-[#dfe9fb]" />
          <Skeleton className="h-14 w-full bg-[#dfe9fb]" />
          <Skeleton className="h-72 w-full rounded-[2rem] bg-[#e8f0ff]" />
          <div className="flex justify-between pt-10">
            <Skeleton className="h-12 w-40 bg-[#dfe9fb]" />
            <Skeleton className="h-14 w-72 bg-[#dfe9fb]" />
          </div>
        </div>
      </div>
    </ProviderOnboardingShell>
  );
}

function normalizeErrors(result: z.ZodError): ErrorMap {
  const flattened = result.flatten().fieldErrors as Record<string, string[] | undefined>;
  const entries = Object.entries(flattened).flatMap(([key, value]) => (value?.[0] ? [[key, value[0]]] : []));
  return Object.fromEntries(entries);
}

export default function ServiceProviderOnboardingPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useProviderOnboarding();
  const { save, saving } = useSaveOnboardingStep();
  const { upload, uploading } = useUploadProviderDocument();

  const [editMode, setEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [accountErrors, setAccountErrors] = useState<ErrorMap>({});
  const [identityErrors, setIdentityErrors] = useState<ErrorMap>({});
  const [businessErrors, setBusinessErrors] = useState<ErrorMap>({});
  const [serviceErrors, setServiceErrors] = useState<ErrorMap>({});
  const [coverageErrors, setCoverageErrors] = useState<ErrorMap>({});

  const [accountForm, setAccountForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const [identityForm, setIdentityForm] = useState({
    identification_type: "nin" as "nin" | "voters_card",
    identification_number: "",
    id_document: null as File | null,
    existing_document_name: null as string | null,
  });
  const [businessForm, setBusinessForm] = useState({
    business_name: "",
    business_type: "",
    cac_registration_number: "",
    business_address: "",
    business_document: null as File | null,
    proof_of_address: null as File | null,
    existing_business_document_name: null as string | null,
    existing_proof_of_address_name: null as string | null,
  });
  const [serviceForm, setServiceForm] = useState({
    service_category: "",
    service_subcategory: "",
    years_of_experience: "",
    price_range_min: "",
    price_range_max: "",
    emergency_service_available: false,
    service_description: "",
  });
  const [coverageForm, setCoverageForm] = useState({
    state: "",
    city: "",
    service_radius: "",
    available_days: [] as string[],
    working_hours: {
      start: "",
      end: "",
    },
    instant_booking: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setEditMode(new URLSearchParams(window.location.search).get("edit") === "1");
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.completed_at && !editMode) {
      router.replace("/dashboard/service-provider/onboarding/status");
      return;
    }

    setAccountForm({
      full_name: data.account.full_name ?? "",
      email: data.account.email ?? "",
      phone_number: data.account.phone_number ?? "",
      password: "",
      password_confirmation: "",
    });
    setIdentityForm({
      identification_type: data.identity?.identification_type ?? "nin",
      identification_number: data.identity?.identification_number ?? "",
      id_document: null,
      existing_document_name: data.identity?.document_name ?? null,
    });

    const businessDocument = data.documents.find((document) => document.document_type === "business_document");
    const proofOfAddress = data.documents.find((document) => document.document_type === "proof_of_address");

    setBusinessForm({
      business_name: data.profile.business_name ?? "",
      business_type: data.profile.business_type ?? "",
      cac_registration_number: data.profile.cac_registration_number ?? "",
      business_address: data.profile.business_address ?? "",
      business_document: null,
      proof_of_address: null,
      existing_business_document_name: businessDocument?.original_name ?? null,
      existing_proof_of_address_name: proofOfAddress?.original_name ?? null,
    });
    setServiceForm({
      service_category: data.profile.service_category ?? "",
      service_subcategory: data.profile.service_subcategory ?? "",
      years_of_experience: data.profile.years_of_experience?.toString() ?? "",
      price_range_min: data.profile.price_range_min?.toString() ?? "",
      price_range_max: data.profile.price_range_max?.toString() ?? "",
      emergency_service_available: data.profile.emergency_service_available ?? false,
      service_description: data.profile.service_description ?? "",
    });
    setCoverageForm({
      state: data.profile.state ?? "",
      city: data.profile.city ?? "",
      service_radius: data.profile.service_radius?.toString() ?? "",
      available_days: data.profile.available_days ?? [],
      working_hours: {
        start: data.profile.working_hours?.start ?? "",
        end: data.profile.working_hours?.end ?? "",
      },
      instant_booking: data.profile.instant_booking ?? false,
    });

    const nextStep = Math.min(5, Math.max(1, editMode ? data.current_step : data.current_step));
    setCurrentStep(nextStep);
  }, [data, editMode, router]);

  const completedSteps = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      data.steps.account ? 1 : null,
      data.steps.identity ? 2 : null,
      data.steps.business ? 3 : null,
      data.steps.service ? 4 : null,
      data.steps.coverage ? 5 : null,
    ].filter((value): value is number => value !== null);
  }, [data]);

  async function refreshFromSave(nextData: typeof data) {
    if (!nextData) {
      await reload();
      return;
    }

    setBanner({ type: "success", message: "Step saved successfully." });
    setCurrentStep(Math.min(5, nextData.current_step));
    await reload();
  }

  async function handleAccountContinue() {
    setBanner(null);
    const parsed = accountSchema.safeParse(accountForm);

    if (!parsed.success) {
      setAccountErrors(normalizeErrors(parsed.error));
      return;
    }

    const accountData = parsed.data;
    setAccountErrors({});

    try {
      const response = await save({
        type: "account",
        payload: {
          full_name: accountData.full_name,
          email: accountData.email,
          phone_number: accountData.phone_number,
          password: accountData.password,
          password_confirmation: accountData.password_confirmation,
        },
      });
      await refreshFromSave(response.data);
      setCurrentStep(2);
    } catch (error) {
      setBanner({ type: "error", message: getApiErrorMessage(error, "We could not save your account details.") });
    }
  }

  async function handleIdentityContinue() {
    setBanner(null);
    const parsed = identitySchema.safeParse({
      identification_type: identityForm.identification_type,
      identification_number: identityForm.identification_number,
    });

    const nextErrors = parsed.success ? {} : normalizeErrors(parsed.error);

    if (!identityForm.id_document && !identityForm.existing_document_name) {
      nextErrors.id_document = "Upload a clear photo of your ID.";
    }

    if (Object.keys(nextErrors).length) {
      setIdentityErrors(nextErrors);
      return;
    }

    if (!identityForm.id_document) {
      setIdentityErrors({ id_document: "Select the ID file again before resubmitting this step." });
      return;
    }

    setIdentityErrors({});

    try {
      const response = await save({
        type: "identity",
        payload: {
          identification_type: identityForm.identification_type,
          identification_number: identityForm.identification_number,
          id_document: identityForm.id_document,
        },
      });
      await refreshFromSave(response.data);
      setCurrentStep(3);
    } catch (error) {
      setBanner({ type: "error", message: getApiErrorMessage(error, "We could not save your identity verification.") });
    }
  }

  async function handleBusinessContinue() {
    setBanner(null);
    const parsed = businessSchema.safeParse(businessForm);
    const nextErrors = parsed.success ? {} : normalizeErrors(parsed.error);

    if (!businessForm.business_document && !businessForm.existing_business_document_name) {
      nextErrors.business_document = "Upload your CAC or business document.";
    }

    if (Object.keys(nextErrors).length) {
      setBusinessErrors(nextErrors);
      return;
    }

    const businessData = parsed.data as z.infer<typeof businessSchema>;
    setBusinessErrors({});

    try {
      if (businessForm.business_document) {
        await upload({ document_type: "business_document", document: businessForm.business_document });
      }

      if (businessForm.proof_of_address) {
        await upload({ document_type: "proof_of_address", document: businessForm.proof_of_address });
      }

      const response = await save({
        type: "business",
        payload: {
          business_name: businessData.business_name,
          business_type: businessData.business_type,
          cac_registration_number: businessData.cac_registration_number,
          business_address: businessData.business_address,
        },
      });
      await refreshFromSave(response.data);
      setCurrentStep(4);
    } catch (error) {
      setBanner({ type: "error", message: getApiErrorMessage(error, "We could not save your business documentation.") });
    }
  }

  async function handleServiceContinue() {
    setBanner(null);
    const parsed = serviceSchema.safeParse(serviceForm);

    if (!parsed.success) {
      setServiceErrors(normalizeErrors(parsed.error));
      return;
    }

    const serviceData = parsed.data as z.infer<typeof serviceSchema>;
    setServiceErrors({});

    try {
      const response = await save({
        type: "service",
        payload: {
          ...serviceData,
          years_of_experience: Number(serviceData.years_of_experience),
          price_range_min: Number(serviceData.price_range_min),
          price_range_max: Number(serviceData.price_range_max),
        },
      });
      await refreshFromSave(response.data);
      setCurrentStep(5);
    } catch (error) {
      setBanner({ type: "error", message: getApiErrorMessage(error, "We could not save your service details.") });
    }
  }

  async function handleCoverageContinue() {
    setBanner(null);
    const parsed = coverageSchema.safeParse(coverageForm);

    if (!parsed.success) {
      setCoverageErrors(normalizeErrors(parsed.error));
      return;
    }

    const coverageData = parsed.data as z.infer<typeof coverageSchema>;
    setCoverageErrors({});

    try {
      const response = await save({
        type: "coverage",
        payload: {
          ...coverageData,
          service_radius: Number(coverageData.service_radius),
        },
      });
      await refreshFromSave(response.data);
      router.push("/dashboard/service-provider/onboarding/status");
    } catch (error) {
      setBanner({ type: "error", message: getApiErrorMessage(error, "We could not save your coverage area.") });
    }
  }

  if (loading) {
    return <ProviderOnboardingSkeleton />;
  }

  if (error || !data) {
    return (
      <ProviderOnboardingShell currentStep={currentStep}>
        <div className="rounded-[2.2rem] bg-white px-8 py-12 shadow-[0_24px_45px_rgba(20,83,45,0.08)]">
          <p className="text-lg text-red-700">{error ?? "We could not load your onboarding details."}</p>
          <button className="mt-6 rounded-2xl bg-[#003b1b] px-6 py-3 text-white" onClick={() => void reload()} type="button">
            Try Again
          </button>
        </div>
      </ProviderOnboardingShell>
    );
  }

  return (
    <ProviderOnboardingShell currentStep={currentStep} completedSteps={completedSteps}>
      <section className="rounded-[2.2rem] bg-white px-8 py-10 shadow-[0_24px_45px_rgba(20,83,45,0.08)] md:px-14 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#c8efd1] text-[#003b1b]">
            <Fingerprint className="size-8" />
          </div>
          <div>
            <h2 className="text-[2.6rem] font-bold tracking-[-0.05em] text-[#003b1b]">{stepTitle(currentStep)}</h2>
            <p className="mt-2 max-w-3xl text-xl leading-9 text-[#304236]">{stepDescription(currentStep)}</p>
          </div>
        </div>

        {banner ? (
          <div className={`mt-8 rounded-2xl px-5 py-4 text-base ${banner.type === "success" ? "bg-[#ebfff1] text-[#0b5f31]" : "bg-[#fff0ee] text-[#9f2d20]"}`}>
            {banner.message}
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Full name</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={accountForm.full_name} onChange={(event) => setAccountForm((value) => ({ ...value, full_name: event.target.value }))} />
                {accountErrors.full_name ? <p className="mt-2 text-sm text-red-700">{accountErrors.full_name}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Email</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={accountForm.email} onChange={(event) => setAccountForm((value) => ({ ...value, email: event.target.value }))} />
                {accountErrors.email ? <p className="mt-2 text-sm text-red-700">{accountErrors.email}</p> : null}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Phone number</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={accountForm.phone_number} onChange={(event) => setAccountForm((value) => ({ ...value, phone_number: event.target.value }))} />
                {accountErrors.phone_number ? <p className="mt-2 text-sm text-red-700">{accountErrors.phone_number}</p> : null}
              </div>
              <div />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Password</label>
                <Input type="password" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={accountForm.password} onChange={(event) => setAccountForm((value) => ({ ...value, password: event.target.value }))} />
                {accountErrors.password ? <p className="mt-2 text-sm text-red-700">{accountErrors.password}</p> : <p className="mt-2 text-sm text-[#56695c]">Leave blank if you do not want to change your password.</p>}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Confirm password</label>
                <Input type="password" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={accountForm.password_confirmation} onChange={(event) => setAccountForm((value) => ({ ...value, password_confirmation: event.target.value }))} />
                {accountErrors.password_confirmation ? <p className="mt-2 text-sm text-red-700">{accountErrors.password_confirmation}</p> : null}
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-10 md:flex-row md:items-center md:justify-between">
              <p className="text-base text-[#56695c]">
                Account already exists?{" "}
                <Link href="/auth/login" className="font-semibold text-[#003b1b] underline">
                  Login here
                </Link>
              </p>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#003b1b] px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(0,59,27,0.18)] transition hover:bg-[#064b2b] disabled:opacity-60" onClick={() => void handleAccountContinue()} disabled={saving} type="button">
                {saving ? <LoaderCircle className="size-5 animate-spin" /> : "Continue"}
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="mt-10 space-y-8">
            <div>
              <p className="mb-4 text-xl font-medium text-[#0b1c30]">Select Identification Type</p>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { value: "nin", label: "National ID (NIN)" },
                  { value: "voters_card", label: "Voter's Card" },
                ].map((option) => {
                  const active = identityForm.identification_type === option.value;
                  return (
                    <button
                      key={option.value}
                      className={`flex h-20 items-center gap-4 rounded-2xl border px-6 text-left text-[1.05rem] transition ${active ? "border-[#003b1b] bg-[#f4f8f4] text-[#0b1c30]" : "border-[#c6d2c3] bg-white text-[#33473a]"}`}
                      onClick={() => setIdentityForm((value) => ({ ...value, identification_type: option.value as "nin" | "voters_card" }))}
                      type="button"
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${active ? "border-[#003b1b] bg-[#003b1b] text-white" : "border-[#c6d2c3] bg-white text-transparent"}`}>
                        <span className={`h-3.5 w-3.5 rounded-full ${active ? "bg-white" : "bg-transparent"}`} />
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-lg font-medium text-[#0b1c30]">
                {identityForm.identification_type === "nin" ? "NIN Number (11 Digits)" : "Voter's Card Number"}
              </label>
              <Input
                className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] px-5 text-xl focus:border-[#003b1b]"
                placeholder={identityForm.identification_type === "nin" ? "Enter your National Identity Number" : "Enter your voter's card number"}
                value={identityForm.identification_number}
                onChange={(event) => setIdentityForm((value) => ({ ...value, identification_number: event.target.value }))}
              />
              {identityErrors.identification_number ? <p className="mt-2 text-sm text-red-700">{identityErrors.identification_number}</p> : null}
              <p className="mt-3 text-lg italic text-[#6c716c]">Your data is encrypted and stored according to NDPR guidelines.</p>
            </div>

            <FileDropzone
              label="Upload a Clear Photo of your ID"
              file={identityForm.id_document}
              existingFileName={identityForm.existing_document_name}
              onChange={(file) => setIdentityForm((value) => ({ ...value, id_document: file, existing_document_name: file ? value.existing_document_name : null }))}
            />
            {identityErrors.id_document ? <p className="-mt-4 text-sm text-red-700">{identityErrors.id_document}</p> : null}

            <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
              <button className="inline-flex items-center gap-3 text-lg font-medium text-[#23352c] transition hover:text-[#003b1b]" onClick={() => setCurrentStep(1)} type="button">
                <ArrowLeft className="size-5" />
                Previous Step
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#003b1b] px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(0,59,27,0.18)] transition hover:bg-[#064b2b] disabled:opacity-60" onClick={() => void handleIdentityContinue()} disabled={saving} type="button">
                {saving ? <LoaderCircle className="size-5 animate-spin" /> : "Save and Continue"}
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Business Name</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={businessForm.business_name} onChange={(event) => setBusinessForm((value) => ({ ...value, business_name: event.target.value }))} />
                {businessErrors.business_name ? <p className="mt-2 text-sm text-red-700">{businessErrors.business_name}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Business Type</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={businessForm.business_type} onChange={(event) => setBusinessForm((value) => ({ ...value, business_type: event.target.value }))} />
                {businessErrors.business_type ? <p className="mt-2 text-sm text-red-700">{businessErrors.business_type}</p> : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">CAC Registration Number</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={businessForm.cac_registration_number} onChange={(event) => setBusinessForm((value) => ({ ...value, cac_registration_number: event.target.value }))} />
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Business Address</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={businessForm.business_address} onChange={(event) => setBusinessForm((value) => ({ ...value, business_address: event.target.value }))} />
                {businessErrors.business_address ? <p className="mt-2 text-sm text-red-700">{businessErrors.business_address}</p> : null}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div>
                <FileDropzone label="Upload CAC / Business Document" file={businessForm.business_document} existingFileName={businessForm.existing_business_document_name} onChange={(file) => setBusinessForm((value) => ({ ...value, business_document: file, existing_business_document_name: file ? value.existing_business_document_name : null }))} />
                {businessErrors.business_document ? <p className="mt-2 text-sm text-red-700">{businessErrors.business_document}</p> : null}
              </div>
              <div>
                <FileDropzone label="Upload Proof of Address (Optional)" file={businessForm.proof_of_address} existingFileName={businessForm.existing_proof_of_address_name} onChange={(file) => setBusinessForm((value) => ({ ...value, proof_of_address: file, existing_proof_of_address_name: file ? value.existing_proof_of_address_name : null }))} />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
              <button className="inline-flex items-center gap-3 text-lg font-medium text-[#23352c] transition hover:text-[#003b1b]" onClick={() => setCurrentStep(2)} type="button">
                <ArrowLeft className="size-5" />
                Previous Step
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#003b1b] px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(0,59,27,0.18)] transition hover:bg-[#064b2b] disabled:opacity-60" onClick={() => void handleBusinessContinue()} disabled={saving || uploading} type="button">
                {saving || uploading ? <LoaderCircle className="size-5 animate-spin" /> : "Save and Continue"}
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Service Category</label>
                <select className="h-14 w-full rounded-[1.3rem] border border-[#c6d2c3] bg-[#eef4ff] px-5 text-lg text-[#0b1c30] outline-none focus:border-[#003b1b]" value={serviceForm.service_category} onChange={(event) => setServiceForm((value) => ({ ...value, service_category: event.target.value }))}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {serviceErrors.service_category ? <p className="mt-2 text-sm text-red-700">{serviceErrors.service_category}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Service Subcategory</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={serviceForm.service_subcategory} onChange={(event) => setServiceForm((value) => ({ ...value, service_subcategory: event.target.value }))} />
                {serviceErrors.service_subcategory ? <p className="mt-2 text-sm text-red-700">{serviceErrors.service_subcategory}</p> : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Years of Experience</label>
                <Input type="number" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={serviceForm.years_of_experience} onChange={(event) => setServiceForm((value) => ({ ...value, years_of_experience: event.target.value }))} />
                {serviceErrors.years_of_experience ? <p className="mt-2 text-sm text-red-700">{serviceErrors.years_of_experience}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Minimum Price (₦)</label>
                <Input type="number" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={serviceForm.price_range_min} onChange={(event) => setServiceForm((value) => ({ ...value, price_range_min: event.target.value }))} />
                {serviceErrors.price_range_min ? <p className="mt-2 text-sm text-red-700">{serviceErrors.price_range_min}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Maximum Price (₦)</label>
                <Input type="number" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={serviceForm.price_range_max} onChange={(event) => setServiceForm((value) => ({ ...value, price_range_max: event.target.value }))} />
                {serviceErrors.price_range_max ? <p className="mt-2 text-sm text-red-700">{serviceErrors.price_range_max}</p> : null}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#c6d2c3] bg-[#f8fbff] px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[#0b1c30]">Emergency service available</p>
                  <p className="text-base text-[#56695c]">Let customers know if you can handle urgent requests.</p>
                </div>
                <button className={`relative h-8 w-16 rounded-full transition ${serviceForm.emergency_service_available ? "bg-[#003b1b]" : "bg-[#c8d3dd]"}`} onClick={() => setServiceForm((value) => ({ ...value, emergency_service_available: !value.emergency_service_available }))} type="button">
                  <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${serviceForm.emergency_service_available ? "left-9" : "left-1"}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Short Service Description</label>
              <Textarea className="min-h-[180px] rounded-[1.6rem] border-[#c6d2c3] bg-[#eef4ff] px-5 py-4 text-lg focus:border-[#003b1b]" value={serviceForm.service_description} onChange={(event) => setServiceForm((value) => ({ ...value, service_description: event.target.value }))} />
              {serviceErrors.service_description ? <p className="mt-2 text-sm text-red-700">{serviceErrors.service_description}</p> : null}
            </div>

            <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
              <button className="inline-flex items-center gap-3 text-lg font-medium text-[#23352c] transition hover:text-[#003b1b]" onClick={() => setCurrentStep(3)} type="button">
                <ArrowLeft className="size-5" />
                Previous Step
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#003b1b] px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(0,59,27,0.18)] transition hover:bg-[#064b2b] disabled:opacity-60" onClick={() => void handleServiceContinue()} disabled={saving} type="button">
                {saving ? <LoaderCircle className="size-5 animate-spin" /> : "Save and Continue"}
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">State</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={coverageForm.state} onChange={(event) => setCoverageForm((value) => ({ ...value, state: event.target.value }))} />
                {coverageErrors.state ? <p className="mt-2 text-sm text-red-700">{coverageErrors.state}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">City / LGA</label>
                <Input className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={coverageForm.city} onChange={(event) => setCoverageForm((value) => ({ ...value, city: event.target.value }))} />
                {coverageErrors.city ? <p className="mt-2 text-sm text-red-700">{coverageErrors.city}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Service Radius (km)</label>
                <Input type="number" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={coverageForm.service_radius} onChange={(event) => setCoverageForm((value) => ({ ...value, service_radius: event.target.value }))} />
                {coverageErrors.service_radius ? <p className="mt-2 text-sm text-red-700">{coverageErrors.service_radius}</p> : null}
              </div>
            </div>

            <div>
              <p className="mb-4 text-lg font-medium text-[#0b1c30]">Available Days</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {weekdays.map((day) => {
                  const active = coverageForm.available_days.includes(day);
                  return (
                    <button
                      key={day}
                      className={`rounded-2xl border px-4 py-4 text-left text-base transition ${active ? "border-[#003b1b] bg-[#eaf7ee] text-[#003b1b]" : "border-[#c6d2c3] bg-white text-[#304236]"}`}
                      onClick={() =>
                        setCoverageForm((value) => ({
                          ...value,
                          available_days: active ? value.available_days.filter((item) => item !== day) : [...value.available_days, day],
                        }))
                      }
                      type="button"
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {coverageErrors.available_days ? <p className="mt-2 text-sm text-red-700">{coverageErrors.available_days}</p> : null}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Working Hours Start</label>
                <Input type="time" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={coverageForm.working_hours.start} onChange={(event) => setCoverageForm((value) => ({ ...value, working_hours: { ...value.working_hours, start: event.target.value } }))} />
                {coverageErrors["working_hours.start"] ? <p className="mt-2 text-sm text-red-700">{coverageErrors["working_hours.start"]}</p> : null}
              </div>
              <div>
                <label className="mb-3 block text-lg font-medium text-[#0b1c30]">Working Hours End</label>
                <Input type="time" className="rounded-[1.3rem] border-[#c6d2c3] bg-[#eef4ff] focus:border-[#003b1b]" value={coverageForm.working_hours.end} onChange={(event) => setCoverageForm((value) => ({ ...value, working_hours: { ...value.working_hours, end: event.target.value } }))} />
                {coverageErrors["working_hours.end"] ? <p className="mt-2 text-sm text-red-700">{coverageErrors["working_hours.end"]}</p> : null}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#c6d2c3] bg-[#f8fbff] px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[#0b1c30]">Instant booking</p>
                  <p className="text-base text-[#56695c]">Allow residents to book you immediately without manual approval.</p>
                </div>
                <button className={`relative h-8 w-16 rounded-full transition ${coverageForm.instant_booking ? "bg-[#003b1b]" : "bg-[#c8d3dd]"}`} onClick={() => setCoverageForm((value) => ({ ...value, instant_booking: !value.instant_booking }))} type="button">
                  <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${coverageForm.instant_booking ? "left-9" : "left-1"}`} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
              <button className="inline-flex items-center gap-3 text-lg font-medium text-[#23352c] transition hover:text-[#003b1b]" onClick={() => setCurrentStep(4)} type="button">
                <ArrowLeft className="size-5" />
                Previous Step
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#003b1b] px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(0,59,27,0.18)] transition hover:bg-[#064b2b] disabled:opacity-60" onClick={() => void handleCoverageContinue()} disabled={saving} type="button">
                {saving ? <LoaderCircle className="size-5 animate-spin" /> : "Submit for Review"}
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </ProviderOnboardingShell>
  );
}
