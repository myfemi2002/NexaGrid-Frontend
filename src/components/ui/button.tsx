"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-emerald bg-emerald px-5 py-3 text-white hover:bg-emerald-dark",
        secondary: "border-line bg-white px-5 py-3 text-charcoal hover:border-emerald hover:text-emerald",
        subtle: "border-transparent bg-muted px-4 py-2 text-charcoal hover:bg-white",
        gold: "border-gold bg-gold px-5 py-3 text-charcoal hover:opacity-90",
      },
      size: {
        default: "h-12",
        sm: "h-10 px-4",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
