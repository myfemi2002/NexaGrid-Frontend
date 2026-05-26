import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-14 w-full rounded-2xl border border-line bg-white px-4 text-base text-charcoal outline-none placeholder:text-warm-gray focus:border-emerald",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
