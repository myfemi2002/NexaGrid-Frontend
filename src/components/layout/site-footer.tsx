import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#d8ddd7]/70 bg-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 text-sm text-[#6a7069] md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        <div>
          <p className="font-heading text-3xl font-extrabold text-[#003b1b]">NexaGrid</p>
          <p className="mt-4 max-w-xs leading-7">
            The integrated platform for Nigeria&apos;s evolving commerce landscape. Empowering residents, merchants, and professionals through a unified digital grid.
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#8a9088]">Platform</p>
          <div className="space-y-3">
            <Link href="/" className="block hover:text-[#003b1b]">Home</Link>
            <Link href="/marketplace" className="block hover:text-[#003b1b]">Marketplace</Link>
            <Link href="/services" className="block hover:text-[#003b1b]">Services</Link>
            <Link href="/logistics" className="block hover:text-[#003b1b]">Logistics</Link>
            <Link href="/apartments" className="block hover:text-[#003b1b]">Apartments</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#8a9088]">Trust</p>
          <div className="space-y-3">
            <Link href="/auth/register" className="block hover:text-[#003b1b]">Merchant Verification</Link>
            <Link href="/contact" className="block hover:text-[#003b1b]">Safety Guidelines</Link>
            <Link href="/contact" className="block hover:text-[#003b1b]">Escrow Policy</Link>
            <Link href="/contact" className="block hover:text-[#003b1b]">Dispute Resolution</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#8a9088]">Support</p>
          <div className="space-y-3">
            <Link href="/contact" className="block hover:text-[#003b1b]">Help Center</Link>
            <Link href="/contact" className="block hover:text-[#003b1b]">Contact City Hub</Link>
            <Link href="/onboarding/vendor" className="block hover:text-[#003b1b]">Vendor FAQ</Link>
            <Link href="/pricing" className="block hover:text-[#003b1b]">App Support</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-[#d8ddd7]/70 px-4 py-8 text-xs text-[#727870] md:flex-row md:items-center md:justify-between md:px-6">
        <p>© 2024 NexaGrid Technology Hub. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/about" className="hover:text-[#003b1b]">Privacy Policy</Link>
          <Link href="/about" className="hover:text-[#003b1b]">Terms of Service</Link>
          <span className="font-bold text-[#003b1b]">₦ NGN</span>
        </div>
      </div>
    </footer>
  );
}
