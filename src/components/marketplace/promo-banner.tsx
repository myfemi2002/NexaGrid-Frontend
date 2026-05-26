"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { MarketplaceSectionProduct } from "@/components/marketplace/types";

type PromoBannerProps = {
  product: MarketplaceSectionProduct;
  tone?: "green" | "gold";
};

export function PromoBanner({ product, tone = "green" }: PromoBannerProps) {
  const palette =
    tone === "green"
      ? {
          card: "bg-[#014b24]",
          text: "text-white",
          muted: "text-[#dcebdc]",
          button: "bg-white text-[#014b24]",
        }
      : {
          card: "bg-[#8a5a00]",
          text: "text-white",
          muted: "text-[#f6dba4]",
          button: "bg-[#014b24] text-white",
        };

  return (
    <motion.div whileHover={{ y: -3 }} className={`rounded-[1.8rem] p-4 shadow-[0_20px_40px_-28px_rgba(0,59,27,0.38)] ${palette.card}`}>
      <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <img src={product.image} alt={product.name} className="h-32 w-full rounded-[1.2rem] object-cover sm:w-44" />
          <span className="absolute right-2 top-2 rounded-md bg-[#d62f2f] px-2 py-1 text-[10px] font-bold text-white">
            -{product.discountPercent ?? 35}%
          </span>
        </div>
        <div className="flex-1">
          <h3 className={`font-['Space_Grotesk',sans-serif] text-2xl font-bold ${palette.text}`}>{product.name}</h3>
          <p className={`mt-2 max-w-md text-sm leading-6 ${palette.muted}`}>
            Exclusive half-price deal for members. Limited units available while demand stays high.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className={`font-['Space_Grotesk',sans-serif] text-[1.85rem] font-bold ${palette.text}`}>
              {formatCurrency(product.price)}
            </p>
            <Link
              href={`/marketplace/products/${product.slug ?? product.id}`}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 ${palette.button}`}
            >
              Claim Now
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
