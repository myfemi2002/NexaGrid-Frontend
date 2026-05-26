export default async function ServiceOrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-emerald-950 p-8 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Service order</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">Booking tracker</h1>
        <p className="mt-3 text-sm text-emerald-100 sm:text-base">Reference #{id}. Track quote, schedule, escrow, and completion in one place.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Quote accepted", "Technician on the way", "Job completion"].map((step, index) => (
          <div key={step} className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Step {index + 1}</p>
            <p className="mt-2 font-medium">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
