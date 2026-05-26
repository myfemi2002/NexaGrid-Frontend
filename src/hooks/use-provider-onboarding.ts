"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchProviderOnboarding,
  type ProviderOnboardingData,
  type ProviderOnboardingDocument,
  saveProviderOnboardingAccount,
  saveProviderOnboardingBusiness,
  saveProviderOnboardingCoverage,
  saveProviderOnboardingIdentity,
  saveProviderOnboardingService,
  uploadProviderOnboardingDocument,
} from "@/services/provider-onboarding-service";

export function useProviderOnboarding() {
  const [data, setData] = useState<ProviderOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProviderOnboarding();
      setData(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not load your onboarding details.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    loading,
    error,
    setData,
    reload,
  };
}

type SaveStepAction =
  | { type: "account"; payload: Parameters<typeof saveProviderOnboardingAccount>[0] }
  | { type: "identity"; payload: Parameters<typeof saveProviderOnboardingIdentity>[0] }
  | { type: "business"; payload: Parameters<typeof saveProviderOnboardingBusiness>[0] }
  | { type: "service"; payload: Parameters<typeof saveProviderOnboardingService>[0] }
  | { type: "coverage"; payload: Parameters<typeof saveProviderOnboardingCoverage>[0] };

export function useSaveOnboardingStep() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (action: SaveStepAction) => {
    setSaving(true);
    setError(null);

    try {
      switch (action.type) {
        case "account":
          return await saveProviderOnboardingAccount(action.payload);
        case "identity":
          return await saveProviderOnboardingIdentity(action.payload);
        case "business":
          return await saveProviderOnboardingBusiness(action.payload);
        case "service":
          return await saveProviderOnboardingService(action.payload);
        case "coverage":
          return await saveProviderOnboardingCoverage(action.payload);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not save this step.";
      setError(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    save,
    saving,
    error,
  };
}

export function useUploadProviderDocument() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (payload: {
    document_type: "business_document" | "proof_of_address";
    document: File;
  }): Promise<ProviderOnboardingDocument> => {
    setUploading(true);
    setError(null);

    try {
      const response = await uploadProviderOnboardingDocument(payload);
      return response.data.document;
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not upload the document.";
      setError(message);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    upload,
    uploading,
    error,
  };
}
