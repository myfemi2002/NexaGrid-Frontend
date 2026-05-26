import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const walletTransactions = [
  { id: "txn-001", title: "Escrow release", category: "Marketplace order", amount: "+₦24,500", status: "Completed", timestamp: "14 May • 2:20 PM" },
  { id: "txn-002", title: "Apartment booking hold", category: "Short-let payment", amount: "-₦45,000", status: "Held", timestamp: "14 May • 9:10 AM" },
  { id: "txn-003", title: "Rider payout", category: "Delivery earnings", amount: "+₦12,450", status: "Processing", timestamp: "13 May • 6:40 PM" },
];

export default function WalletPage() {
  return (
    <DashboardShell slug="wallet" title="Financial Overview" subtitle="Manage your NexaGrid wallet and escrow holdings.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="bg-emerald-950 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Available Balance</p>
          <p className="mt-4 font-heading text-5xl font-semibold sm:text-6xl">₦2,450,000.00</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-emerald-100">
            <span className="rounded-full bg-white/10 px-3 py-2">This month +₦450k</span>
            <span className="rounded-full bg-white/10 px-3 py-2">Wallet ID NG-882-991-002</span>
          </div>
          <div className="mt-8 flex gap-3">
            <Button className="bg-white text-emerald-950 hover:bg-white/90">Fund Wallet</Button>
            <Button variant="secondary">Transfer</Button>
          </div>
        </Card>

        <Card className="bg-muted">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Escrow Holdings</p>
          <p className="mt-4 font-heading text-4xl font-semibold text-emerald-950">₦128,400.00</p>
          <p className="mt-2 text-sm text-muted-foreground">Funds held for 3 active orders</p>
          <Button variant="subtle" className="mt-8 w-full">View Pending Releases</Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-3xl font-semibold">Recent Transactions</h2>
            <button className="text-sm font-medium text-emerald-950">See all</button>
          </div>
          <div className="space-y-3">
            {walletTransactions.map((transaction) => (
              <Card key={transaction.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {transaction.category} • {transaction.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-2xl font-semibold">{transaction.amount}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{transaction.status}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-muted">
            <p className="text-sm font-medium text-muted-foreground">Active Escrow Protection</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Order #NG-1022</p>
                    <p className="text-xs text-muted-foreground">Awaiting Delivery</p>
                  </div>
                  <span className="text-xs text-amber-700">Details</span>
                </div>
                <p className="mt-4 font-heading text-2xl font-semibold">₦85,000</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 opacity-80">
                <p className="text-sm font-semibold">Order #NG-0994</p>
                <p className="text-xs text-muted-foreground">Released</p>
                <p className="mt-4 font-heading text-2xl font-semibold">₦43,400</p>
              </div>
            </div>
          </Card>

          <Card className="bg-amber-50">
            <p className="text-sm font-medium text-amber-900">Secure Transaction</p>
            <p className="mt-3 text-sm text-amber-950/80">Your funds are protected by NexaGrid Escrow. Payment is only released when you confirm receipt.</p>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
