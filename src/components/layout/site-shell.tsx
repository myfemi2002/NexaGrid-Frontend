import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell min-h-screen bg-[#fcf9f8] text-[#1b1c1c]">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
