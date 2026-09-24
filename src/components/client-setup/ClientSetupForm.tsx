"use client";

import { useEffect, useMemo, useState } from "react";
import { CampaignHeader } from "./CampaignHeader";
import { SetupChecklist, type StepStatus } from "./SetupChecklist";
import { StepProgress } from "./StepProgress";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { ProductPricingStep } from "./steps/ProductPricingStep";
import { DeliveryPaymentStep } from "./steps/DeliveryPaymentStep";
import { CustomerSalesStep } from "./steps/CustomerSalesStep";
import { PreviousMarketingStep } from "./steps/PreviousMarketingStep";
import { CampaignAssetsStep } from "./steps/CampaignAssetsStep";
import { ReviewSubmitStep } from "./steps/ReviewSubmitStep";
import type { UploadItem } from "./uploadTypes";
import { getCampaignConfig } from "@/lib/client-setup/campaigns";
import { ASSET_CATEGORIES, type AssetCategoryId } from "@/lib/client-setup/constants";
import {
  emptyContact,
  emptyCustomerSales,
  emptyDeliveryPayment,
  emptyPreviousMarketing,
  emptyProductPricing,
  isCustomersStepComplete,
  isDeliveryStepComplete,
  isMarketingStepComplete,
  isProductStepComplete,
  type AssetFile,
  type ContactValues,
  type CustomerSalesValues,
  type DeliveryPaymentValues,
  type PreviousMarketingValues,
  type ProductPricingValues,
} from "@/lib/client-setup/schema";

type PersistedAssets = AssetFile[];

type FormState = {
  clientDraftId: string;
  step: number;
  maxStepReached: number;
  product: ProductPricingValues;
  delivery: DeliveryPaymentValues;
  customers: CustomerSalesValues;
  marketing: PreviousMarketingValues;
  contact: ContactValues;
  assetsByCategory: Record<AssetCategoryId, UploadItem[]>;
};

function emptyAssetsByCategory(): Record<AssetCategoryId, UploadItem[]> {
  return Object.fromEntries(ASSET_CATEGORIES.map((c) => [c.id, []])) as unknown as Record<
    AssetCategoryId,
    UploadItem[]
  >;
}

function assetsByCategoryFrom(assets: PersistedAssets): Record<AssetCategoryId, UploadItem[]> {
  const grouped = emptyAssetsByCategory();
  for (const asset of assets) {
    const categoryId = asset.category as AssetCategoryId;
    if (!grouped[categoryId]) continue;
    grouped[categoryId] = [
      ...grouped[categoryId],
      {
        localId: asset.fileId,
        name: asset.name,
        size: asset.size,
        status: "done",
        progress: 100,
        result: asset,
      },
    ];
  }
  return grouped;
}

function createDraftId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function initialFormState(): FormState {
  return {
    clientDraftId: "",
    step: 1,
    maxStepReached: 1,
    product: emptyProductPricing,
    delivery: emptyDeliveryPayment,
    customers: emptyCustomerSales,
    marketing: emptyPreviousMarketing,
    contact: emptyContact,
    assetsByCategory: emptyAssetsByCategory(),
  };
}

export function ClientSetupForm({
  campaignId,
  campaignName,
  token,
}: {
  campaignId?: string;
  campaignName?: string;
  token?: string;
}) {
  const campaign = useMemo(() => {
    const base = getCampaignConfig(campaignId);
    const name = campaignName?.trim();
    return name ? { ...base, campaignName: name } : base;
  }, [campaignId, campaignName]);
  const storageKey = `kudziemuks-client-setup:${token ?? campaign.id}`;

  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<FormState>(initialFormState);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [submissionId, setSubmissionId] = useState<string>();

  // Hydrate from localStorage on mount — a single setState call so this
  // doesn't trigger cascading renders.
  useEffect(() => {
    let next: FormState;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          clientDraftId?: string;
          step?: number;
          maxStepReached?: number;
          product?: ProductPricingValues;
          delivery?: DeliveryPaymentValues;
          customers?: CustomerSalesValues;
          marketing?: PreviousMarketingValues;
          contact?: ContactValues;
          assets?: PersistedAssets;
        };
        next = {
          clientDraftId: parsed.clientDraftId || createDraftId(),
          step: parsed.step || 1,
          maxStepReached: Math.max(parsed.maxStepReached ?? 1, parsed.step ?? 1),
          product: parsed.product ?? emptyProductPricing,
          delivery: parsed.delivery ?? emptyDeliveryPayment,
          customers: parsed.customers ?? emptyCustomerSales,
          marketing: parsed.marketing ?? emptyPreviousMarketing,
          contact: parsed.contact ?? emptyContact,
          assetsByCategory: assetsByCategoryFrom(parsed.assets ?? []),
        };
      } else {
        next = { ...initialFormState(), clientDraftId: createDraftId() };
      }
    } catch {
      next = { ...initialFormState(), clientDraftId: createDraftId() };
    }
    // Reading localStorage must happen post-mount (the server has no
    // `window`), so this legitimately needs a one-time setState-in-effect
    // to adopt any saved draft without causing a server/client hydration
    // mismatch (the component renders null until `hydrated` is true).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
    setHydrated(true);
  }, [storageKey]);

  const flatAssets: AssetFile[] = useMemo(
    () =>
      Object.values(state.assetsByCategory)
        .flat()
        .filter((item): item is UploadItem & { result: AssetFile } => item.status === "done" && !!item.result)
        .map((item) => item.result),
    [state.assetsByCategory],
  );

  // Persist to localStorage whenever meaningful state changes.
  useEffect(() => {
    if (!hydrated || submissionId) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          clientDraftId: state.clientDraftId,
          step: state.step,
          maxStepReached: state.maxStepReached,
          product: state.product,
          delivery: state.delivery,
          customers: state.customers,
          marketing: state.marketing,
          contact: state.contact,
          assets: flatAssets,
        }),
      );
    } catch {
      // Local storage may be unavailable (private browsing, quota) — safe to ignore.
    }
  }, [hydrated, submissionId, storageKey, state, flatAssets]);

  const goNext = () =>
    setState((s) => {
      const step = Math.min(s.step + 1, 6);
      return { ...s, step, maxStepReached: Math.max(s.maxStepReached, step) };
    });
  const goBack = () => setState((s) => ({ ...s, step: Math.max(s.step - 1, 1) }));
  const setStep = (step: number) =>
    setState((s) => ({ ...s, step, maxStepReached: Math.max(s.maxStepReached, step) }));

  const setProduct = (product: ProductPricingValues) => setState((s) => ({ ...s, product }));
  const setDelivery = (delivery: DeliveryPaymentValues) => setState((s) => ({ ...s, delivery }));
  const setCustomers = (customers: CustomerSalesValues) => setState((s) => ({ ...s, customers }));
  const setMarketing = (marketing: PreviousMarketingValues) => setState((s) => ({ ...s, marketing }));
  const setContact = (contact: ContactValues) => setState((s) => ({ ...s, contact }));

  const handleCategoryChange = (category: AssetCategoryId, items: UploadItem[]) => {
    setState((s) => ({
      ...s,
      assetsByCategory: { ...s.assetsByCategory, [category]: items },
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(undefined);

    try {
      const response = await fetch("/api/client-setup/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          token,
          clientDraftId: state.clientDraftId,
          product: state.product,
          delivery: state.delivery,
          customers: state.customers,
          marketing: state.marketing,
          contact: state.contact,
          assets: flatAssets,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setSubmitError(body.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmissionId(body.submissionId);
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Non-fatal.
      }
    } catch {
      setSubmitError(
        "We couldn't reach the server. Please check your connection and try again — your answers are still saved.",
      );
      setSubmitting(false);
    }
  };

  // A step the client has never reached yet is always "upcoming", even one
  // with no required fields (Campaign Assets) — otherwise it would read as
  // complete before they've seen it. Once a step has been visited, its
  // status reflects its *current* data, so going back to an earlier step
  // doesn't wrongly "uncomplete" later steps whose answers are still saved,
  // and clearing a required field on a visited step correctly drops it back.
  const statuses: StepStatus[] = [1, 2, 3, 4, 5, 6].map((stepNumber) => {
    if (stepNumber === state.step) return "current";
    if (stepNumber > state.maxStepReached) return "upcoming";
    switch (stepNumber) {
      case 1:
        return isProductStepComplete(state.product) ? "completed" : "upcoming";
      case 2:
        return isDeliveryStepComplete(state.delivery) ? "completed" : "upcoming";
      case 3:
        return isCustomersStepComplete(state.customers) ? "completed" : "upcoming";
      case 4:
        return isMarketingStepComplete(state.marketing) ? "completed" : "upcoming";
      case 5:
        return "completed";
      default:
        return "upcoming";
    }
  });

  if (!hydrated) return null;

  if (submissionId) {
    return <SubmissionSuccess campaign={campaign} submissionId={submissionId} />;
  }

  return (
    <div>
      <CampaignHeader campaign={campaign} />

      <div className="mt-10 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="hidden lg:sticky lg:top-12 lg:block">
          <SetupChecklist statuses={statuses} onSelectStep={setStep} />
        </aside>

        <div className="min-w-0 lg:max-w-2xl">
          <StepProgress step={state.step} />

          <div className="mt-8 lg:mt-0">
            {state.step === 1 ? (
              <ProductPricingStep
                productName={campaign.product}
                values={state.product}
                onChange={setProduct}
                onNext={goNext}
              />
            ) : null}
            {state.step === 2 ? (
              <DeliveryPaymentStep
                productName={campaign.product}
                values={state.delivery}
                onChange={setDelivery}
                onNext={goNext}
                onBack={goBack}
              />
            ) : null}
            {state.step === 3 ? (
              <CustomerSalesStep
                values={state.customers}
                onChange={setCustomers}
                onNext={goNext}
                onBack={goBack}
              />
            ) : null}
            {state.step === 4 ? (
              <PreviousMarketingStep
                productName={campaign.product}
                values={state.marketing}
                onChange={setMarketing}
                onNext={goNext}
                onBack={goBack}
              />
            ) : null}
            {state.step === 5 ? (
              <CampaignAssetsStep
                campaignId={campaign.id}
                productName={campaign.product}
                assetsByCategory={state.assetsByCategory}
                onCategoryChange={handleCategoryChange}
                onNext={goNext}
                onBack={goBack}
              />
            ) : null}
            {state.step === 6 ? (
              <ReviewSubmitStep
                productName={campaign.product}
                product={state.product}
                delivery={state.delivery}
                customers={state.customers}
                marketing={state.marketing}
                assets={flatAssets}
                contact={state.contact}
                onContactChange={setContact}
                onEditStep={setStep}
                onBack={goBack}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
