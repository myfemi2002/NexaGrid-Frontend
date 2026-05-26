import type { Product } from "@/types";

export type MarketplaceSectionProduct = Product & {
  badge?: string;
  discountPercent?: number;
  claimedPercent?: number;
  statusText?: string;
};
