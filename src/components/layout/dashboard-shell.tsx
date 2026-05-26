"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { dashboardStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function DashboardShell({
  slug,
  title,
  subtitle,
  children,
}: {
  slug: keyof typeof dashboardStats;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-5xl font-bold text-emerald md:text-6xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-xl text-warm-gray">{subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats[slug].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn("min-h-40", index === 0 && slug === "logistics" && "bg-emerald text-white")}>
              <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", index === 0 && slug === "logistics" ? "text-white/70" : "text-warm-gray")}>
                {card.label}
              </p>
              <p className="mt-5 font-heading text-5xl font-bold">{card.value}</p>
              <p className={cn("mt-4 text-sm", card.tone === "success" && "text-emerald", card.tone === "warning" && "text-[#7a4311]", !card.tone && "text-warm-gray", index === 0 && slug === "logistics" && "text-white/80")}>
                {card.delta}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
