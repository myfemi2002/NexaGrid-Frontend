"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  company: z.string().min(2),
  message: z.string().min(12),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  return (
    <section className="mx-auto grid max-w-[1200px] gap-6 px-4 py-10 md:px-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="bg-emerald text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Contact</p>
        <h1 className="mt-4 font-heading text-5xl font-bold text-balance">Let&apos;s build commerce that works for your community.</h1>
        <p className="mt-5 text-xl text-white/80">
          Reach out for vendor onboarding, smart district launches, logistics partnerships, and local commerce support.
        </p>
      </Card>
      <Card>
        <form className="space-y-4">
          <Input placeholder="Full name" {...form.register("name")} />
          <Input placeholder="Work email" {...form.register("email")} />
          <Input placeholder="Business or organization" {...form.register("company")} />
          <Textarea placeholder="Tell us about your store, estate, campus, logistics network, or local marketplace." {...form.register("message")} />
          <Button type="submit">Send Message</Button>
        </form>
      </Card>
    </section>
  );
}
