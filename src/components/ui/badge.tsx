import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold",
        tone === "success" && "border-emerald/20 bg-[#b1f2be] text-emerald-dark",
        tone === "warning" && "border-gold/20 bg-[#ffddb3] text-[#633f00]",
        tone === "default" && "border-line bg-muted text-charcoal",
      )}
    >
      {children}
    </span>
  );
}
