"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { MarketplaceSectionProduct } from "@/components/marketplace/types";

type ProductCardProps = {
  product: MarketplaceSectionProduct;
  onAddToCart?: (product: MarketplaceSectionProduct) => void;
  inCart?: boolean;
  onToggleWishlist?: (product: MarketplaceSectionProduct) => void;
  inWishlist?: boolean;
  onToggleCompare?: (product: MarketplaceSectionProduct) => void;
  inCompare?: boolean;
};

export function ProductCard({
  product,
  onAddToCart,
  inCart = false,
  onToggleWishlist,
  inWishlist = false,
  onToggleCompare,
  inCompare = false,
}: ProductCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white p-2 shadow-[0_18px_36px_-24px_rgba(0,59,27,0.28)] transition">
      <div className="relative">
        <Link href={`/marketplace/products/${product.slug ?? product.id}`} className="block">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[0.95/1] w-full rounded-[1.1rem] object-cover"
          />
        </Link>
        <button
          type="button"
          onClick={() => onToggleWishlist?.(product)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition ${
            inWishlist ? "bg-[#003b1b] text-white" : "bg-white/90 text-[#203447] hover:text-[#003b1b]"
          }`}
        >
          <Heart className={`size-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="px-1 pb-1 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7885]">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[#15202b]">{product.name}</h3>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-[1.15rem] font-bold text-[#111827]">
              {formatCurrency(product.price)}
            </p>
            <button
              type="button"
              onClick={() => onToggleCompare?.(product)}
              className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold transition ${
                inCompare ? "text-[#003b1b]" : "text-[#607087] hover:text-[#003b1b]"
              }`}
            >
              <GitCompareArrows className="size-3.5" />
              {inCompare ? "In Compare" : "Compare"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
              inCart
                ? "bg-[#003b1b] text-white"
                : "bg-[#edf4ff] text-[#203447] hover:bg-[#003b1b] hover:text-white"
            }`}
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">{inCart ? "Added" : ""}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
