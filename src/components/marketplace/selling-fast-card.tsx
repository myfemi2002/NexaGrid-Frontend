"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { MarketplaceSectionProduct } from "@/components/marketplace/types";

type SellingFastCardProps = {
  product: MarketplaceSectionProduct;
  onAddToCart?: (product: MarketplaceSectionProduct) => void;
  inCart?: boolean;
};

export function SellingFastCard({ product, onAddToCart, inCart = false }: SellingFastCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-[0_16px_34px_-24px_rgba(0,59,27,0.25)]"
    >
      <Link href={`/marketplace/products/${product.slug ?? product.id}`} className="shrink-0">
        <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20" />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-[#15202b]">{product.name}</h3>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#de4b36]">
          {product.statusText ?? "Selling Fast"}
        </p>
        <p className="mt-2 font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#111827]">
          {formatCurrency(product.price)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAddToCart?.(product)}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
          inCart
            ? "bg-[#003b1b] text-white"
            : "bg-[#f4f7fd] text-[#15202b] hover:bg-[#003b1b] hover:text-white"
        }`}
      >
        {inCart ? "Added" : "Add to Cart"}
      </button>
    </motion.div>
  );
}
