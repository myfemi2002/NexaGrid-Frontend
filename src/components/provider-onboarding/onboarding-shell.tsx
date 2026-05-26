"use client";

import Link from "next/link";
import { Check, CircleHelp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export const PROVIDER_ONBOARDING_STEPS = [
  { number: 1, title: "Create Account" },
  { number: 2, title: "Identity Verification" },
  { number: 3, title: "Business Documentation" },
  { number: 4, title: "Service Selection" },
  { number: 5, title: "Coverage Area" },
] as const;

type StepState = {
  step: number;
  completed: boolean;
  active: boolean;
};

type ProviderOnboardingShellProps = {
  currentStep: number;
  children: React.ReactNode;
  completedSteps?: number[];
  tipTitle?: string;
  tipBody?: string;
  supportTitle?: string;
  supportBody?: string;
};

function Stepper({ currentStep, completedSteps = [] }: { currentStep: number; completedSteps?: number[] }) {
  return (
    <aside className="rounded-[2rem] bg-transparent px-2 pt-4 lg:px-0">
      <h1 className="text-4xl font-bold tracking-[-0.04em] text-[#003b1b] md:text-5xl">Join the Network</h1>
      <p className="mt-5 max-w-sm text-lg leading-9 text-[#2f4538]">
        Complete these steps to start offering your services to millions across Nigeria.
      </p>

      <div className="mt-12 space-y-0">
        {PROVIDER_ONBOARDING_STEPS.map((item, index) => {
          const state: StepState = {
            step: item.number,
            completed: completedSteps.includes(item.number),
            active: currentStep === item.number,
          };

          return (
            <div key={item.number} className="relative flex gap-6 pb-12 last:pb-0">
              {index < PROVIDER_ONBOARDING_STEPS.length - 1 ? (
                <div className="absolute left-[18px] top-10 h-[calc(100%-8px)] w-px bg-[#b7c4b8]" />
              ) : null}
              <div
                className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                  state.completed
                    ? "border-[#003b1b] bg-[#003b1b] text-white"
                    : state.active
                      ? "border-[#003b1b] bg-white text-[#003b1b]"
                      : "border-[#b7c4b8] bg-[#b7c4b8] text-transparent"
                )}
              >
                {state.completed ? <Check className="size-4" /> : state.active ? <span className="h-4 w-4 rounded-full bg-[#003b1b]" /> : <span className="h-3 w-3 rounded-full bg-[#b7c4b8]" />}
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#2f4538]">Step {item.number}</p>
                <p className={cn("mt-2 text-[2rem] leading-[1.1] tracking-[-0.03em]", state.active || state.completed ? "font-semibold text-[#0b1c30]" : "font-medium text-[#33473a]")}>
                  {item.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function ProviderOnboardingShell({
  currentStep,
  children,
  completedSteps = [],
  tipTitle = "Verification Tip",
  tipBody = "Ensure the lighting is bright and all four corners of your document are visible in the photo. Blurred documents may lead to rejection.",
  supportTitle = "Need Help?",
  supportBody = "Chat with a merchant success agent.",
}: ProviderOnboardingShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f7ff] text-[#0b1c30]">
      <header className="border-b border-[#dbe4f1] bg-[#f4f7ff]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-12">
          <Link href="/" className="text-2xl font-bold tracking-[-0.03em] text-[#003b1b] md:text-3xl">
            NexaGrid
          </Link>
          <button className="flex items-center gap-3 text-lg font-medium text-[#23352c] transition hover:text-[#003b1b]" type="button">
            <span>Need help?</span>
            <CircleHelp className="size-6" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12 md:py-14">
        <div className="grid gap-10 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Stepper currentStep={currentStep} completedSteps={completedSteps} />

          <div className="space-y-8">
            {children}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <section className="rounded-[1.75rem] bg-[#0e6635] px-8 py-9 text-white shadow-[0_18px_40px_rgba(20,83,45,0.14)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#b8f5c6] text-[#003b1b]">
                  <Lightbulb className="size-8" />
                </div>
                <h3 className="mt-6 text-[2rem] font-semibold tracking-[-0.03em]">{tipTitle}</h3>
                <p className="mt-4 max-w-2xl text-lg leading-9 text-[#d4f3db]">{tipBody}</p>
              </section>

              <section className="rounded-[1.75rem] bg-[#8a5b00] px-8 py-9 text-white shadow-[0_18px_40px_rgba(138,91,0,0.18)]">
                <p className="text-sm uppercase tracking-[0.18em] text-[#ffcf83]">Support</p>
                <h3 className="mt-5 text-[2rem] font-semibold tracking-[-0.03em]">{supportTitle}</h3>
                <p className="mt-3 text-lg leading-8 text-[#ffd694]">{supportBody}</p>
                <button className="mt-10 w-full rounded-2xl bg-[#f5a623] px-5 py-4 text-lg font-semibold text-[#3d2400] transition hover:brightness-105" type="button">
                  Chat Now
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#dbe4f1] bg-[#f4f7ff]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-7 text-base text-[#23352c] md:px-12 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2024 NexaGrid Service Provider Network. Empowering Nigerian Commerce.</p>
          <div className="flex flex-wrap gap-8">
            <Link href="#" className="hover:text-[#003b1b] hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#003b1b] hover:underline">
              Merchant Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
