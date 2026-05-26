"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { MarketplaceSectionProduct } from "@/components/marketplace/types";

type FlashSaleCardProps = {
  product: MarketplaceSectionProduct;
};

export function FlashSaleCard({ product }: FlashSaleCardProps) {
  const claimed = Math.max(10, Math.min(product.claimedPercent ?? 55, 96));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="min-w-[220px] rounded-2xl bg-white p-2 shadow-[0_18px_36px_-24px_rgba(0,59,27,0.24)] sm:min-w-0"
    >
      <Link href={`/marketplace/products/${product.slug ?? product.id}`} className="block">
        <div className="relative">
          <img src={product.image} alt={product.name} className="aspect-[1/1] w-full rounded-[1rem] object-cover" />
          <span className="absolute left-2 top-2 rounded-md bg-[#d62f2f] px-2 py-1 text-[10px] font-bold text-white">
            -{product.discountPercent ?? 20}%
          </span>
        </div>
      </Link>
      <div className="px-1 pb-1 pt-3">
        <h3 className="line-clamp-2 text-sm font-medium text-[#15202b]">{product.name}</h3>
        <div className="mt-2 flex items-end gap-2">
          <p className="font-['Space_Grotesk',sans-serif] text-[1.1rem] font-bold text-[#111827]">
            {formatCurrency(product.price)}
          </p>
          {product.originalPrice ? (
            <p className="text-xs text-[#9aa4af] line-through">{formatCurrency(product.originalPrice)}</p>
          ) : null}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8edf3]">
          <div className="h-full rounded-full bg-[#d9422f]" style={{ width: `${claimed}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-[#738091]">{claimed}% claimed</p>
      </div>
    </motion.div>
  );
}
