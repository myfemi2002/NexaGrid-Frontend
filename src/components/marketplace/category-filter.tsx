"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CategoryFilterProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <motion.button
            key={category}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(category)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition",
              active
                ? "bg-[#003b1b] text-white shadow-[0_12px_22px_-16px_rgba(0,59,27,0.55)]"
                : "bg-[#eaf1fb] text-[#516172] hover:bg-[#dde8f7]"
            )}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}
