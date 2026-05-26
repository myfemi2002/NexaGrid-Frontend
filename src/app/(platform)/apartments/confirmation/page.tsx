import { Card } from "@/components/ui/card";

export default function ReservationConfirmationPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <Card className="text-center">
        <h1 className="font-heading text-5xl font-bold text-emerald">Reservation confirmed</h1>
        <p className="mt-4 text-lg text-warm-gray">Your stay has been saved, payment is secure, and the host has been notified.</p>
      </Card>
    </section>
  );
}
