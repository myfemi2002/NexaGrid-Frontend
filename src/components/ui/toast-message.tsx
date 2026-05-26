"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { useEffect } from "react";

type ToastMessageProps = {
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export function ToastMessage({
  message,
  variant = "success",
  onClose,
  duration = 2800,
}: ToastMessageProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration, onClose]);

  const tone =
    variant === "success"
      ? {
          wrapper: "border-[#b1f2be] bg-[#ecfff0] text-[#12512c]",
          icon: <CheckCircle2 className="h-5 w-5 shrink-0" />,
        }
      : {
          wrapper: "border-[#ffdad6] bg-[#fff1ef] text-[#93000a]",
          icon: <CircleAlert className="h-5 w-5 shrink-0" />,
        };

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[100] sm:right-8 sm:top-8">
      <div
        className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_16px_45px_-18px_rgba(27,28,28,0.32)] backdrop-blur ${tone.wrapper}`}
        role="status"
        aria-live="polite"
      >
        {tone.icon}
        <p className="flex-1 text-sm font-medium leading-6">{message}</p>
        <button
          className="rounded-full p-1 transition hover:bg-black/5"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
