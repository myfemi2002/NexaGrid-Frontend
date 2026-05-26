import { Card } from "@/components/ui/card";

export default function ServiceChatPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Service chat</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-5xl">Negotiate before you book.</h1>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">Live</span>
      </div>

      <Card className="mt-6 min-h-[32rem] p-4 sm:p-6">
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="max-w-[70%] rounded-2xl bg-muted px-4 py-3 text-sm">Hello, can you come this afternoon?</div>
            <div className="ml-auto max-w-[70%] rounded-2xl bg-emerald-950 px-4 py-3 text-sm text-white">Yes, I can be there by 3pm. Call-out fee is ₦5,000.</div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">Send a message, share photos, or confirm a quote.</div>
        </div>
      </Card>
    </section>
  );
}
