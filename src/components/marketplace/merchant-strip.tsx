import { Gem, Leaf, PackageCheck, Sparkles } from "lucide-react";

const merchants = [
  { name: "Chinelo's Artisans", icon: Gem },
  { name: "Farm2Table", icon: Leaf },
  { name: "NeoGadgets", icon: PackageCheck },
  { name: "Luxe Naija", icon: Sparkles },
];

export function MerchantStrip() {
  return (
    <section id="trusted-merchants" className="py-16 text-center">
      <p className="text-sm text-[#707c8e]">Trusted Merchants</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[#394859]">
        {merchants.map((merchant) => {
          const Icon = merchant.icon;

          return (
            <div key={merchant.name} className="flex items-center gap-2 text-lg">
              <Icon className="size-4 text-[#59687a]" />
              <span>{merchant.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
